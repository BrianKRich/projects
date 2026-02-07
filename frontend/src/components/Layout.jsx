import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/athletes', label: 'Athletes', icon: '👤' },
  { to: '/meets', label: 'Meets', icon: '📊' },
  { to: '/rankings', label: 'Rankings', icon: '📈' },
  { to: '/coaches', label: 'Coaches', icon: '🏫' },
]

function linkClass({ isActive }) {
  return (
    'focus-visible:outline-[#FFD700] ' +
    (isActive
      ? 'text-[#FFD700] font-semibold border-b-2 border-[#FFD700] pb-0.5'
      : 'text-white hover:text-[#FFD700] transition-colors')
  )
}

function mobileLinkClass({ isActive }) {
  return (
    'block px-4 py-2 rounded focus-visible:outline-[#FFD700] ' +
    (isActive
      ? 'bg-[#3a0059] text-[#FFD700] font-semibold'
      : 'text-white hover:bg-[#3a0059] hover:text-[#FFD700] transition-colors')
  )
}

export default function Layout() {
  const { isAdmin, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Close menu on Escape key
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [menuOpen])

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [menuOpen])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <a
        href="#main-content"
        className="absolute left-2 top-2 z-50 px-4 py-2 bg-[#FFD700] text-[#4D007B] rounded font-semibold -translate-y-full focus-visible:translate-y-0 transition-transform"
      >
        Skip to main content
      </a>
      <header className="shadow-lg">
        {/* Logo strip */}
        <NavLink to="/" className="block bg-white py-3 px-4">
          <div className="max-w-6xl mx-auto flex justify-center">
            <img src="/jc-logo.jpg" alt="Jones County Cross Country" className="w-[36rem] sm:w-[48rem] max-w-full" />
          </div>
        </NavLink>
        <div className="w-full h-px bg-[#d4b5e8]" />

        {/* Purple nav bar */}
        <div className="bg-[#4D007B]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center h-14 relative">
              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
                {navLinks.map(({ to, label, icon }) => (
                  <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
                    <span aria-hidden="true">{icon} </span>{label}
                  </NavLink>
                ))}
                {isAdmin ? (
                  <>
                    <NavLink to="/admin" className={linkClass}><span aria-hidden="true">⚙️ </span>Admin</NavLink>
                    <button
                      onClick={logout}
                      className="ml-2 px-3 py-1 rounded bg-[#FFD700] text-[#4D007B] text-sm font-semibold hover:bg-[#e6c200] transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <NavLink to="/login" className={linkClass}><span aria-hidden="true">🔐 </span>Login</NavLink>
                )}
              </nav>

              {/* Mobile: brand text + hamburger */}
              <div className="md:hidden flex items-center justify-between w-full">
                <NavLink to="/" className="flex items-center gap-2">
                  <span className="text-white text-base font-bold">Jones County</span>
                  <span className="text-[#FFD700] text-base font-bold">Greyhounds</span>
                </NavLink>
                <button
                  className="text-white focus-visible:outline-[#FFD700] p-2 -mr-2"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {menuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav id="mobile-menu" className="md:hidden px-4 pb-4 flex flex-col gap-1 bg-[#4D007B]" aria-label="Mobile navigation">
            {navLinks.map(({ to, label, icon }) => (
              <NavLink key={to} to={to} end={to === '/'} className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
                <span aria-hidden="true">{icon} </span>{label}
              </NavLink>
            ))}
            {isAdmin ? (
              <>
                <NavLink to="/admin" className={mobileLinkClass} onClick={() => setMenuOpen(false)}><span aria-hidden="true">⚙️ </span>Admin</NavLink>
                <button
                  onClick={() => { logout(); setMenuOpen(false) }}
                  className="mt-2 px-4 py-2 rounded bg-[#FFD700] text-[#4D007B] text-sm font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className={mobileLinkClass} onClick={() => setMenuOpen(false)}><span aria-hidden="true">🔐 </span>Login</NavLink>
            )}
          </nav>
        )}
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="bg-[#4D007B] text-white text-center py-4 text-sm">
        <p>Jones County Greyhounds Cross Country &mdash; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
