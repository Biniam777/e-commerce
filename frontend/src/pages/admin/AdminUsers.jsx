import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import {
  getAdminUsers,
  updateAdminUserRole
} from '../../services/adminUserService.js';

const ROLES = ['USER', 'ADMIN'];

function AdminUsers() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') || 1);
  const search = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(search);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getAdminUsers({
          page,
          limit: 20,
          search
        });

        if (active) {
          setUsers(response.data.users);
          setPagination(response.data.pagination);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Unable to load users.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      active = false;
    };
  }, [page, search]);

  const updateFilters = (changes) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(changes).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }
    });

    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    updateFilters({
      search: searchInput.trim()
    });
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const goToPage = (nextPage) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(nextPage));
    setSearchParams(nextParams);
  };

  const handleRoleChange = async (user, role) => {
    if (user.role === role) {
      return;
    }

    setError('');
    setUpdatingId(user.id);

    try {
      const response = await updateAdminUserRole(user.id, role);
      const updatedUser = response.data.user;

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === updatedUser.id
            ? updatedUser
            : currentUser
        )
      );
    } catch (requestError) {
      setError(
        requestError.message || 'Unable to update the user role.'
      );
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <section className="admin-users">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">User management</p>
          <h1>Users</h1>
          <p className="page-description">
            Manage customer and administrator roles.
          </p>
        </div>

        <Link className="text-link" to="/admin">
          Back to dashboard
        </Link>
      </div>

      <form
        className="admin-user-search"
        onSubmit={handleSearchSubmit}
      >
        <div className="form-field">
          <label htmlFor="admin-user-search">
            Search users
          </label>

          <input
            id="admin-user-search"
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Name or email"
            type="search"
            value={searchInput}
          />
        </div>

        <button className="checkout-button" type="submit">
          Search
        </button>

        <button
          className="secondary-button"
          onClick={clearSearch}
          type="button"
        >
          Clear
        </button>
      </form>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="catalog-message" role="status">
          Loading users...
        </p>
      ) : users.length === 0 ? (
        <div className="catalog-message">
          <h2>No users found</h2>
          <p>
            Try changing your search.
          </p>
        </div>
      ) : (
        <>
          <div className="admin-user-table-wrapper">
            <table className="admin-user-table">
              <thead>
                <tr>
                  <th scope="col">User</th>
                  <th scope="col">Role</th>
                  <th scope="col">Created</th>
                  <th scope="col">
                    <span className="visually-hidden">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name}</strong>
                      <span className="admin-user-email">
                        {user.email}
                      </span>
                    </td>

                    <td>
                      <span className="admin-role-label">
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td>
                      <div className="admin-user-actions">
                        <Link
                          className="text-link"
                          to={`/admin/users/${encodeURIComponent(
                            user.id
                          )}`}
                        >
                          View
                        </Link>

                        {ROLES.map((role) => (
                          <button
                            className={
                              user.role === role
                                ? 'text-button admin-current-role'
                                : 'text-button'
                            }
                            disabled={
                              user.role === role ||
                              updatingId === user.id
                            }
                            key={role}
                            onClick={() =>
                              handleRoleChange(user, role)
                            }
                            type="button"
                          >
                            {updatingId === user.id &&
                            user.role !== role
                              ? 'Updating...'
                              : `Make ${role.toLowerCase()}`}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && (
            <div className="admin-user-pagination">
              <p>
                Page {pagination.page} of {pagination.totalPages}
                {' · '}
                {pagination.total} total users
              </p>

              <div className="admin-pagination-actions">
                <button
                  className="secondary-button"
                  disabled={pagination.page <= 1}
                  onClick={() => goToPage(pagination.page - 1)}
                  type="button"
                >
                  Previous
                </button>

                <button
                  className="secondary-button"
                  disabled={
                    pagination.page >= pagination.totalPages
                  }
                  onClick={() => goToPage(pagination.page + 1)}
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default AdminUsers;
