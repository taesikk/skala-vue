// 날씨 상태 문자열(맑음/구름/비/눈/번개 등)을 이모지·애니메이션 키·
// 그라디언트·색상으로 매핑하는 상수와 조회 헬퍼 함수 모음.

export const STATUS_EMOJI = {
  맑음: '☀️',
  구름: '☁️',
  '약간 구름': '⛅',
  비: '🌧️',
  눈: '🌨️',
  번개: '⛈️',
}

export const STATUS_ANIM_KEY = {
  맑음: 'sunny',
  구름: 'cloudy',
  '약간 구름': 'cloudy',
  비: 'rain',
  눈: 'snow',
  번개: 'thunder',
}

export const STATUS_GRADIENT = {
  맑음: 'var(--gradient-sunny)',
  구름: 'var(--gradient-cloud)',
  '약간 구름': 'var(--gradient-partly)',
  비: 'var(--gradient-rain)',
  눈: 'var(--gradient-snow)',
  번개: 'var(--gradient-storm)',
}

/** 상세보기 팝업 blob 애니메이션에 쓰이는 날씨별 대표 색상 */
export const STATUS_BLOB_COLOR = {
  맑음: '#f97316',
  구름: '#64748b',
  '약간 구름': '#fbbf24',
  비: '#2563eb',
  눈: '#0ea5e9',
  번개: '#7c3aed',
}

export function getStatusEmoji(status) {
  return STATUS_EMOJI[status] ?? '🌡️'
}

export function getStatusAnimKey(status) {
  return STATUS_ANIM_KEY[status] ?? 'default'
}

export function getStatusGradient(status) {
  return STATUS_GRADIENT[status] ?? 'var(--gradient-cloud)'
}

export function getStatusBlobColor(status) {
  return STATUS_BLOB_COLOR[status] ?? '#64748b'
}
