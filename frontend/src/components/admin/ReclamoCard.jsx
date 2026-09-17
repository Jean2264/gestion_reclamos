import "./ReclamoCard.css";

function ReclamoCard({
  title,
  description,
  count,
  icon = "bi bi-clipboard-check",
  onViewDetails,
}) {
  return (
    <article className="reclamo-card">
      <div className="reclamo-card-top">
        <div className="reclamo-card-icon">
          <i className={icon}></i>
        </div>
      </div>

      <div className="reclamo-card-content">
        <h2>{title}</h2>

        <p className="reclamo-card-description">{description}</p>
      </div>

      <div className="reclamo-card-bottom">
        <span className="reclamo-card-count">{count}</span>

        <button
          type="button"
          className="reclamo-button"
          onClick={onViewDetails}
        >
          Ver detalles
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </article>
  );
}

export default ReclamoCard;
