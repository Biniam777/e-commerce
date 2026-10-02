function ProductPagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Product pages" className="pagination">
      <button disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)} type="button">
        Previous
      </button>
      <span>
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <button
        disabled={pagination.page >= pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
        type="button"
      >
        Next
      </button>
    </nav>
  );
}

export default ProductPagination;