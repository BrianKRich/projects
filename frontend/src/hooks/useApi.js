import { useAuth } from '../context/AuthContext'

export function useApi() {
  const { token } = useAuth()

  function authHeaders(hasBody) {
    const h = {}
    if (hasBody) h['Content-Type'] = 'application/json'
    if (token) h['Authorization'] = `Bearer ${token}`
    return h
  }

  async function get(url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`)
    return res.json()
  }

  async function post(url, body) {
    const res = await fetch(url, {
      method: 'POST',
      headers: authHeaders(true),
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`POST ${url} failed: ${res.status} ${text}`)
    }
    return res.json()
  }

  async function put(url, body) {
    const res = await fetch(url, {
      method: 'PUT',
      headers: authHeaders(true),
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`PUT ${url} failed: ${res.status} ${text}`)
    }
    return res.json()
  }

  async function del(url) {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: authHeaders(false),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`DELETE ${url} failed: ${res.status} ${text}`)
    }
  }

  return { get, post, put, del }
}
