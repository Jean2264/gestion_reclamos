import "./ComplaintModal.css";

function ComplaintModal({ reclamo, onClose }) {
  if (!reclamo) {
    return null;
  }

  return (
    <div className="complaint-modal-overlay" onClick={onClose}>
      <section
        className="complaint-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="complaint-modal-header">
          <div>
            <p className="complaint-modal-subtitle">Inspección de reclamo</p>

            <h2>{reclamo.codigo}</h2>
          </div>

          <button
            type="button"
            className="complaint-modal-close"
            aria-label="Cerrar modal"
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </header>

        <div className="complaint-modal-content">
          <div className="complaint-modal-field">
            <span>Asunto</span>
            <strong>{reclamo.asunto}</strong>
          </div>

          <div className="complaint-modal-field">
            <span>Ciudadano</span>
            <strong>{reclamo.ciudadano}</strong>
          </div>

          <div className="complaint-modal-field">
            <span>Estado</span>
            <strong>{reclamo.estado}</strong>
          </div>
        </div>

        <footer className="complaint-modal-footer">
          <button
            type="button"
            className="complaint-modal-button"
            onClick={onClose}
          >
            Cerrar
          </button>
        </footer>
      </section>
    </div>
  );
}

export default ComplaintModal;
