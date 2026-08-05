// Open-Meteo Forecast API로 날씨를 조회하는 서비스.
// 키가 필요 없는 무료 API이며, WMO 날씨 코드를 앱에서 쓰는
// 6가지 상태 라벨(맑음/구름/비/눈 등)로 정규화한다.

import axios from 'axios'

// https://open-meteo.com/en/docs
const client = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 8000,
})

/**
 * Open-Meteo의 WMO weather_code(https://open-meteo.com/en/docs 하단 표)를
 * 이 앱에서 쓰는 6가지 상태 라벨로 정규화한다.
 */
const WEATHER_CODE_RULES = [
  { codes: [0], status: '맑음' },
  { codes: [1, 2], status: '약간 구름' },
  { codes: [3, 45, 48], status: '구름' },
  {
    codes: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
    status: '비',
  },
  { codes: [71, 73, 75, 77, 85, 86], status: '눈' },
  { codes: [95, 96, 99], status: '번개' },
]

function mapWeatherCodeToStatus(code) {
  return WEATHER_CODE_RULES.find((rule) => rule.codes.includes(code))?.status ?? '구름'
}

/**
 * 위도/경도 기준으로 현재 날씨를 조회한다. (Open-Meteo Forecast API, 무료/키 불필요)
 */
export async function fetchCurrentWeatherByCoords(lat, lon) {
  const { data } = await client.get('/forecast', {
    params: {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
      wind_speed_unit: 'ms',
      timezone: 'auto',
    },
  })

  const current = data.current
  return {
    temp: Math.round(current.temperature_2m),
    status: mapWeatherCodeToStatus(current.weather_code),
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
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
