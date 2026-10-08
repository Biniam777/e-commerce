import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { getOrderById } from '../services/orderService.js';
import { processPayment } from '../services/paymentService.js';

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState('');
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

  const handlePayment = async (action) => {
    setError('');
    setProcessing(action);

    try {
      const response = await processPayment(id, action);
      const updatedOrder = response.data.order;

      setOrder(updatedOrder);

      if (updatedOrder.paymentStatus === 'PAID') {
        navigate(`/orders/${updatedOrder.id}`, { replace: true });
      }
    } catch (requestError) {
      setError(
        requestError.message || 'Unable to process the payment.'
      );
    } finally {
      setProcessing('');
    }
  };

  if (loading) {
    return (
      <p className="catalog-message" role="status">
        Loading payment...
      </p>
    );
  }

  if (error && !order) {
    return (
      <section className="catalog-message">
        <p className="eyebrow">Payment</p>
        <h1>Unable to load payment</h1>

        <p className="form-error" role="alert">
          {error}
        </p>

        <Link
          className="checkout-button inline-button"
          to="/orders"
        >
          Back to orders
        </Link>
      </section>
    );
  }

  if (!order) {
    return null;
  }

  const canPay =
    order.paymentStatus === 'PENDING' ||
    order.paymentStatus === 'FAILED';

  return (
    <section className="payment-page">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Payment</p>
          <h1>Complete your payment</h1>
          <p className="page-description">
            This project uses a simulated payment flow.
          </p>
        </div>

        <Link className="text-link" to={`/orders/${order.id}`}>
          View order
        </Link>
      </div>

      <div className="payment-card">
        <div className="payment-order-summary">
          <p className="eyebrow">Order</p>
          <h2>{order.id}</h2>

          <div className="summary-line">
            <span>Order status</span>
            <strong>{order.status}</strong>
          </div>

          <div className="summary-line">
            <span>Payment status</span>
            <strong>{order.paymentStatus}</strong>
          </div>

          <div className="summary-line summary-total">
            <span>Total</span>
            <strong>${order.total}</strong>
          </div>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {canPay ? (
          <>
            <p className="payment-note">
              No real payment provider is connected. Use the buttons
              below to simulate the payment result.
            </p>

            <div className="payment-actions">
              <button
                className="checkout-button"
                disabled={Boolean(processing)}
                onClick={() => handlePayment('success')}
                type="button"
              >
                {processing === 'success'
                  ? 'Processing...'
                  : 'Simulate successful payment'}
              </button>

              <button
                className="secondary-button"
                disabled={Boolean(processing)}
                onClick={() => handlePayment('fail')}
                type="button"
              >
                {processing === 'fail'
                  ? 'Processing...'
                  : 'Simulate failed payment'}
              </button>
            </div>
          </>
        ) : (
          <div className="payment-complete">
            <p>
              This order cannot be paid in its current payment state.
            </p>

            <Link
              className="checkout-button inline-button"
              to={`/orders/${order.id}`}
            >
              View order
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Payment;
