import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getProducts } from '../../services/productService.js';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const response = await getProducts({
          page: 1,
          limit: 20,
          sort: 'newest'
        });

        if (active) {
          setProducts(response.data.products);
          setPagination(response.data.pagination);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Unable to load products.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <p className="catalog-message" role="status">
        Loading products...
      </p>
    );
  }

  if (error) {
    return (
      <section className="catalog-message">
        <p className="eyebrow">Product management</p>
        <h1>Unable to load products</h1>
        <p className="form-error" role="alert">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="admin-products">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Product management</p>
          <h1>Products</h1>
          <p className="page-description">
            Manage the products available in your store.
          </p>
        </div>

        <Link className="checkout-button inline-button" to="/admin/products/new">
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="catalog-message">
          <h2>No products yet</h2>
          <p>Add your first product to start building the catalog.</p>
        </div>
      ) : (
        <div className="admin-product-table-wrapper">
          <table className="admin-product-table">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col">Stock</th>
                <th scope="col">Created</th>
                <th scope="col">
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                  </td>
                  <td>{product.category?.name || 'Uncategorized'}</td>
                  <td>${product.price}</td>
                  <td>
                    <span
                      className={
                        product.stock > 0
                          ? 'stock-label in-stock'
                          : 'stock-label out-of-stock'
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <Link
                      className="text-link"
                      to={`/admin/products/${product.id}/edit`}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <p className="admin-product-pagination">
          Showing page {pagination.page} of {pagination.totalPages}
        </p>
      )}
    </section>
  );
}

export default AdminProducts;
