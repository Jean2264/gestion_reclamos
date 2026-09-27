import { useState } from "react";
import "./ComplaintModal.css";

function ComplaintModal({ reclamo, onClose }) {
  if (!reclamo) {
    return null;
  }

  const [areaOriginal, setAreaOriginal] = useState(reclamo.area);
  const [areaSeleccionada, setAreaSeleccionada] = useState(reclamo.area);
  const [guardado, setGuardado] = useState(false);

  const hayCambios = areaOriginal !== areaSeleccionada;

  async function handleAreaSave() {
    setAreaOriginal(areaSeleccionada);

    setGuardado(true);
  }

  return (
    <div className="complaint-modal-overlay" onClick={onClose}>
      <section
        className="complaint-modal"
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}

        <header className="complaint-modal-header">
          <div>
            <p className="complaint-modal-subtitle">Inspección de reclamo</p>

            <div className="cd-reclamo">
              <span>Código de reclamo:</span>
              <strong>{reclamo.codigo}</strong>
            </div>
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

        {/* CONTENIDO */}

        <div className="complaint-modal-content">
          {/* INFORMACIÓN DEL CIUDADANO */}

          <section className="complaint-modal-section">
            <h3 className="complaint-modal-section-title">
              Información del ciudadano
            </h3>

            <div className="complaint-modal-grid">
              <div className="complaint-modal-field">
                <span>DNI</span>
                <strong>{reclamo.dni}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Nombre</span>
                <strong>{reclamo.nombre}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Apellido</span>
                <strong>{reclamo.apellido}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Estado tributario</span>
                <strong>{reclamo.estadoTributario}</strong>
              </div>
            </div>
          </section>

          {/* ÁREA DEL RECLAMO */}

          <section className="complaint-modal-section">
            <h3 className="complaint-modal-section-title">Área del reclamo</h3>

            <div className="complaint-modal-field">
              <label htmlFor="complaint-area">Área</label>

              <div className="complaint-area-actions">
                <select
                  id="complaint-area"
                  value={areaSeleccionada}
                  onChange={(event) => setAreaSeleccionada(event.target.value)}
                  defaultValue={reclamo.area}
                >
                  <option value="alumbrado">
                    Alumbrado Público / Luminaria
                  </option>

                  <option value="pavimentacion">Pavimentación</option>

                  <option value="zanjeo">Abovedado con Zanjeo</option>

                  <option value="residuos">Recolección de Residuos</option>

                  <option value="ramas">Recolección de Ramas</option>

                  <option value="arbustos">Poda de Arbustos</option>
                </select>
                {hayCambios && (
                  <button
                    type="button"
                    className="complaint-area-save"
                    onClick={handleAreaSave}
                  >
                    {guardado ? (
                      <i className="bi bi-check-lg"></i>
                    ) : (
                      "Guardar cambios"
                    )}
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* DETALLE DEL RECLAMO */}

          <section className="complaint-modal-section">
            <h3 className="complaint-modal-section-title">
              Detalle del reclamo
            </h3>

            <div className="complaint-modal-grid">
              <div className="complaint-modal-field">
                <span>Fecha de alta</span>
                <strong>{reclamo.fechaAlta}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Calle</span>
                <strong>{reclamo.calle}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Altura</span>
                <strong>{reclamo.altura}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Localidad</span>
                <strong>{reclamo.localidad}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Código postal</span>
                <strong>{reclamo.codigoPostal}</strong>
              </div>
            </div>

            {/* IMÁGENES */}

            <div className="complaint-modal-images">
              <span>Imágenes</span>

              <div className="complaint-modal-images-grid">
                {/* Las imágenes se agregarán posteriormente */}
              </div>
            </div>

            {/* DESCRIPCIÓN */}

            <div className="complaint-modal-field">
              <label htmlFor="complaint-description">Detalle</label>

              <textarea
                id="complaint-description"
                value={reclamo.detalle || ""}
                readOnly
              />
            </div>
          </section>

          {/* ESTADO DEL RECLAMO */}

          <section className="complaint-modal-section">
            <h3 className="complaint-modal-section-title">
              Estado del reclamo
            </h3>

            <div className="complaint-modal-field">
              <span>Estado actual</span>
              <strong>{reclamo.estado}</strong>
            </div>
          </section>
        </div>

        {/* FOOTER */}

        <footer className="complaint-modal-footer">
          <button
            type="button"
            className="complaint-modal-button complaint-modal-button-secondary"
            onClick={onClose}
          >
            Cerrar
          </button>

          <button type="button" className="complaint-modal-button">
            Cambiar estado
          </button>
        </footer>
      </section>
    </div>
  );
}

export default ComplaintModal;
