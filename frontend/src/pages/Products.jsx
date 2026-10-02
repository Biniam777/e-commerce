import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ProductCard from '../components/ProductCard.jsx';
import ProductFilters from '../components/ProductFilters.jsx';
import ProductPagination from '../components/ProductPagination.jsx';
import { getProducts } from '../services/productService.js';
import { apiRequest } from '../services/apiClient.js';

const pageSize = 12;

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [filterError, setFilterError] = useState('');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const queryKey = searchParams.toString();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    setSearchInput(search);
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
  }, [queryKey]);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const response = await apiRequest('/categories');
        if (active) setCategories(response.data.categories);
      } catch (requestError) {
        if (active) setCategoryError(requestError.message || 'Unable to load categories.');
      } finally {
        if (active) setCategoriesLoading(false);
      }
    };

    loadCategories();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getProducts({
          search,
          category,
          minPrice: searchParams.get('minPrice') || '',
          maxPrice: searchParams.get('maxPrice') || '',
          sort,
          page,
          limit: pageSize
        });
        if (active) {
          setProducts(response.data.products);
          setPagination(response.data.pagination);
        }
      } catch (requestError) {
        if (active) {
          setProducts([]);
          setPagination(null);
          setError(requestError.message || 'Unable to load products.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      active = false;
    };
  }, [queryKey]);

  const updateFilters = (updates) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === undefined || value === null) nextParams.delete(key);
      else nextParams.set(key, value);
    });
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateFilters({ search: searchInput.trim() });
  };

  const handlePriceSubmit = (event) => {
    event.preventDefault();
    setFilterError('');
    const min = minPrice.trim();
    const max = maxPrice.trim();

    if ((min && Number(min) < 0) || (max && Number(max) < 0) || (min && max && Number(min) > Number(max))) {
      setFilterError('Enter a valid price range.');
      return;
    }

    updateFilters({ minPrice: min, maxPrice: max });
  };

  const heading = search || category ? 'Filtered products' : 'Products';

  return (
    <section className="catalog-page">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>{heading}</h1>
        </div>
        {pagination && <p className="result-count">{pagination.total} products</p>}
      </div>
      <ProductFilters
        categories={categoriesLoading ? [] : categories}
        onCategoryChange={(event) => updateFilters({ category: event.target.value })}
        onPriceSubmit={handlePriceSubmit}
        onSearch={handleSearch}
        onSortChange={(event) => updateFilters({ sort: event.target.value === 'newest' ? '' : event.target.value })}
        values={{
          category,
          maxPrice,
          minPrice,
          onMaxPriceChange: (event) => setMaxPrice(event.target.value),
          onMinPriceChange: (event) => setMinPrice(event.target.value),
          onSearchChange: (event) => setSearchInput(event.target.value),
          searchInput,
          sort
        }}
      />
      {categoryError && <p className="form-error" role="alert">{categoryError}</p>}
      {filterError && <p className="form-error" role="alert">{filterError}</p>}
      {loading && <p className="catalog-message" role="status">Loading products...</p>}
      {!loading && error && <p className="catalog-message form-error" role="alert">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="catalog-message" role="status">No products match these filters.</p>
      )}
      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
      <ProductPagination
        onPageChange={(nextPage) => setSearchParams(new URLSearchParams({ ...Object.fromEntries(searchParams), page: String(nextPage) }))}
        pagination={pagination}
      />
    </section>
  );
}

export default Products;