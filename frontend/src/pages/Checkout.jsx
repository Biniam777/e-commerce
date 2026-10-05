import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useCart } from '../context/CartContext.jsx';
import { createOrder } from '../services/orderService.js';
import { multiplyMoney } from '../utils/money.js';

function Checkout() {
  const { cart, loading: cartLoading, refreshCart, subtotal } = useCart();
  const [form, setForm] = useState({ shippingName: '', shippingPhone: '', shippingAddress: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const shipping = {
      shippingName: form.shippingName.trim(),
      shippingPhone: form.shippingPhone.trim(),
      shippingAddress: form.shippingAddress.trim()
    };

    if (!shipping.shippingName || !shipping.shippingPhone || !shipping.shippingAddress) {
      setError('Please complete all shipping fields.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await createOrder(shipping);
      await refreshCart();
      setOrder(response.data.order);
    } catch (requestError) {
      setError(requestError.message || 'Unable to create your order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLoading) {
    return <p className="catalog-message" role="status">Loading checkout...</p>;
  }

  if (order) {
    return (
      <section className="checkout-confirmation catalog-message">
        <p className="eyebrow">Order confirmed</p>
        <h1>Thank you for your order</h1>
        <p>Your order has been created successfully.</p>
        <dl className="confirmation-details">
          <div><dt>Order ID</dt><dd>{order.id}</dd></div>
          <div><dt>Status</dt><dd>{order.status}</dd></div>
          <div><dt>Payment</dt><dd>{order.paymentStatus}</dd></div>
          <div><dt>Subtotal</dt><dd>${order.subtotal}</dd></div>
          <div><dt>Shipping</dt><dd>${order.shippingCost}</dd></div>
          <div><dt>Total</dt><dd>${order.total}</dd></div>
        </dl>
        <div className="confirmation-actions">
          <Link className="checkout-button inline-button" to="/orders">View orders</Link>
          <Link className="text-link" to="/products">Continue shopping</Link>
        </div>
      </section>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <section className="empty-cart catalog-message">
        <p className="eyebrow">Checkout</p>
        <h1>Your cart is empty</h1>
        <p>Add products to your cart before checking out.</p>
        <Link className="checkout-button inline-button" to="/products">Browse products</Link>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1>Shipping information</h1>
        </div>
      </div>
      <div className="checkout-layout">
        <form className="auth-form checkout-form" noValidate onSubmit={handleSubmit}>
          <label>
            Full name
            <input name="shippingName" onChange={updateField} required type="text" value={form.shippingName} />
          </label>
          <label>
            Phone number
            <input name="shippingPhone" onChange={updateField} required type="tel" value={form.shippingPhone} />
          </label>
          <label>
            Shipping address
            <textarea name="shippingAddress" onChange={updateField} required rows="4" value={form.shippingAddress} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button disabled={submitting} type="submit">
            {submitting ? 'Creating order...' : 'Place order'}
          </button>
        </form>
        <aside className="checkout-summary cart-summary">
          <p className="eyebrow">Order summary</p>
          <div className="checkout-items">
            {cart.items.map((item) => (
              <div className="checkout-item" key={item.id}>
                <span>{item.product.name} × {item.quantity}</span>
                <strong>${multiplyMoney(item.product.price, item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="summary-line"><span>Subtotal</span><strong>${subtotal}</strong></div>
          <div className="summary-line"><span>Shipping</span><span>Calculated by server</span></div>
          <div className="summary-line summary-total"><span>Total</span><strong>Calculated by server</strong></div>
        </aside>
      </div>
    </section>
  );
}

export default Checkout;