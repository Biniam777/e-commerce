function PlaceholderPage({ eyebrow, title, description }) {
  return (
    <section className="placeholder-page">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-description">{description}</p>
      <div className="status-note" role="status">
        Route is ready for the next implementation checkpoint.
      </div>
    </section>
  );
}

export default PlaceholderPage;