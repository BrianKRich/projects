import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/athletes', label: 'Athletes' },
  { to: '/meets', label: 'Meets' },
  { to: '/rankings', label: 'Rankings' },
  { to: '/coaches', label: 'Coaches' },
]

function linkClass({ isActive }) {
  return isActive
    ? 'text-[#FFD700] font-semibold border-b-2 border-[#FFD700] pb-0.5'
    : 'text-white hover:text-[#FFD700] transition-colors'
}

function mobileLinkClass({ isActive }) {
  return (
    'block px-4 py-2 rounded ' +
    (isActive
      ? 'bg-[#3a0059] text-[#FFD700] font-semibold'
      : 'text-white hover:bg-[#3a0059] hover:text-[#FFD700] transition-colors')
  )
}

export default function Layout() {
  const { isAdmin, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-[#4D007B] shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <NavLink to="/" className="flex items-center gap-2">
              <span className="text-white text-xl font-bold">Jones County</span>
              <span className="text-[#FFD700] text-xl font-bold">Greyhounds</span>
            </NavLink>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
                  {label}
                </NavLink>
              ))}
              {isAdmin ? (
                <>
                  <NavLink to="/admin" className={linkClass}>Admin</NavLink>
                  <button
                    onClick={logout}
                    className="ml-2 px-3 py-1 rounded bg-[#FFD700] text-[#4D007B] text-sm font-semibold hover:bg-[#e6c200] transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" className={linkClass}>Login</NavLink>
              )}
            </nav>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
                {label}
              </NavLink>
            ))}
            {isAdmin ? (
              <>
                <NavLink to="/admin" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Admin</NavLink>
                <button
                  onClick={() => { logout(); setMenuOpen(false) }}
                  className="mt-2 px-4 py-2 rounded bg-[#FFD700] text-[#4D007B] text-sm font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Login</NavLink>
            )}
          </div>
        )}
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-[#4D007B] text-white text-center py-4 text-sm">
        <p>Jones County Greyhounds Cross Country &mdash; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
