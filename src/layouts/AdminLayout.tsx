import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/odds', label: 'Odds' },
  { to: '/admin/settlement', label: 'Settlement' },
  { to: '/admin/tokens', label: 'Tokens' },
]

export function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="brand">AI Predict Admin</div>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </aside>
      <div className="main-content">
        <header className="topbar">
          <span>Admin Console</span>
          <div className="header-right">
            {user && <span className="user-email">{user.email}</span>}
            <NavLink to="/" className="back-link">
              ← Back to Markets
            </NavLink>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
