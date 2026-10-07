import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { getCategories } from '../../services/categoryService.js';
import {
  createProduct,
  getProductBySlug,
  updateProduct
} from '../../services/productService.js';

function AdminProductForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);

  const [categories, setCategories] = useState([]);
  const [productId, setProductId] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrl: ''
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadFormData = async () => {
      try {
        const categoryResponse = await getCategories();

        if (!active) {
          return;
        }

        setCategories(categoryResponse.data.categories);

        if (!isEditMode) {
          setLoading(false);
          return;
        }

        const productResponse = await getProductBySlug(slug);
        const product = productResponse.data.product;

        if (!active) {
          return;
        }

        setProductId(product.id);
        setForm({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: String(product.stock),
          categoryId: product.categoryId,
          imageUrl: product.images?.[0]?.url || ''
        });
      } catch (requestError) {
        if (active) {
          setError(
            requestError.message || 'Unable to load product information.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadFormData();

    return () => {
      active = false;
    };
  }, [isEditMode, slug]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const product = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: form.price,
        stock: Number(form.stock),
        categoryId: form.categoryId
      };

      if (form.imageUrl.trim()) {
        product.images = [
          {
            url: form.imageUrl.trim(),
            altText: form.name.trim(),
            sortOrder: 0
          }
        ];
      } else if (isEditMode) {
        product.images = [];
      }

      if (isEditMode) {
        await updateProduct(productId, product);
      } else {
        await createProduct(product);
      }

      navigate('/admin/products');
    } catch (requestError) {
      setError(requestError.message || 'Unable to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <p className="catalog-message" role="status">
        Loading product...
      </p>
    );
  }

  return (
    <section className="admin-product-form-page">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Product management</p>
          <h1>{isEditMode ? 'Edit product' : 'Add product'}</h1>
          <p className="page-description">
            {isEditMode
              ? 'Update the product information and inventory.'
              : 'Add a new product to your store catalog.'}
          </p>
        </div>

        <Link className="text-link" to="/admin/products">
          Back to products
        </Link>
      </div>

      <form className="admin-product-form" onSubmit={handleSubmit}>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="form-field">
          <label htmlFor="product-name">Name</label>
          <input
            id="product-name"
            name="name"
            maxLength="200"
            onChange={handleChange}
            required
            type="text"
            value={form.name}
          />
        </div>

        <div className="form-field">
          <label htmlFor="product-description">Description</label>
          <textarea
            id="product-description"
            name="description"
            maxLength="5000"
            onChange={handleChange}
            required
            rows="6"
            value={form.description}
          />
        </div>

        <div className="admin-form-grid">
          <div className="form-field">
            <label htmlFor="product-price">Price</label>
            <input
              id="product-price"
              min="0"
              name="price"
              onChange={handleChange}
              required
              step="0.01"
              type="number"
              value={form.price}
            />
          </div>

          <div className="form-field">
            <label htmlFor="product-stock">Stock</label>
            <input
              id="product-stock"
              min="0"
              name="stock"
              onChange={handleChange}
              required
              step="1"
              type="number"
              value={form.stock}
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="product-category">Category</label>
          <select
            id="product-category"
            name="categoryId"
            onChange={handleChange}
            required
            value={form.categoryId}
          >
            <option value="">Select a category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="product-image">Image URL</label>
          <input
            id="product-image"
            name="imageUrl"
            onChange={handleChange}
            placeholder="https://example.com/product.jpg"
            type="url"
            value={form.imageUrl}
          />
          <p className="field-help">
            Optional. Product images are currently stored as external URLs.
          </p>
        </div>

        <div className="form-actions">
          <Link className="secondary-button" to="/admin/products">
            Cancel
          </Link>

          <button
            className="checkout-button"
            disabled={submitting}
            type="submit"
          >
            {submitting
              ? 'Saving...'
              : isEditMode
                ? 'Save changes'
                : 'Create product'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminProductForm;