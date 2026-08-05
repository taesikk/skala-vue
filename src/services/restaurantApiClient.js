import axios from 'axios'
import { mockServerAdapter } from './mockServerAdapter'

// Axios 인스턴스 설정: baseURL, timeout, 커스텀 어댑터(=목업 서버), 공통 에러 인터셉터.
const client = axios.create({
  baseURL: '/api/restaurants',
  timeout: 5000,
  adapter: mockServerAdapter,
  transformRequest: [(data) => data],
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? '요청 처리 중 오류가 발생했습니다.'
    return Promise.reject(new Error(message))
  },
)

function toQueryString(params) {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
  const query = new URLSearchParams(entries).toString()
  return query ? `?${query}` : ''
}

export async function getAll({ keyword = '' } = {}) {
  const { data } = await client.get(toQueryString({ keyword }))
  return data
}

export async function getById(id) {
  const { data } = await client.get(`/${id}`)
  return data
}

export async function create(payload) {
  const { data } = await client.post('', payload)
  return data
}

export async function update(id, payload) {
  const { data } = await client.patch(`/${id}`, payload)
  return data
}

export async function remove(id) {
  await client.delete(`/${id}`)
}
