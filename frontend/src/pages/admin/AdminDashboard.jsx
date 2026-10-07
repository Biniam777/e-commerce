import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getDashboard } from '../../services/adminDashboardService.js';

const orderStatuses = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
];

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const response = await getDashboard();

        if (active) {
          setDashboard(response.data);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Unable to load the admin dashboard.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <p className="catalog-message" role="status">
        Loading admin dashboard...
      </p>
    );
  }

  if (error) {
    return (
      <section className="catalog-message">
        <p className="eyebrow">Operations</p>
        <h1>Unable to load dashboard</h1>
        <p className="form-error" role="alert">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="admin-dashboard">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Operations</p>
          <h1>Admin dashboard</h1>
          <p className="page-description">
            Overview of your store operations.
          </p>
        </div>

        <Link className="checkout-button inline-button" to="/admin/products">
          Manage products
        </Link>
      </div>

      <div className="admin-stat-grid">
        <article className="admin-stat-card">
          <p className="eyebrow">Users</p>
          <strong>{dashboard.counts.users}</strong>
        </article>

        <article className="admin-stat-card">
          <p className="eyebrow">Products</p>
          <strong>{dashboard.counts.products}</strong>
        </article>

        <article className="admin-stat-card">
          <p className="eyebrow">Categories</p>
          <strong>{dashboard.counts.categories}</strong>
        </article>

        <article className="admin-stat-card">
          <p className="eyebrow">Orders</p>
          <strong>{dashboard.counts.orders}</strong>
        </article>

        <article className="admin-stat-card">
          <p className="eyebrow">Revenue</p>
          <strong>${dashboard.revenue}</strong>
        </article>
      </div>

      <section className="admin-panel">
        <div>
          <p className="eyebrow">Order overview</p>
          <h2>Orders by status</h2>
        </div>

        <dl className="admin-status-list">
          {orderStatuses.map((status) => (
            <div key={status}>
              <dt>{status}</dt>
              <dd>{dashboard.ordersByStatus[status]}</dd>
            </div>
          ))}
        </dl>
      </section>
    </section>
  );
}

export default AdminDashboard;
