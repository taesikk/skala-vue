// JSON 응답/에러 응답을 만드는 공통 유틸 + 프레임워크 없이 손으로 구현한 유효성 검사.

export function jsonResponse(status, data) {
  return { status, data }
}

export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

const REQUIRED_FIELDS = ['name', 'region', 'category', 'address']

/**
 * 등록(POST) 입력을 검증하고 정규화한다.
 * - 필수 필드 누락/공백 문자열 검사
 * - rating은 1~5 정수로 보정
 * - 문자열 필드는 앞뒤 공백 제거
 */
export function validateAndNormalizeCreatePayload(body) {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, '요청 본문이 올바르지 않습니다.')
  }

  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || String(body[field]).trim() === '') {
      throw new HttpError(400, `${field} 값은 필수입니다.`)
    }
  }

  const rating = Number(body.rating)
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw new HttpError(400, 'rating은 1~5 사이의 숫자여야 합니다.')
  }

  return {
    name: String(body.name).trim(),
    region: String(body.region).trim(),
    category: String(body.category).trim(),
    address: String(body.address).trim(),
    rating: Math.round(rating),
    memo: body.memo ? String(body.memo).trim() : '',
  }
}

/**
 * 수정(PATCH) 입력을 검증한다. 부분 업데이트이므로 보내진 필드만 검사한다.
 */
export function validateAndNormalizeUpdatePayload(body) {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, '요청 본문이 올바르지 않습니다.')
  }

  const normalized = {}

  for (const field of REQUIRED_FIELDS) {
    if (field in body) {
      if (!body[field] || String(body[field]).trim() === '') {
        throw new HttpError(400, `${field} 값은 비어 있을 수 없습니다.`)
      }
      normalized[field] = String(body[field]).trim()
    }
  }

  if ('rating' in body) {
    const rating = Number(body.rating)
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      throw new HttpError(400, 'rating은 1~5 사이의 숫자여야 합니다.')
    }
    normalized.rating = Math.round(rating)
  }

  if ('memo' in body) {
    normalized.memo = String(body.memo).trim()
  }

  return normalized
}
