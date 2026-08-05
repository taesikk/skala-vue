// 브라우저 Geolocation API를 Promise로 감싼 유틸.
// 캠핑 탭에서 "내 위치로 찾기" 기능에 사용되며, 권한 거부 등
// 에러 상황을 사용자에게 보여줄 문구로 변환해 reject한다.

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저는 위치 정보 기능을 지원하지 않습니다.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error('위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.'))
        } else {
          reject(new Error('현재 위치를 확인할 수 없습니다.'))
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    )
  })
}
