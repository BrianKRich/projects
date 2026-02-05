import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('xc_token')
    if (stored) {
      const parts = stored.split('.')
      if (parts.length === 2) {
        const colonIdx = parts[0].lastIndexOf(':')
        if (colonIdx > 0) {
          const expiry = parseInt(parts[0].slice(colonIdx + 1), 10)
          if (Date.now() / 1000 < expiry) {
            const username = parts[0].slice(0, colonIdx)
            setUser(username)
            setToken(stored)
            return
          }
        }
      }
      sessionStorage.removeItem('xc_token')
    }
  }, [])

  async function login(username, password) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Login failed')
    }
    const { token: t } = await res.json()
    sessionStorage.setItem('xc_token', t)
    setToken(t)
    setUser(username)
  }

  function logout() {
    sessionStorage.removeItem('xc_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin: user !== null }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
