import { handleRestaurantRequest } from '@/mock-server/restaurantServer'

// 실제 네트워크 왕복을 흉내내기 위한 인위적 지연.
const ARTIFICIAL_DELAY_MS = 350

function buildUrl(config) {
  const base = config.baseURL ?? ''
  const url = config.url ?? ''
  return `${base}${url}`
}

/**
 * axios의 커스텀 어댑터. 실제 XHR/fetch 대신 이 함수가 "전송 계층" 역할을 하며,
 * 내부적으로는 restaurantServer.js의 핸들러(정규식 라우팅 + 인메모리 스토어)를 호출한다.
 * 성공/실패 모두 axios가 기대하는 응답/에러 형태를 그대로 흉내낸다.
 */
export function mockServerAdapter(config) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const { status, data } = handleRestaurantRequest({
          method: config.method,
          url: buildUrl(config),
          data: config.data,
        })

        resolve({
          data,
          status,
          statusText: 'OK',
          headers: {},
          config,
          request: {},
        })
      } catch (err) {
        const status = err.status ?? 500
        const error = new Error(err.message)
        error.config = config
        error.response = {
          data: { message: err.message },
          status,
          statusText: 'Error',
          headers: {},
          config,
        }
        reject(error)
      }
    }, ARTIFICIAL_DELAY_MS)
  })
}
