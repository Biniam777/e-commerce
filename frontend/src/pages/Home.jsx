import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ProductCard from '../components/ProductCard.jsx';
import { getCategories } from '../services/categoryService.js';
import { getProducts } from '../services/productService.js';

function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadHome = async () => {
      setLoading(true);
      setError('');

      try {
        const [categoryResponse, productResponse] = await Promise.all([
          getCategories(),
          getProducts({ page: 1, limit: 4, sort: 'newest' })
        ]);

        if (!active) {
          return;
        }

        setCategories(categoryResponse.data.categories || []);
        setProducts(productResponse.data.products || []);
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Unable to load the storefront.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadHome();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="eyebrow">Meridian Market</p>

          <h1>
            Quality products.
            <br />
            Simple shopping.
          </h1>

          <p className="home-hero-description">
            Discover carefully selected products, add what you need to your
            cart, and check out with a simple, secure shopping experience.
          </p>

          <div className="home-hero-actions">
            <Link className="primary-button" to="/products">
              Shop products
            </Link>

            <Link className="secondary-button" to="/products">
              Browse the catalog
            </Link>
          </div>
        </div>

        <div className="home-hero-panel" aria-hidden="true">
          <span className="hero-panel-label">Featured collection</span>
          <strong>Everyday essentials, selected for you.</strong>
          <span>Browse the catalog and find your next favorite.</span>
        </div>
      </section>

      {error && (
        <section className="home-section">
          <p className="catalog-message form-error" role="alert">
            {error}
          </p>
        </section>
      )}

      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Explore</p>
            <h2>Shop by category</h2>
          </div>

          <Link className="text-link" to="/products">
            View all products
          </Link>
        </div>

        {loading ? (
          <p className="catalog-message" role="status">
            Loading categories...
          </p>
        ) : categories.length === 0 ? (
          <p className="catalog-message">
            Categories will appear here as the catalog grows.
          </p>
        ) : (
          <div className="home-category-grid">
            {categories.map((category) => (
              <Link
                className="home-category-card"
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.slug)}`}
              >
                <span className="home-category-index">
                  {String(categories.indexOf(category) + 1).padStart(2, '0')}
                </span>

                <div>
                  <h3>{category.name}</h3>
                  <span>Explore products</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="home-section home-featured-section">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Featured</p>
            <h2>Latest products</h2>
          </div>

          <Link className="text-link" to="/products">
            See the full catalog
          </Link>
        </div>

        {loading ? (
          <p className="catalog-message" role="status">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <div className="home-empty-state">
            <h3>The catalog is waiting for its first products.</h3>
            <p>
              Once products are available, they will appear here automatically.
            </p>

            <Link className="secondary-button" to="/products">
              Browse catalog
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="home-values">
        <div className="home-value">
          <span className="home-value-number">01</span>
          <div>
            <h3>Simple discovery</h3>
            <p>
              Search, filter, sort, and browse products without unnecessary
              complexity.
            </p>
          </div>
        </div>

        <div className="home-value">
          <span className="home-value-number">02</span>
          <div>
            <h3>Server-backed cart</h3>
            <p>
              Your cart stays connected to your account instead of depending
              on browser-only storage.
            </p>
          </div>
        </div>

        <div className="home-value">
          <span className="home-value-number">03</span>
          <div>
            <h3>Order tracking</h3>
            <p>
              Follow your orders from checkout through payment and fulfillment.
            </p>
          </div>
        </div>
      </section>

      <section className="home-final-cta">
        <p className="eyebrow">Ready when you are</p>
        <h2>Find something worth bringing home.</h2>
        <Link className="primary-button" to="/products">
          Start shopping
        </Link>
      </section>
    </div>
  );
}

export default Home;
