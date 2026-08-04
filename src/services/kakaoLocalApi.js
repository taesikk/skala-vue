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
const EXCLUDED_CATEGORY_PATTERN = /카페|디저트/

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
 * 주어진 좌표 주변의 "맛집"을 키워드 검색으로 조회한다.
 * 카페/디저트 카테고리는 제외하고, 가까운 순으로 최대 limit개를 반환한다.
 * (카카오 로컬 API 응답에는 별점 데이터가 없어 별점순 정렬은 지원하지 않는다.)
 */
export async function searchRestaurantsNearby(lat, lon, { radius = 2000, limit = 6 } = {}) {
  assertRestKey()

  const { data } = await client.get('/search/keyword.json', {
    headers: { Authorization: `KakaoAK ${REST_KEY}` },
    params: {
      query: '맛집',
      x: lon,
      y: lat,
      radius,
      size: RAW_FETCH_SIZE,
      sort: 'distance',
    },
  })

  return (data.documents ?? [])
    .filter((doc) => !EXCLUDED_CATEGORY_PATTERN.test(doc.category_name ?? ''))
    .slice(0, limit)
    .map(normalizePlace)
}
