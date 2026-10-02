import { useState } from 'react';

function ProductGallery({ product }) {
  const images = product.images || [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  return (
    <div className="product-gallery">
      <div className="product-hero-image">
        {selectedImage ? (
          <img alt={selectedImage.altText || product.name} src={selectedImage.url} />
        ) : (
          <span className="image-placeholder">No image available</span>
        )}
      </div>
      {images.length > 1 && (
        <div aria-label="Product images" className="thumbnail-list">
          {images.map((image, index) => (
            <button
              aria-label={`View image ${index + 1}`}
              className={index === selectedIndex ? 'thumbnail selected' : 'thumbnail'}
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              type="button"
            >
              <img alt={image.altText || `${product.name} thumbnail ${index + 1}`} src={image.url} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;