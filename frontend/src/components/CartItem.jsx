import { multiplyMoney } from '../utils/money.js';

function CartItem({ item, actionLoading, onRemove, onUpdate }) {
  const image = item.product.images?.[0];
  const canIncrease = item.quantity < item.product.stock;

  return (
    <article className="cart-item">
      <div className="cart-item-image">
        {image ? <img alt={image.altText || item.product.name} src={image.url} /> : <span>No image</span>}
      </div>
      <div className="cart-item-content">
        <h2>{item.product.name}</h2>
        <p className="cart-item-price">${item.product.price} each</p>
        <p className="stock-label in-stock">{item.product.stock} available</p>
        <p className="cart-item-subtotal">${multiplyMoney(item.product.price, item.quantity)}</p>
      </div>
      <div className="cart-item-actions">
        <div aria-label={`Quantity for ${item.product.name}`} className="quantity-control">
          <button
            aria-label={`Decrease ${item.product.name} quantity`}
            disabled={actionLoading || item.quantity <= 1}
            onClick={() => onUpdate(item.id, item.quantity - 1)}
            type="button"
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            aria-label={`Increase ${item.product.name} quantity`}
            disabled={actionLoading || !canIncrease}
            onClick={() => onUpdate(item.id, item.quantity + 1)}
            type="button"
          >
            +
          </button>
        </div>
        <button className="remove-button" disabled={actionLoading} onClick={() => onRemove(item.id)} type="button">
          Remove
        </button>
      </div>
    </article>
  );
}

export default CartItem;