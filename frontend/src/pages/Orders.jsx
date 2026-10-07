import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getOrders } from '../services/orderService.js';

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
      <p className="catalog-message" role="status">
        Loading your orders...
      </p>
    );
  }

  if (error) {
    return (
      <section className="catalog-message">
        <p className="eyebrow">Orders</p>
        <h1>Unable to load orders</h1>
        <p className="form-error" role="alert">{error}</p>
        <Link className="checkout-button inline-button" to="/products">
          Continue shopping
        </Link>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="catalog-message">
        <p className="eyebrow">Orders</p>
        <h1>No orders yet</h1>
        <p>Your orders will appear here.</p>
        <Link className="checkout-button inline-button" to="/products">
          Start shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="orders-page">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Your orders</h1>
        </div>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-card-header">
              <div>
                <p className="eyebrow">Order</p>
                <h2>{order.id}</h2>
              </div>

              <span className="order-status">
                {order.status}
              </span>
            </div>

            <dl className="order-summary">
              <div>
                <dt>Date</dt>
                <dd>
                  {new Date(order.createdAt).toLocaleDateString()}
                </dd>
              </div>

              <div>
                <dt>Payment</dt>
                <dd>{order.paymentStatus}</dd>
              </div>

              <div>
                <dt>Items</dt>
                <dd>{order.items.length}</dd>
              </div>

              <div>
                <dt>Total</dt>
                <dd>${order.total}</dd>
              </div>
            </dl>

            <Link
              className="text-link"
              to={`/orders/${order.id}`}
            >
              View order
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Orders;