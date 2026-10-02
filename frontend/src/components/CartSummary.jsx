import { Link } from 'react-router-dom';

function CartSummary({ subtotal, itemCount }) {
  return (
    <aside className="cart-summary">
      <p className="eyebrow">Order summary</p>
      <div className="summary-line">
        <span>Items</span>
        <span>{itemCount}</span>
      </div>
      <div className="summary-line summary-total">
        <span>Subtotal</span>
        <strong>${subtotal}</strong>
      </div>
      <Link className="checkout-button" to="/checkout">
        Continue to checkout
      </Link>
    </aside>
  );
}

export default CartSummary;