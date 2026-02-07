import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { isAdmin, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (isAdmin) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(username, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 sm:mt-16">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#4D007B] px-4 sm:px-8 py-4 sm:py-6">
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-300 text-sm mt-1">Sign in to manage team data</p>
        </div>
        <form onSubmit={handleSubmit} className="p-4 sm:p-8 flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "login-error" : undefined}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4D007B]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "login-error" : undefined}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4D007B]"
            />
          </div>
          {error && <p id="login-error" className="text-red-600 text-sm" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            aria-live="polite"
            className="w-full py-3 rounded-lg bg-[#4D007B] text-white font-semibold hover:bg-[#3a0059] transition-colors disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[#FFD700] min-h-[44px]"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
