import { Link } from 'react-router-dom';

import CartItem from '../components/CartItem.jsx';
import CartSummary from '../components/CartSummary.jsx';
import { useCart } from '../context/CartContext.jsx';

function Cart() {
  const { actionLoading, cart, error, itemCount, loading, removeItem, subtotal, updateItem } = useCart();

  if (loading) {
    return <p className="catalog-message" role="status">Loading your cart...</p>;
  }

  if (error && !cart) {
    return <p className="catalog-message form-error" role="alert">{error}</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <section className="empty-cart catalog-message">
        <p className="eyebrow">Shopping cart</p>
        <h1>Your cart is empty</h1>
        <p>Browse the catalog to find something you like.</p>
        <Link className="checkout-button inline-button" to="/products">Browse products</Link>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Shopping cart</p>
          <h1>Your cart</h1>
        </div>
        <p className="result-count">{itemCount} items</p>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <CartItem
              actionLoading={actionLoading}
              item={item}
              key={item.id}
              onRemove={removeItem}
              onUpdate={updateItem}
            />
          ))}
        </div>
        <CartSummary itemCount={itemCount} subtotal={subtotal} />
      </div>
    </section>
  );
}

export default Cart;