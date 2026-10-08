import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getOrderById } from '../services/orderService.js';

const formatStatus = (value) =>
  value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

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
      <section className="order-details-page">
        <div className="order-details-loading" role="status">
          <span className="orders-loading-mark" />
          <p>Loading order...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="order-details-page">
        <div className="order-details-state">
          <p className="eyebrow">Order details</p>
          <h1>Unable to load order</h1>
          <p className="form-error" role="alert">
            {error}
          </p>

          <Link className="primary-button" to="/orders">
            Back to orders
          </Link>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="order-details-page">
        <div className="order-details-state">
          <p className="eyebrow">Order details</p>
          <h1>Order not found</h1>
          <p>We couldn't find that order.</p>

          <Link className="primary-button" to="/orders">
            Back to orders
          </Link>
        </div>
      </section>
    );
  }

  const canPay =
    order.status !== 'CANCELLED' &&
    (order.paymentStatus === 'PENDING' ||
      order.paymentStatus === 'FAILED');

  return (
    <section className="order-details-page">
      <div className="order-details-topbar">
        <Link className="back-link" to="/orders">
          <span aria-hidden="true">←</span>
          Back to orders
        </Link>
      </div>

      <header className="order-details-hero">
        <div className="order-details-title">
          <p className="eyebrow">Order details</p>
          <h1>#{order.id}</h1>
          <p>
            Placed{' '}
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="order-details-status-group">
          <div className="order-details-status">
            <span>Status</span>
            <strong
              className={`order-status order-status-${order.status.toLowerCase()}`}
            >
              {formatStatus(order.status)}
            </strong>
          </div>

          <div className="order-details-status">
            <span>Payment</span>
            <strong
              className={`order-payment order-payment-${order.paymentStatus.toLowerCase()}`}
            >
              {formatStatus(order.paymentStatus)}
            </strong>
          </div>
        </div>
      </header>

      {canPay && (
        <section className="order-payment-banner">
          <div className="order-payment-banner-content">
            <div className="order-payment-banner-icon" aria-hidden="true">
              $
            </div>

            <div>
              <p className="eyebrow">
                {order.paymentStatus === 'FAILED'
                  ? 'Payment failed'
                  : 'Payment required'}
              </p>

              <h2>
                {order.paymentStatus === 'FAILED'
                  ? 'Your payment could not be completed'
                  : 'Complete payment for this order'}
              </h2>

              <p>
                {order.paymentStatus === 'FAILED'
                  ? 'Your previous payment attempt was unsuccessful. You can safely try again.'
                  : 'Your order is ready. Complete the payment to continue processing it.'}
              </p>
            </div>
          </div>

          <Link
            className="order-payment-banner-button"
            to={`/orders/${encodeURIComponent(order.id)}/payment`}
          >
            {order.paymentStatus === 'FAILED'
              ? 'Try payment again'
              : 'Pay now'}
            <span aria-hidden="true">→</span>
          </Link>
        </section>
      )}

      <div className="order-details-grid">
        <section className="order-details-card order-items-card">
          <div className="order-section-heading">
            <div>
              <p className="eyebrow">Purchase</p>
              <h2>Items in this order</h2>
            </div>

            <span className="order-item-count">
              {order.items.length}{' '}
              {order.items.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="order-items">
            {order.items.map((item) => (
              <article className="order-item" key={item.id}>
                <div className="order-item-main">
                  <div className="order-item-number" aria-hidden="true">
                    {item.quantity}
                  </div>

                  <div>
                    <h3>{item.productName}</h3>

                    <p>
                      ${item.price} × {item.quantity}
                    </p>
                  </div>
                </div>

                <strong>${item.subtotal}</strong>
              </article>
            ))}
          </div>
        </section>

        <aside className="order-details-side">
          <section className="order-details-card">
            <div className="order-section-heading order-section-heading-compact">
              <div>
                <p className="eyebrow">Delivery</p>
                <h2>Shipping information</h2>
              </div>
            </div>

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
          </section>

          <section className="order-details-card order-total-card">
            <p className="eyebrow">Order summary</p>

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
          </section>
        </aside>
      </div>
    </section>
  );
}

export default OrderDetails;