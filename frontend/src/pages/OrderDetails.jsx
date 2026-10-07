import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getOrderById } from '../services/orderService.js';

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadOrder = async () => {
      try {
        const response = await getOrderById(id);

        if (active) {
          setOrder(response.data.order);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Unable to load this order.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <p className="catalog-message" role="status">
        Loading order...
      </p>
    );
  }

  if (error) {
    return (
      <section className="catalog-message">
        <p className="eyebrow">Order details</p>
        <h1>Unable to load order</h1>
        <p className="form-error" role="alert">{error}</p>

        <Link className="checkout-button inline-button" to="/orders">
          Back to orders
        </Link>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="catalog-message">
        <p className="eyebrow">Order details</p>
        <h1>Order not found</h1>
        <p>We couldn't find that order.</p>

        <Link className="checkout-button inline-button" to="/orders">
          Back to orders
        </Link>
      </section>
    );
  }

  return (
    <section className="order-details-page">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Order details</p>
          <h1>Order {order.id}</h1>
        </div>

        <Link className="text-link" to="/orders">
          Back to orders
        </Link>
      </div>

      <div className="order-details-grid">
        <section className="order-details-card">
          <div className="order-details-header">
            <div>
              <p className="eyebrow">Order status</p>
              <span className="order-status">
                {order.status}
              </span>
            </div>

            <div>
              <p className="eyebrow">Payment</p>
              <span>{order.paymentStatus}</span>
            </div>
          </div>

          <div className="order-items">
            <h2>Items</h2>

            {order.items.map((item) => (
              <article className="order-item" key={item.id}>
                <div>
                  <h3>{item.productName}</h3>
                  <p>
                    ${item.price} × {item.quantity}
                  </p>
                </div>

                <strong>${item.subtotal}</strong>
              </article>
            ))}
          </div>
        </section>

        <aside className="order-details-card">
          <p className="eyebrow">Shipping information</p>

          <dl className="shipping-details">
            <div>
              <dt>Name</dt>
              <dd>{order.shippingName}</dd>
            </div>

            <div>
              <dt>Phone</dt>
              <dd>{order.shippingPhone}</dd>
            </div>

            <div>
              <dt>Address</dt>
              <dd>{order.shippingAddress}</dd>
            </div>
          </dl>

          <div className="order-totals">
            <div className="summary-line">
              <span>Subtotal</span>
              <strong>${order.subtotal}</strong>
            </div>

            <div className="summary-line">
              <span>Shipping</span>
              <strong>${order.shippingCost}</strong>
            </div>

            <div className="summary-line summary-total">
              <span>Total</span>
              <strong>${order.total}</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default OrderDetails;