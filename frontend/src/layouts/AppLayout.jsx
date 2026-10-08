import { NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const navigation = [
  ['/', 'Home'],
  ['/products', 'Products']
];

function AppLayout() {
  const { isAdmin, isAuthenticated, logout, user } = useAuth();
  const { itemCount } = useCart();

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
          {isAuthenticated ? (
            <>
              {[
                ['/cart', `Cart${itemCount ? ` (${itemCount})` : ''}`],
                ['/orders', 'Orders'],
                ['/profile', 'Profile']
              ].map(([path, label]) => (
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  key={path}
                  to={path}
                >
                  {label}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  to="/admin"
                >
                  Admin
                </NavLink>
              )}
              <span className="user-greeting">{user.name}</span>
              <button className="nav-link nav-button" onClick={logout} type="button">
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                to="/login"
              >
                Login
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                to="/register"
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </header>
      <main className="page-frame">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;