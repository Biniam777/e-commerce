import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

function Profile() {
  const { isAdmin, user } = useAuth();

  return (
    <section className="profile-page">
      <div className="profile-heading">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Your profile</h1>
          <p>
            Manage your account information and quickly access your shopping
            activity.
          </p>
        </div>
      </div>

      <div className="profile-layout">
        <section className="profile-card">
          <div className="profile-card-heading">
            <div className="profile-avatar" aria-hidden="true">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>

            <div>
              <p className="eyebrow">Account information</p>
              <h2>{user?.name}</h2>
            </div>
          </div>

          <dl className="profile-details">
            <div>
              <dt>Full name</dt>
              <dd>{user?.name || '—'}</dd>
            </div>

            <div>
              <dt>Email address</dt>
              <dd>{user?.email || '—'}</dd>
            </div>

            <div>
              <dt>Account role</dt>
              <dd>{user?.role === 'ADMIN' ? 'Administrator' : 'Customer'}</dd>
            </div>

            <div>
              <dt>Account status</dt>
              <dd>
                <span className="profile-status">
                  <span aria-hidden="true" />
                  Active
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <aside className="profile-side">
          <div className="profile-action-card">
            <p className="eyebrow">Shopping</p>
            <h2>Your orders</h2>
            <p>
              Review previous orders, check payment status, and follow your
              order progress.
            </p>
            <Link className="secondary-button" to="/orders">
              View orders
            </Link>
          </div>

          {isAdmin && (
            <div className="profile-action-card profile-admin-card">
              <p className="eyebrow">Administration</p>
              <h2>Admin dashboard</h2>
              <p>
                Manage products, categories, orders, users, and store
                information.
              </p>
              <Link className="secondary-button" to="/admin">
                Open dashboard
              </Link>
            </div>
          )}

          <div className="profile-security-card">
            <p className="eyebrow">Security</p>
            <h2>Your credentials stay protected.</h2>
            <p>
              Your password is never displayed in the application. Your
              authenticated session is handled through your secure access
              token.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Profile;
