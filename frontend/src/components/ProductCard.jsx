import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const primaryImage = product.images?.[0];
  const inStock = product.stock > 0;

  return (
    <article className="product-card">
      <Link className="product-card-link" to={`/products/${encodeURIComponent(product.slug)}`}>
        <div className="product-card-media">
          {primaryImage ? (
            <img alt={primaryImage.altText || product.name} src={primaryImage.url} />
          ) : (
            <span className="image-placeholder">No image</span>
          )}
        </div>
        <div className="product-card-body">
          <p className="product-category">{product.category?.name || 'Uncategorized'}</p>
          <h2>{product.name}</h2>
          <p className="product-price">${product.price}</p>
          <p className={inStock ? 'stock-label in-stock' : 'stock-label out-of-stock'}>
            {inStock ? `${product.stock} available` : 'Out of stock'}
          </p>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;