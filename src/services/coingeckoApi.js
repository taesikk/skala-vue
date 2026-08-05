import axios from 'axios'

// CoinGecko 트렌딩 코인 검색 API — API 키 불필요, CORS 완전 공개(access-control-allow-origin: *)
// https://docs.coingecko.com/reference/trending-search
const client = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 8000,
})

/**
 * 지금 가장 많이 검색되는 코인 TOP N을 조회한다.
 */
export async function fetchTrendingCoins(limit = 5) {
  const { data } = await client.get('/search/trending')
  const coins = data?.coins ?? []

  return coins.slice(0, limit).map(({ item }) => ({
    id: item.id,
    primary: `${item.name} (${item.symbol?.toUpperCase() ?? ''})`,
    secondary: item.market_cap_rank ? `시가총액 ${item.market_cap_rank}위` : '',
  }))
}
