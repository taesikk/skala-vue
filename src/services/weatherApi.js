// WeatherAPI.com Current Weather API로 날씨를 조회하는 서비스.
// 무료 티어가 키 단위로 월 100만 콜을 제공해(Open-Meteo처럼 IP 공유 한도가 아님),
// condition.code를 앱에서 쓰는 6가지 상태 라벨(맑음/구름/비/눈 등)로 정규화한다.

import axios from 'axios'

// https://www.weatherapi.com/docs/
const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY

const client = axios.create({
  baseURL: 'https://api.weatherapi.com/v1',
  timeout: 8000,
})

function assertApiKey() {
  if (!API_KEY) {
    throw new Error(
      'WeatherAPI.com API 키가 설정되지 않았습니다. .env 파일에 VITE_WEATHERAPI_KEY를 추가해주세요.',
    )
  }
}

/**
 * WeatherAPI.com의 condition.code(https://www.weatherapi.com/docs/weather_conditions.json)를
 * 이 앱에서 쓰는 6가지 상태 라벨로 정규화한다.
 */
const WEATHER_CODE_RULES = [
  { codes: [1000], status: '맑음' },
  { codes: [1003], status: '약간 구름' },
  { codes: [1006, 1009, 1030, 1135, 1147], status: '구름' },
  {
    codes: [
      1063, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240,
      1243, 1246,
    ],
    status: '비',
  },
  {
    codes: [
      1066, 1069, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252,
      1255, 1258, 1261, 1264,
    ],
    status: '눈',
  },
  { codes: [1087, 1273, 1276, 1279, 1282], status: '번개' },
]

function mapConditionCodeToStatus(code) {
  return WEATHER_CODE_RULES.find((rule) => rule.codes.includes(code))?.status ?? '구름'
}

function normalizeCurrentWeather(current) {
  return {
    temp: Math.round(current.temp_c),
    status: mapConditionCodeToStatus(current.condition?.code),
    humidity: current.humidity,
    windSpeed: Math.round((current.wind_kph / 3.6) * 10) / 10,
  }
}

/**
 * axios 에러를 화면에 그대로 보여줄 수 있는 한국어 메시지로 변환한다.
 * (사용량 초과는 WeatherAPI.com 기준 HTTP 403 + error.code 2007/2008로 온다.)
 */
function toFriendlyErrorMessage(err) {
  const status = err.response?.status
  const apiErrorCode = err.response?.data?.error?.code

  if (status === 429 || apiErrorCode === 2007 || apiErrorCode === 2008) {
    return '날씨 API 사용량을 초과했습니다. 잠시 후 다시 시도해 주세요.'
  }

  return err.response?.data?.error?.message || '날씨 정보를 가져오지 못했습니다.'
}

/**
 * 위도/경도 기준으로 현재 날씨를 조회한다.
 */
export async function fetchCurrentWeatherByCoords(lat, lon) {
  assertApiKey()

  try {
    const { data } = await client.get('/current.json', {
      params: { key: API_KEY, q: `${lat},${lon}` },
    })
    return normalizeCurrentWeather(data.current)
  } catch (err) {
    throw new Error(toFriendlyErrorMessage(err), { cause: err })
  }
}

/**
 * 여러 도시의 날씨를 병렬로 조회해 도시 정보와 합쳐 반환한다.
 * cityList: [{ id, name, region, lat, lon }]
 */
export async function fetchWeatherForCities(cityList) {
  const results = await Promise.all(
    cityList.map(async (city) => {
      const weather = await fetchCurrentWeatherByCoords(city.lat, city.lon)
      return { ...city, ...weather }
    }),
  )
  return results
}
