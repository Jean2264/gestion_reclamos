import { useState } from "react";
import "./CiudadanoModal.css";

function CiudadanoModal({ onClose }) {
  const [formData, setFormData] = useState({
    dni: "",
    apellido: "",
    nombre: "",
    telefono: "",
    email: "",
    calle: "",
    numero: "",
    localidad: "",
    codigoPostal: "",
    estadoTributario: "",
  });
  return (
    <div className="ciudadano-modal-overlay" onClick={onClose}>
      <section
        className="ciudadano-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="ciudadano-modal-header">
          <div className="ciudadano-modal-title">
            <div className="ciudadano-modal-title-icon">
              <i className="bi bi-person-plus"></i>
            </div>
            <span>Nuevo ciudadano</span>
          </div>

          <button
            type="button"
            className="ciudadano-modal-close"
            aria-label="Cerrar modal"
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </header>

        {/* Contenido */}
        <form className="ciudadano-modal-content">
          <section className="ciudadano-modal-section">
            <h3>Información personal</h3>

            <label className="ciudadano-label">
              <span>
                DNI
                <span className="span-required">*</span>
              </span>

              <input
                className="ciudadano-input"
                name="dni"
                type="text"
                autoComplete="off"
              />
            </label>

            <div className="ciudadano-modal-row">
              <label className="ciudadano-label">
                <span>
                  Apellido
                  <span className="span-required">*</span>
                </span>

                <input
                  className="ciudadano-input"
                  name="apellido"
                  type="text"
                  autoComplete="off"
                />
              </label>

              <label className="ciudadano-label">
                <span>
                  Nombre
                  <span className="span-required">*</span>
                </span>

                <input
                  className="ciudadano-input"
                  name="nombre"
                  type="text"
                  autoComplete="off"
                />
              </label>
            </div>

            <label className="ciudadano-label">
              <span>
                Teléfono
                <span className="span-required">*</span>
              </span>

              <input
                className="ciudadano-input"
                name="telefono"
                type="text"
                autoComplete="off"
              />
            </label>

            <label className="ciudadano-label">
              <span>
                Correo electrónico
                <span className="span-required">*</span>
              </span>

              <input
                className="ciudadano-input"
                name="email"
                type="email"
                autoComplete="off"
              />
            </label>
          </section>

          <section className="ciudadano-modal-section">
            <h3>Información de domicilio</h3>

            <div className="ciudadano-modal-row">
              <label className="ciudadano-label">
                <span>
                  Calle
                  <span className="span-required">*</span>
                </span>

                <input
                  className="ciudadano-input"
                  name="calle"
                  type="text"
                  autoComplete="off"
                />
              </label>

              <label className="ciudadano-label">
                <span>
                  Número
                  <span className="span-required">*</span>
                </span>

                <input
                  className="ciudadano-input"
                  name="numero"
                  type="text"
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="ciudadano-modal-row">
              <label className="ciudadano-label">
                <span>
                  Localidad
                  <span className="span-required">*</span>
                </span>

                <select className="ciudadano-input" name="localidad">
                  <option value="">Seleccioná una localidad</option>
                  <option value="alejandro-korn">Alejandro Korn</option>
                  <option value="san-vicente">San Vicente</option>
                  <option value="domselaar">Domselaar</option>
                </select>
              </label>

              <label className="ciudadano-label">
                <span>
                  Código postal
                  <span className="span-required">*</span>
                </span>

                <input
                  className="ciudadano-input"
                  name="codigoPostal"
                  type="text"
                  autoComplete="off"
                />
              </label>
            </div>
          </section>
        </form>

        <footer className="ciudadano-modal-footer">
          <button className="btn-action" type="submit">
            Guardar
          </button>
        </footer>
      </section>
    </div>
  );
}

export default CiudadanoModal;
