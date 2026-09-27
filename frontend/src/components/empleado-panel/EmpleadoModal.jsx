import { useState } from "react";
import "./EmpleadoModal.css";

function EmpleadoModal({ title, onClose }) {
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
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generalError, setGeneralError] = useState("");

  return (
    <div className="empleado-modal-overlay" onClick={onClose}>
      <section
        className="empleado-modal"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <header className="empleado-modal-header">
          <div className="empleado-modal-title">
            <div className="empleado-modal-title-icon">
              <i className="bi bi-person-plus"></i>
            </div>
            <span>{title}</span>
          </div>

          <button
            type="button"
            className="empleado-modal-close"
            aria-label="Cerrar modal"
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </header>

        {/* Contenido */}
        <form className="empleado-modal-content">
          <section className="empleado-modal-section">
            <h3>Información personal</h3>

            <label className="empleado-label">
              <span>
                DNI
                <span className="span-required">*</span>
              </span>

              <input
                className="empleado-input"
                name="dni"
                type="text"
                autoComplete="off"
              />
            </label>

            <div className="empleado-modal-row">
              <label className="empleado-label">
                <span>
                  Apellido
                  <span className="span-required">*</span>
                </span>

                <input
                  className="empleado-input"
                  name="apellido"
                  type="text"
                  autoComplete="off"
                />
              </label>

              <label className="empleado-label">
                <span>
                  Nombre
                  <span className="span-required">*</span>
                </span>

                <input
                  className="empleado-input"
                  name="nombre"
                  type="text"
                  autoComplete="off"
                />
              </label>
            </div>

            <label className="empleado-label">
              <span>
                Teléfono
                <span className="span-required">*</span>
              </span>

              <input
                className="empleado-input"
                name="telefono"
                type="text"
                autoComplete="off"
              />
            </label>

            <label className="empleado-label">
              <span>
                Correo electrónico
                <span className="span-required">*</span>
              </span>

              <input
                className="empleado-input"
                name="email"
                type="email"
                autoComplete="off"
              />
            </label>
          </section>

          <section className="empleado-modal-section">
            <h3>Información de domicilio</h3>

            <div className="empleado-modal-row">
              <label className="empleado-label">
                <span>
                  Calle
                  <span className="span-required">*</span>
                </span>

                <input
                  className="empleado-input"
                  name="calle"
                  type="text"
                  autoComplete="off"
                />
              </label>

              <label className="empleado-label">
                <span>
                  Número
                  <span className="span-required">*</span>
                </span>

                <input
                  className="empleado-input"
                  name="numero"
                  type="text"
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="empleado-modal-row">
              <label className="empleado-label">
                <span>
                  Localidad
                  <span className="span-required">*</span>
                </span>

                <select className="empleado-input" name="localidad">
                  <option value="">Seleccioná una localidad</option>
                  <option value="alejandro-korn">Alejandro Korn</option>
                  <option value="san-vicente">San Vicente</option>
                  <option value="domselaar">Domselaar</option>
                </select>
              </label>

              <label className="empleado-label">
                <span>
                  Código postal
                  <span className="span-required">*</span>
                </span>

                <input
                  className="empleado-input"
                  name="codigoPostal"
                  type="text"
                  autoComplete="off"
                />
              </label>
            </div>
          </section>
        </form>

        <footer className="empleado-modal-footer">
          <button className="btn-action" type="submit">
            Guardar
          </button>
        </footer>
      </section>
    </div>
  );
}

export default EmpleadoModal;
