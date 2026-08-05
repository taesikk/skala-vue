import {
  listRestaurants,
  findRestaurantById,
  insertRestaurant,
  updateRestaurantById,
  deleteRestaurantById,
} from './restaurantStore'
import {
  jsonResponse,
  HttpError,
  validateAndNormalizeCreatePayload,
  validateAndNormalizeUpdatePayload,
} from './httpUtils'

// 정규식으로 경로를 매칭해 GET(목록/검색/단건), POST, PATCH, DELETE를 직접 분기 처리한다.
const LIST_PATH = /^\/api\/restaurants\/?$/
const ITEM_PATH = /^\/api\/restaurants\/(\d+)$/

/**
 * 실제 서버 없이 axios 어댑터에서 호출되는 "서버 핸들러".
 * @param {{ method: string, url: string, data?: any }} request
 * @returns {{ status: number, data: any }}
 */
export function handleRestaurantRequest({ method, url, data }) {
  const { pathname, searchParams } = new URL(url, 'http://mock.local')
  const httpMethod = method.toUpperCase()

  const itemMatch = pathname.match(ITEM_PATH)

  if (LIST_PATH.test(pathname)) {
    if (httpMethod === 'GET') {
      const results = listRestaurants({
        keyword: searchParams.get('keyword') ?? '',
      })
      return jsonResponse(200, results)
    }

    if (httpMethod === 'POST') {
      const payload = validateAndNormalizeCreatePayload(data)
      const created = insertRestaurant(payload)
      return jsonResponse(201, created)
    }

    throw new HttpError(405, `지원하지 않는 메서드입니다: ${httpMethod}`)
  }

  if (itemMatch) {
    const id = Number(itemMatch[1])

    if (httpMethod === 'GET') {
      const found = findRestaurantById(id)
      if (!found) throw new HttpError(404, '맛집을 찾을 수 없습니다.')
      return jsonResponse(200, found)
    }

    if (httpMethod === 'PATCH') {
      const payload = validateAndNormalizeUpdatePayload(data)
      const updated = updateRestaurantById(id, payload)
      if (!updated) throw new HttpError(404, '맛집을 찾을 수 없습니다.')
      return jsonResponse(200, updated)
    }

    if (httpMethod === 'DELETE') {
      const removed = deleteRestaurantById(id)
      if (!removed) throw new HttpError(404, '맛집을 찾을 수 없습니다.')
      return jsonResponse(204, null)
    }

    throw new HttpError(405, `지원하지 않는 메서드입니다: ${httpMethod}`)
  }

  throw new HttpError(404, `일치하는 경로가 없습니다: ${pathname}`)
}
