import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  getAdminOrderById,
  updateAdminOrderStatus
} from '../../services/adminOrderService.js';

const NEXT_STATUSES = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: []
};

function AdminOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadOrder = async () => {
      try {
        const response = await getAdminOrderById(id);

        if (active) {
          setOrder(response.data.order);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError.message || 'Unable to load this order.'
          );
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

  const handleStatusUpdate = async (status) => {
    setError('');
    setUpdating(true);

    try {
      const response = await updateAdminOrderStatus(id, status);
      setOrder(response.data.order);
    } catch (requestError) {
      setError(
        requestError.message ||
          'Unable to update the order status.'
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <p className="catalog-message" role="status">
        Loading order...
      </p>
    );
  }

  if (error && !order) {
    return (
      <section className="catalog-message">
        <p className="eyebrow">Admin order</p>
        <h1>Unable to load order</h1>

        <p className="form-error" role="alert">
          {error}
        </p>

        <Link className="checkout-button inline-button" to="/admin/orders">
          Back to orders
        </Link>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="catalog-message">
        <p className="eyebrow">Admin order</p>
        <h1>Order not found</h1>

        <Link className="checkout-button inline-button" to="/admin/orders">
          Back to orders
        </Link>
      </section>
    );
  }

  const nextStatuses = NEXT_STATUSES[order.status] || [];

  return (
    <section className="admin-order-details">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Order management</p>
          <h1>Order {order.id}</h1>
          <p className="page-description">
            Review this order and manage its fulfillment.
          </p>
        </div>

        <Link className="text-link" to="/admin/orders">
          Back to orders
        </Link>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="admin-order-detail-grid">
        <section className="order-details-card">
          <div className="order-details-header">
            <div>
              <p className="eyebrow">Current status</p>
              <span className="order-status">
                {order.status}
              </span>
            </div>

            <div>
              <p className="eyebrow">Payment</p>
              <span>{order.paymentStatus}</span>
            </div>
          </div>

          <div className="admin-status-management">
            <p className="eyebrow">Update status</p>

            {nextStatuses.length === 0 ? (
              <p>
                This order has reached a final status and cannot
                be changed further.
              </p>
            ) : (
              <div className="admin-status-actions">
                {nextStatuses.map((status) => (
                  <button
                    className={
                      status === 'CANCELLED'
                        ? 'secondary-button danger-action'
                        : 'checkout-button'
                    }
                    disabled={updating}
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    type="button"
                  >
                    {updating
                      ? 'Updating...'
                      : `Mark ${status.toLowerCase()}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="order-items">
            <h2>Items</h2>

            {order.items.map((item) => (
              <article className="order-item" key={item.id}>
                <div>
                  <h3>{item.productName}</h3>

                  {item.product?.slug && (
                    <Link
                      className="text-link"
                      to={`/products/${encodeURIComponent(
                        item.product.slug
                      )}`}
                    >
                      View product
                    </Link>
                  )}

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
          <div className="admin-customer-section">
            <p className="eyebrow">Customer</p>

            <dl className="shipping-details">
              <div>
                <dt>Name</dt>
                <dd>{order.user?.name || 'Unknown'}</dd>
              </div>

              <div>
                <dt>Email</dt>
                <dd>{order.user?.email || 'Unknown'}</dd>
              </div>
            </dl>
          </div>

          <div className="admin-customer-section">
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
          </div>

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

export default AdminOrderDetails;
