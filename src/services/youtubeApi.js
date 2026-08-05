import axios from 'axios'

// YouTube Data API v3 — 대한민국 인기 급상승 동영상 차트
// https://developers.google.com/youtube/v3/docs/videos/list
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

const client = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  timeout: 8000,
})

function assertApiKey() {
  if (!API_KEY) {
    throw new Error(
      'YouTube Data API 키가 설정되지 않았습니다. .env 파일에 VITE_YOUTUBE_API_KEY를 추가해주세요.',
    )
  }
}

/**
 * 대한민국 인기 급상승 동영상 TOP N을 조회한다.
 */
export async function fetchPopularVideos(limit = 5) {
  assertApiKey()

  const { data } = await client.get('/videos', {
    params: {
      part: 'snippet,statistics',
      chart: 'mostPopular',
      regionCode: 'KR',
      maxResults: limit,
      key: API_KEY,
    },
  })

  const items = data?.items ?? []
  return items.map((video) => ({
    id: video.id,
    primary: video.snippet?.title ?? '',
    secondary: `${video.snippet?.channelTitle ?? ''} · 조회수 ${Number(
      video.statistics?.viewCount ?? 0,
    ).toLocaleString()}회`,
    thumbnail:
      video.snippet?.thumbnails?.medium?.url ?? video.snippet?.thumbnails?.default?.url ?? '',
    url: `https://www.youtube.com/watch?v=${video.id}`,
  }))
}
