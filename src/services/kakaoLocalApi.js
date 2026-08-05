import axios from 'axios'

// 카카오 로컬 API — 키워드로 장소 검색 (무료, REST API 키 필요)
// https://developers.kakao.com/docs/latest/ko/local/dev-guide#search-by-keyword
const REST_KEY = import.meta.env.VITE_KAKAO_REST_KEY

const client = axios.create({
  baseURL: 'https://dapi.kakao.com/v2/local',
  timeout: 8000,
})

function assertRestKey() {
  if (!REST_KEY) {
    throw new Error(
      '카카오 REST API 키가 설정되지 않았습니다. .env 파일에 VITE_KAKAO_REST_KEY를 추가해주세요.',
    )
  }
}

const RAW_FETCH_SIZE = 15

function normalizePlace(doc) {
  return {
    id: doc.id,
    name: doc.place_name,
    category: doc.category_name?.split(' > ').pop() || doc.category_name || '',
    address: doc.road_address_name || doc.address_name || '',
    phone: doc.phone || '',
    lat: Number(doc.y),
    lon: Number(doc.x),
    distance: doc.distance ? Number(doc.distance) : null,
    placeUrl: doc.place_url,
  }
}

/**
 * 카카오 로컬 키워드 검색 API를 직접 호출하는 저수준 함수.
 * lat/lon이 주어지면 그 좌표 기준 거리순으로, 없으면 검색어 정확도순(전국)으로 검색한다.
 */
async function searchKeyword(query, { lat, lon, radius, size = RAW_FETCH_SIZE, exclude } = {}) {
  assertRestKey()

  const params = { query, size }
  if (lat != null && lon != null) {
    params.x = lon
    params.y = lat
    params.sort = 'distance'
    if (radius) params.radius = radius
  }

  const { data } = await client.get('/search/keyword.json', {
    headers: { Authorization: `KakaoAK ${REST_KEY}` },
    params,
  })

  return (data.documents ?? [])
    .filter((doc) => !exclude?.test(doc.category_name ?? ''))
    .map(normalizePlace)
}

/**
 * 주어진 좌표 주변을 키워드로 검색하는 공용 함수.
 * (카카오 로컬 API 응답에는 별점 데이터가 없어 별점순 정렬은 지원하지 않는다.)
 */
async function searchPlacesNearby(query, lat, lon, { radius = 2000, limit = 6, exclude } = {}) {
  const places = await searchKeyword(query, { lat, lon, radius, exclude })
  return places.slice(0, limit)
}

/**
 * 주어진 좌표 주변의 "맛집"을 조회한다. 카페/디저트 카테고리는 제외한다.
 */
export function searchRestaurantsNearby(lat, lon, options = {}) {
  return searchPlacesNearby('맛집', lat, lon, { ...options, exclude: /카페|디저트/ })
}

/**
 * 주어진 좌표 주변의 "캠핑장"을 조회한다.
 * 기본 반경(2km) 안에 결과가 없으면, 카카오 로컬 API가 허용하는 최대 반경(20km)으로
 * 넓혀서 거리순으로 가장 가까운 3곳을 대신 반환한다. 이 경우 extended: true로 표시한다.
 */
export async function searchCampsitesNearby(lat, lon, options = {}) {
  const nearby = await searchPlacesNearby('캠핑장', lat, lon, { radius: 2000, limit: 6, ...options })
  if (nearby.length > 0) {
    return { places: nearby, extended: false }
  }

  const widened = await searchPlacesNearby('캠핑장', lat, lon, {
    ...options,
    radius: 20000,
    limit: 3,
  })
  return { places: widened, extended: true }
}

/**
 * 지역/캠핑장 이름 등 키워드로 전국 캠핑장을 검색한다 (위치 정보 불필요).
 */
export async function searchCampsitesByKeyword(keyword, { limit = 8 } = {}) {
  const query = /캠핑/.test(keyword) ? keyword : `${keyword} 캠핑장`
  const places = await searchKeyword(query, {})
  return places.slice(0, limit)
}
