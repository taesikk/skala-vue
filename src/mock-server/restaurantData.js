/**
 * "나만의 전국 맛집" 초기 시드 데이터.
 * 실제 서버가 없으므로 이 배열을 인메모리 DB의 초기 상태로 사용한다.
 */
export const SEED_RESTAURANTS = [
  {
    id: 1,
    name: '톤쇼우',
    region: '부산',
    category: '일식',
    address: '부산 금정구 금강로 247-10',
    rating: 5,
    memo: '돈까스는 그냥 여기. 웨이팅 엄청남',
    createdAt: '2026-07-25T09:00:00.000Z',
  },
  {
    id: 2,
    name: '오씨칼국수',
    region: '대전',
    category: '한식',
    address: '대전광역시 동구 옛신탄진로 13',
    rating: 5,
    memo: '해물파전도 맛있는 집!',
    createdAt: '2026-08-01T09:00:00.000Z',
  },
  {
    id: 3,
    name: '강경해물칼국수',
    region: '충남 논산',
    category: '한식',
    address: '충청남도 논산시 강경읍 계백로147번길 7',
    rating: 5,
    memo: '해산물 짱많음',
    createdAt: '2026-08-02T09:00:00.000Z',
  },
]
