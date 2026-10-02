function ProductFilters({ categories, values, onSearch, onCategoryChange, onSortChange, onPriceSubmit }) {
  return (
    <div className="catalog-toolbar">
      <form className="search-form" onSubmit={onSearch}>
        <label htmlFor="product-search">Search products</label>
        <div className="search-controls">
          <input
            id="product-search"
            name="search"
            onChange={values.onSearchChange}
            placeholder="Search by name or description"
            type="search"
            value={values.searchInput}
          />
          <button type="submit">Search</button>
        </div>
      </form>
      <div className="filter-group">
        <label htmlFor="category-filter">Category</label>
        <select id="category-filter" onChange={onCategoryChange} value={values.category}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <form className="price-form" onSubmit={onPriceSubmit}>
        <label htmlFor="min-price">Price range</label>
        <div className="price-controls">
          <input
            aria-label="Minimum price"
            id="min-price"
            min="0"
            onChange={values.onMinPriceChange}
            placeholder="Min"
            step="0.01"
            type="number"
            value={values.minPrice}
          />
          <input
            aria-label="Maximum price"
            min="0"
            onChange={values.onMaxPriceChange}
            placeholder="Max"
            step="0.01"
            type="number"
            value={values.maxPrice}
          />
          <button type="submit">Apply</button>
        </div>
      </form>
      <div className="filter-group sort-group">
        <label htmlFor="sort-products">Sort</label>
        <select id="sort-products" onChange={onSortChange} value={values.sort}>
          <option value="newest">Newest</option>
          <option value="name_asc">Name A-Z</option>
          <option value="name_desc">Name Z-A</option>
          <option value="price_asc">Price low to high</option>
          <option value="price_desc">Price high to low</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  );
}

export default ProductFilters;