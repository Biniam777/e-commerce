import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { getAdminOrders } from '../../services/adminOrderService.js';

const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
];

const PAYMENT_STATUSES = [
  'PENDING',
  'PAID',
  'FAILED',
  'REFUNDED'
];

function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') || 1);
  const status = searchParams.get('status') || '';
  const paymentStatus = searchParams.get('paymentStatus') || '';
  const search = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(search);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getAdminOrders({
          page,
          limit: 20,
          status,
          paymentStatus,
          search
        });

        if (active) {
          setOrders(response.data.orders);
          setPagination(response.data.pagination);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Unable to load orders.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, [page, status, paymentStatus, search]);

  const updateFilters = (changes) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(changes).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }
    });

    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    updateFilters({ search: searchInput.trim() });
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const goToPage = (nextPage) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(nextPage));
    setSearchParams(nextParams);
  };

  return (
    <section className="admin-orders">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Order management</p>
          <h1>Orders</h1>
          <p className="page-description">
            Review customer orders and manage their fulfillment status.
          </p>
        </div>

        <Link className="text-link" to="/admin">
          Back to dashboard
        </Link>
      </div>

      <div className="admin-order-filters">
        <form
          className="admin-order-search"
          onSubmit={handleSearchSubmit}
        >
          <div className="form-field">
            <label htmlFor="admin-order-search">
              Search customer
            </label>

            <input
              id="admin-order-search"
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Name or email"
              type="search"
              value={searchInput}
            />
          </div>

          <button className="checkout-button" type="submit">
            Search
          </button>
        </form>

        <div className="admin-order-filter-grid">
          <div className="form-field">
            <label htmlFor="admin-order-status">
              Order status
            </label>

            <select
              id="admin-order-status"
              onChange={(event) =>
                updateFilters({ status: event.target.value })
              }
              value={status}
            >
              <option value="">All statuses</option>

              {ORDER_STATUSES.map((orderStatus) => (
                <option key={orderStatus} value={orderStatus}>
                  {orderStatus}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="admin-payment-status">
              Payment status
            </label>

            <select
              id="admin-payment-status"
              onChange={(event) =>
                updateFilters({ paymentStatus: event.target.value })
              }
              value={paymentStatus}
            >
              <option value="">All payments</option>

              {PAYMENT_STATUSES.map((payment) => (
                <option key={payment} value={payment}>
                  {payment}
                </option>
              ))}
            </select>
          </div>

          <button
            className="secondary-button"
            onClick={clearFilters}
            type="button"
          >
            Clear filters
          </button>
        </div>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="catalog-message" role="status">
          Loading orders...
        </p>
      ) : orders.length === 0 ? (
        <div className="catalog-message">
          <h2>No orders found</h2>
          <p>
            Try changing the search or filters.
          </p>
        </div>
      ) : (
        <>
          <div className="admin-order-table-wrapper">
            <table className="admin-order-table">
              <thead>
                <tr>
                  <th scope="col">Order</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Status</th>
                  <th scope="col">Payment</th>
                  <th scope="col">Total</th>
                  <th scope="col">Created</th>
                  <th scope="col">
                    <span className="visually-hidden">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                    </td>

                    <td>
                      <strong>
                        {order.user?.name || 'Unknown customer'}
                      </strong>
                      <span className="admin-order-customer-email">
                        {order.user?.email || 'No email'}
                      </span>
                    </td>

                    <td>
                      <span className="order-status">
                        {order.status}
                      </span>
                    </td>

                    <td>{order.paymentStatus}</td>

                    <td>${order.total}</td>

                    <td>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    <td>
                      <Link
                        className="text-link"
                        to={`/admin/orders/${encodeURIComponent(order.id)}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && (
            <div className="admin-order-pagination">
              <p>
                Page {pagination.page} of {pagination.totalPages}
                {' · '}
                {pagination.total} total orders
              </p>

              <div className="admin-pagination-actions">
                <button
                  className="secondary-button"
                  disabled={pagination.page <= 1}
                  onClick={() => goToPage(pagination.page - 1)}
                  type="button"
                >
                  Previous
                </button>

                <button
                  className="secondary-button"
                  disabled={
                    pagination.page >= pagination.totalPages
                  }
                  onClick={() => goToPage(pagination.page + 1)}
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default AdminOrders;
