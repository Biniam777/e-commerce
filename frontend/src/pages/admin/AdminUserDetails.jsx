import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getAdminUserById } from '../../services/adminUserService.js';

function AdminUserDetails() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      try {
        const response = await getAdminUserById(id);

        if (active) {
          setUser(response.data.user);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError.message || 'Unable to load this user.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <p className="catalog-message" role="status">
        Loading user...
      </p>
    );
  }

  if (error) {
    return (
      <section className="catalog-message">
        <p className="eyebrow">User details</p>
        <h1>Unable to load user</h1>

        <p className="form-error" role="alert">
          {error}
        </p>

        <Link
          className="checkout-button inline-button"
          to="/admin/users"
        >
          Back to users
        </Link>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="catalog-message">
        <p className="eyebrow">User details</p>
        <h1>User not found</h1>

        <Link
          className="checkout-button inline-button"
          to="/admin/users"
        >
          Back to users
        </Link>
      </section>
    );
  }

  return (
    <section className="admin-user-details">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">User management</p>
          <h1>{user.name}</h1>
          <p className="page-description">
            Review this user's account information.
          </p>
        </div>

        <Link className="text-link" to="/admin/users">
          Back to users
        </Link>
      </div>

      <section className="admin-user-details-card">
        <dl className="admin-user-details-list">
          <div>
            <dt>Name</dt>
            <dd>{user.name}</dd>
          </div>

          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>

          <div>
            <dt>Role</dt>
            <dd>
              <span className="admin-role-label">
                {user.role}
              </span>
            </dd>
          </div>

          <div>
            <dt>Created</dt>
            <dd>
              {new Date(user.createdAt).toLocaleString()}
            </dd>
          </div>

          <div>
            <dt>Last updated</dt>
            <dd>
              {new Date(user.updatedAt).toLocaleString()}
            </dd>
          </div>
        </dl>
      </section>
    </section>
  );
}

export default AdminUserDetails;
