import axios from 'axios'

// 실제 인증 서버가 없으므로 JSONPlaceholder(무료 공개 목업 API, 키 불필요)에
// 진짜 axios 요청을 보내 로딩/응답/에러 흐름은 그대로 연습하되,
// 로그인 판정 자체는 이 브라우저의 localStorage에 남긴 "가입 계정" 목록으로 흉내낸다.
const client = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 8000,
})

const LOCAL_USERS_KEY = 'mock-auth-signup-users'

function readLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY)) ?? []
  } catch {
    return []
  }
}

function writeLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
}

/**
 * 목업 회원가입. JSONPlaceholder에 실제 POST 요청을 보내지만 서버에는
 * 저장되지 않으므로, 같은 브라우저에서 바로 로그인할 수 있도록
 * localStorage에도 계정을 기록해 둔다.
 */
export async function mockSignup({ name, email, password }) {
  const localUsers = readLocalUsers()
  if (localUsers.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('이미 가입된 이메일입니다.')
  }

  const { data } = await client.post('/users', { name, email, password })

  const user = { id: data.id, name, email }
  writeLocalUsers([...localUsers, { ...user, password }])
  return user
}

/**
 * 목업 로그인. 이 앱에서 직접 가입한 계정은 비밀번호까지 확인하고,
 * JSONPlaceholder의 고정 시드 유저 10명은 비밀번호 데이터가 없으므로
 * 이메일만 일치하면 로그인되도록 한다(테스트 계정: Sincere@april.biz).
 */
export async function mockLogin({ email, password }) {
  const localUsers = readLocalUsers()
  const localMatch = localUsers.find((user) => user.email.toLowerCase() === email.toLowerCase())
  if (localMatch) {
    if (localMatch.password !== password) {
      throw new Error('비밀번호가 일치하지 않습니다.')
    }
    return { id: localMatch.id, name: localMatch.name, email: localMatch.email }
  }

  const { data } = await client.get('/users')
  const seedMatch = data.find((user) => user.email.toLowerCase() === email.toLowerCase())
  if (!seedMatch) {
    throw new Error('가입되지 않은 이메일입니다.')
  }
  return { id: seedMatch.id, name: seedMatch.name, email: seedMatch.email }
}
