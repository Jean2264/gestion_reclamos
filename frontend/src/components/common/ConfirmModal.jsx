import "./ConfirmModal.css";

function ConfirmModal({
  isOpen,
  title = "Confirmar acción",
  message = "¿Estás seguro de que querés continuar?",
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="confirm-modal-overlay"
      onClick={isLoading ? undefined : onCancel}
    >
      <section
        className="confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Ícono */}
        <div className="confirm-modal-icon">
          <i className="bi bi-trash" aria-hidden="true"></i>
        </div>

        {/* Contenido */}
        <div className="confirm-modal-content">
          <h2 id="confirm-modal-title">{title}</h2>

          <p id="confirm-modal-message">{message}</p>
        </div>

        {/* Acciones */}
        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-modal-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="confirm-modal-confirm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="confirm-modal-spinner"
                  aria-hidden="true"
                ></span>
                Procesando...
              </>
            ) : (
              <>
                <i className="bi bi-trash" aria-hidden="true"></i>
                Eliminar
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmModal;
