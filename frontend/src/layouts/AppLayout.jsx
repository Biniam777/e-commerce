import { NavLink, Outlet } from 'react-router-dom';

const navigation = [
  ['/', 'Home'],
  ['/products', 'Products'],
  ['/cart', 'Cart'],
  ['/orders', 'Orders'],
  ['/profile', 'Profile']
];

function AppLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/">
          Meridian Market
        </NavLink>
        <nav aria-label="Primary navigation" className="primary-nav">
          {navigation.map(([path, label]) => (
            <NavLink
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              end={path === '/'}
              key={path}
              to={path}
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            to="/admin"
          >
            Admin
          </NavLink>
        </nav>
      </header>
      <main className="page-frame">
        <Outlet />
      </main>
      <footer className="site-footer">Frontend foundation</footer>
    </div>
  );
}

export default AppLayout;