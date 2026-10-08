import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
} from '../../services/categoryService.js';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState('');
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const response = await getCategories();

        if (active) {
          setCategories(response.data.categories);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Unable to load categories.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    const name = newName.trim();

    if (!name) {
      setError('Category name is required.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const response = await createCategory({ name });

      setCategories((currentCategories) => [
        ...currentCategories,
        response.data.category
      ].sort((a, b) => a.name.localeCompare(b.name)));

      setNewName('');
    } catch (requestError) {
      setError(requestError.message || 'Unable to create category.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (category) => {
    setError('');
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const cancelEditing = () => {
    setEditingId('');
    setEditingName('');
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const name = editingName.trim();

    if (!name) {
      setError('Category name is required.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const response = await updateCategory(editingId, { name });
      const updatedCategory = response.data.category;

      setCategories((currentCategories) =>
        currentCategories
          .map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category
          )
          .sort((a, b) => a.name.localeCompare(b.name))
      );

      cancelEditing();
    } catch (requestError) {
      setError(requestError.message || 'Unable to update category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Delete "${category.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setDeletingId(category.id);

    try {
      await deleteCategory(category.id);

      setCategories((currentCategories) =>
        currentCategories.filter(
          (currentCategory) => currentCategory.id !== category.id
        )
      );
    } catch (requestError) {
      setError(requestError.message || 'Unable to delete category.');
    } finally {
      setDeletingId('');
    }
  };

  if (loading) {
    return (
      <p className="catalog-message" role="status">
        Loading categories...
      </p>
    );
  }

  return (
    <section className="admin-categories">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Catalog management</p>
          <h1>Categories</h1>
          <p className="page-description">
            Manage the categories used to organize your products.
          </p>
        </div>

        <Link className="text-link" to="/admin">
          Back to dashboard
        </Link>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <form className="admin-category-create" onSubmit={handleCreate}>
        <div className="form-field">
          <label htmlFor="new-category-name">New category</label>
          <input
            id="new-category-name"
            maxLength="100"
            name="name"
            onChange={(event) => setNewName(event.target.value)}
            placeholder="e.g. Electronics"
            required
            type="text"
            value={newName}
          />
        </div>

        <button
          className="checkout-button"
          disabled={submitting}
          type="submit"
        >
          {submitting ? 'Saving...' : 'Add category'}
        </button>
      </form>

      {categories.length === 0 ? (
        <div className="catalog-message">
          <h2>No categories yet</h2>
          <p>Create your first category to organize your products.</p>
        </div>
      ) : (
        <div className="admin-category-table-wrapper">
          <table className="admin-category-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Slug</th>
                <th scope="col">Created</th>
                <th scope="col">
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  {editingId === category.id ? (
                    <>
                      <td colSpan="3">
                        <form
                          className="admin-category-edit-form"
                          onSubmit={handleUpdate}
                        >
                          <label
                            className="visually-hidden"
                            htmlFor={`edit-category-${category.id}`}
                          >
                            Category name
                          </label>

                          <input
                            id={`edit-category-${category.id}`}
                            maxLength="100"
                            onChange={(event) =>
                              setEditingName(event.target.value)
                            }
                            required
                            type="text"
                            value={editingName}
                          />

                          <button
                            className="checkout-button"
                            disabled={submitting}
                            type="submit"
                          >
                            {submitting ? 'Saving...' : 'Save'}
                          </button>

                          <button
                            className="secondary-button"
                            disabled={submitting}
                            onClick={cancelEditing}
                            type="button"
                          >
                            Cancel
                          </button>
                        </form>
                      </td>

                      <td />
                    </>
                  ) : (
                    <>
                      <td>
                        <strong>{category.name}</strong>
                      </td>

                      <td>{category.slug}</td>

                      <td>
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>

                      <td>
                        <div className="admin-category-actions">
                          <button
                            className="text-button"
                            onClick={() => startEditing(category)}
                            type="button"
                          >
                            Edit
                          </button>

                          <button
                            className="text-button danger-button"
                            disabled={deletingId === category.id}
                            onClick={() => handleDelete(category)}
                            type="button"
                          >
                            {deletingId === category.id
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AdminCategories;
