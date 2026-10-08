import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getDashboard } from '../../services/adminDashboardService.js';

const ORDER_STATUSES = [
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
          setError(requestError.message || 'Unable to load dashboard.');
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
        Loading dashboard...
      </p>
    );
  }

  if (error) {
    return (
      <p className="form-error" role="alert">
        {error}
      </p>
    );
  }

  return (
    <section className="admin-dashboard">
      <div className="catalog-heading admin-dashboard-heading">
        <div>
          <p className="eyebrow">Operations</p>
          <h1>Admin dashboard</h1>
          <p className="page-description">
            Overview of your store operations.
          </p>
        </div>

        <div className="admin-dashboard-actions">
          <Link
            className="secondary-button"
            to="/admin/categories"
          >
            Manage categories
          </Link>

          <Link
            className="secondary-button"
            to="/admin/orders"
          >
            Manage orders
          </Link>

          <Link
            className="secondary-button"
            to="/admin/users"
          >
            Manage users
          </Link>

          <Link
            className="checkout-button inline-button"
            to="/admin/products"
          >
            Manage products
          </Link>
        </div>
      </div>

      <div className="admin-stat-grid admin-overview-grid">
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
          <p className="eyebrow">Paid revenue</p>
          <strong>${dashboard.revenue}</strong>
        </article>
      </div>

      <section className="admin-order-statuses">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow">Orders</p>
            <h2>Order status</h2>
            <p className="page-description">
              Current order distribution across the store.
            </p>
          </div>
        </div>

        <div className="admin-order-status-grid">
          {ORDER_STATUSES.map((status) => (
            <article className="admin-stat-card admin-status-card" key={status}>
              <p className="eyebrow">{status}</p>
              <strong>{dashboard.ordersByStatus[status]}</strong>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default AdminDashboard;
