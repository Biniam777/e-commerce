import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import ProductGallery from '../components/ProductGallery.jsx';
import { getProductBySlug } from '../services/productService.js';

function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    getProductBySlug(slug)
      .then((response) => {
        if (active) setProduct(response.data.product);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Unable to load this product.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) return <p className="catalog-message" role="status">Loading product...</p>;
  if (error) {
    return (
      <section className="catalog-message" role="alert">
        <p className="form-error">{error}</p>
        <Link className="text-link" to="/products">Back to products</Link>
      </section>
    );
  }

  if (!product) return <p className="catalog-message" role="alert">Product not found.</p>;

  return (
    <section className="product-detail">
      <Link className="text-link" to="/products">Back to products</Link>
      <div className="product-detail-layout">
        <ProductGallery product={product} />
        <div className="product-detail-copy">
          <p className="eyebrow">{product.category?.name || 'Catalog'}</p>
          <h1>{product.name}</h1>
          <p className="product-detail-price">${product.price}</p>
          <p className="product-description">{product.description}</p>
          <p className={product.stock > 0 ? 'stock-label in-stock' : 'stock-label out-of-stock'}>
            {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;