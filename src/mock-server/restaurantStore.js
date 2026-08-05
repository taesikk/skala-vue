import { SEED_RESTAURANTS } from './restaurantData'

// DB 없이 메모리 배열로 데이터를 관리하는 인메모리 스토어.
let restaurants = structuredClone(SEED_RESTAURANTS)
let nextId = restaurants.length + 1

export function resetRestaurants() {
  restaurants = structuredClone(SEED_RESTAURANTS)
  nextId = restaurants.length + 1
}

// 검색 키워드는 가게 이름 또는 주소 중 하나라도 일치하면 결과에 포함한다.
export function listRestaurants({ keyword = '' } = {}) {
  const trimmed = keyword.trim()
  if (!trimmed) return restaurants

  return restaurants.filter(
    (item) => item.name.includes(trimmed) || item.address.includes(trimmed),
  )
}

export function findRestaurantById(id) {
  return restaurants.find((item) => item.id === id) ?? null
}

export function insertRestaurant(payload) {
  const restaurant = {
    id: nextId++,
    createdAt: new Date().toISOString(),
    ...payload,
  }
  restaurants = [restaurant, ...restaurants]
  return restaurant
}

export function updateRestaurantById(id, payload) {
  const index = restaurants.findIndex((item) => item.id === id)
  if (index === -1) return null

  const updated = { ...restaurants[index], ...payload, id }
  restaurants = [...restaurants.slice(0, index), updated, ...restaurants.slice(index + 1)]
  return updated
}

export function deleteRestaurantById(id) {
  const exists = restaurants.some((item) => item.id === id)
  if (!exists) return false

  restaurants = restaurants.filter((item) => item.id !== id)
  return true
}
