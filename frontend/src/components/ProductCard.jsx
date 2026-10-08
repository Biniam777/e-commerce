import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const { actionLoading, addItem, error: cartError } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const primaryImage = product.images?.[0];
  const inStock = product.stock > 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: location }
      });
      return;
    }

    try {
      await addItem(product.id, 1);
    } catch {
      // CartContext exposes the backend error through cartError.
    }
  };

  return (
    <article className="product-card">
      <Link
        className="product-card-navigation"
        to={`/products/${encodeURIComponent(product.slug)}`}
      >
        <div className="product-card-media">
          {primaryImage ? (
            <img
              alt={primaryImage.altText || product.name}
              src={primaryImage.url}
            />
          ) : (
            <span className="image-placeholder">No image</span>
          )}
        </div>

        <div className="product-card-body">
          <p className="product-category">
            {product.category?.name || 'Uncategorized'}
          </p>

          <h2>{product.name}</h2>

          <p className="product-price">${product.price}</p>

          <p
            className={
              inStock
                ? 'stock-label in-stock'
                : 'stock-label out-of-stock'
            }
          >
            {inStock ? `${product.stock} available` : 'Out of stock'}
          </p>
        </div>
      </Link>

      <div className="product-card-actions">
        <button
          className="add-to-cart-button"
          disabled={!inStock || actionLoading}
          onClick={handleAddToCart}
          type="button"
        >
          {!inStock
            ? 'Out of stock'
            : actionLoading
              ? 'Adding...'
              : 'Add to cart'}
        </button>

        {cartError && (
          <p className="cart-action-message" role="alert">
            {cartError}
          </p>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
