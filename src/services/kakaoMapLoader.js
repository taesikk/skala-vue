// 카카오맵 JavaScript SDK를 동적으로 한 번만 로드하는 싱글턴 로더.
// 이미 로드됐으면 캐시된 Promise를 재사용해 스크립트를 중복 삽입하지 않는다.
// https://apis.map.kakao.com/web/guide/

const JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY

let loadPromise = null

export function loadKakaoMaps() {
  if (window.kakao?.maps?.Map) {
    return Promise.resolve(window.kakao)
  }

  if (loadPromise) {
    return loadPromise
  }

  loadPromise = new Promise((resolve, reject) => {
    if (!JS_KEY) {
      loadPromise = null
      reject(
        new Error(
          '카카오 JavaScript API 키가 설정되지 않았습니다. .env 파일에 VITE_KAKAO_JS_KEY를 추가해주세요.',
        ),
      )
      return
    }

    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${JS_KEY}&autoload=false&libraries=services`
    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao))
    }
    script.onerror = () => {
      loadPromise = null
      reject(new Error('카카오맵 스크립트를 불러오지 못했습니다.'))
    }
    document.head.appendChild(script)
  })

  return loadPromise
}
