import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/odds', label: 'Odds' },
  { to: '/admin/settlement', label: 'Settlement' },
  { to: '/admin/tokens', label: 'Tokens' },
]

export function AdminLayout() {
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
      </aside>
      <div className="main-content">
        <header className="topbar">
          <span>Admin Console</span>
          <NavLink to="/" className="back-link">
            ← Back to Markets
          </NavLink>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
