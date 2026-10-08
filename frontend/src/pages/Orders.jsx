import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getOrders } from '../services/orderService.js';

const formatStatus = (value) =>
  value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        const response = await getOrders();

        if (active) {
          setOrders(response.data.orders);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Unable to load your orders.');
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
  }, []);

  if (loading) {
    return (
      <section className="orders-page">
        <div className="orders-loading" role="status">
          <span className="orders-loading-mark" />
          <div>
            <p className="eyebrow">Account</p>
            <p>Loading your orders...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="catalog-message orders-empty-state">
        <div className="orders-empty-icon">!</div>
        <p className="eyebrow">Orders</p>
        <h1>We couldn't load your orders</h1>
        <p className="form-error" role="alert">
          {error}
        </p>
        <Link className="checkout-button inline-button" to="/products">
          Continue shopping
        </Link>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="orders-page">
        <div className="orders-hero">
          <div>
            <p className="eyebrow">Account</p>
            <h1>Your orders</h1>
            <p>
              Your completed purchases and order updates will appear here.
            </p>
          </div>
        </div>

        <div className="orders-empty-state">
          <div className="orders-empty-icon">+</div>
          <h2>Your order history is empty</h2>
          <p>
            Discover something you love and your first order will appear here.
          </p>
          <Link className="checkout-button inline-button" to="/products">
            Start shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="orders-page">
      <div className="orders-hero">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Your orders</h1>
          <p>
            Keep track of your purchases, payment status, and delivery
            progress.
          </p>
        </div>

        <Link className="secondary-button" to="/products">
          Continue shopping
        </Link>
      </div>

      <div className="orders-overview">
        <div className="orders-overview-item">
          <span>Total orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="orders-overview-item">
          <span>Latest order</span>
          <strong>
            {new Date(orders[0].createdAt).toLocaleDateString()}
          </strong>
        </div>

        <div className="orders-overview-item">
          <span>Account</span>
          <strong>Active</strong>
        </div>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-card-header">
              <div className="order-card-heading">
                <p className="eyebrow">Order</p>
                <h2>#{order.id}</h2>
                <p className="order-card-date">
                  Placed {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`order-status order-status-${order.status.toLowerCase()}`}
              >
                {formatStatus(order.status)}
              </span>
            </div>

            <div className="order-card-divider" />

            <dl className="order-summary">
              <div>
                <dt>Items</dt>
                <dd>
                  {order.items.length}{' '}
                  {order.items.length === 1 ? 'item' : 'items'}
                </dd>
              </div>

              <div>
                <dt>Payment</dt>
                <dd>
                  <span
                    className={`order-payment order-payment-${order.paymentStatus.toLowerCase()}`}
                  >
                    {formatStatus(order.paymentStatus)}
                  </span>
                </dd>
              </div>

              <div className="order-summary-total">
                <dt>Total</dt>
                <dd>${order.total}</dd>
              </div>
            </dl>

            <div className="order-card-footer">
              <p>
                {order.status === 'DELIVERED'
                  ? 'Your order has been delivered.'
                  : order.status === 'CANCELLED'
                    ? 'This order has been cancelled.'
                    : 'Your order is being processed.'}
              </p>

              <Link
                className="order-view-button"
                to={`/orders/${order.id}`}
              >
                View order
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Orders;
