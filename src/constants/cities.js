export const CITY_LIST = [
  { id: 'city_01', name: '서울', region: '대한민국 서울특별시', lat: 37.5665, lon: 126.978 },
  { id: 'city_02', name: '수원', region: '대한민국 경기도 수원시', lat: 37.2636, lon: 127.0286 },
  { id: 'city_03', name: '부산', region: '대한민국 부산광역시', lat: 35.1796, lon: 129.0756 },
  { id: 'city_04', name: '인천', region: '대한민국 인천광역시', lat: 37.4563, lon: 126.7052 },
  { id: 'city_05', name: '강릉', region: '대한민국 강원특별자치도 강릉시', lat: 37.7519, lon: 128.8761 },
  { id: 'city_06', name: '광주', region: '대한민국 광주광역시', lat: 35.1595, lon: 126.8526 },
]

export function getCityById(cityId) {
  return CITY_LIST.find((city) => city.id === cityId) ?? null
}
