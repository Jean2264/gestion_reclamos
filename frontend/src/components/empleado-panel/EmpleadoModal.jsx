import { useState } from "react";
import "./EmpleadoModal.css";

const CODIGOS_POSTALES = {
  "alejandro-korn": "1864",
  "san-vicente": "1865",
  domselaar: "1984",
};

const ROLES = [
  { id_rol: 1, nombre_rol: "Administrador" },
  { id_rol: 2, nombre_rol: "Empleado" },
];

const FORMULARIO_INICIAL = {
  dni: "",
  apellido: "",
  nombre: "",
  telefono: "",
  email: "",
  calle: "",
  numero: "",
  localidad: "",
  codigoPostal: "",
  id_rol: "2",
};

function EmpleadoModal({ title = "Nuevo empleado", onClose, onSave }) {
  const [formData, setFormData] = useState(FORMULARIO_INICIAL);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [generalSuccess, setGeneralSuccess] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => {
      const nuevosDatos = {
        ...prev,
        [name]: value,
      };

      if (name === "localidad") {
        nuevosDatos.codigoPostal = CODIGOS_POSTALES[value] ?? "";
      }

      return nuevosDatos;
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      ...(name === "localidad" ? { codigoPostal: "" } : {}),
    }));

    setGeneralError("");
    setGeneralSuccess("");
  }

  function validarFormulario() {
    const nuevosErrores = {};

    const dni = formData.dni.trim();
    const apellido = formData.apellido.trim();
    const nombre = formData.nombre.trim();
    const telefono = formData.telefono.trim();
    const email = formData.email.trim();
    const calle = formData.calle.trim();
    const numero = formData.numero.trim();

    const patronNombre = /^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u;
    const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefonoNormalizado = telefono.replace(/[\s()+.-]/g, "");

    if (!dni) {
      nuevosErrores.dni = "Ingresá el DNI.";
    } else if (!/^\d{8}$/.test(dni)) {
      nuevosErrores.dni = "El DNI debe contener exactamente 8 números.";
    }

    if (!apellido) {
      nuevosErrores.apellido = "Ingresá el apellido.";
    } else if (apellido.length > 100) {
      nuevosErrores.apellido =
        "El apellido no puede superar los 100 caracteres.";
    } else if (!patronNombre.test(apellido)) {
      nuevosErrores.apellido =
        "Ingresá un apellido válido, sin números ni símbolos.";
    }

    if (!nombre) {
      nuevosErrores.nombre = "Ingresá el nombre.";
    } else if (nombre.length > 100) {
      nuevosErrores.nombre = "El nombre no puede superar los 100 caracteres.";
    } else if (!patronNombre.test(nombre)) {
      nuevosErrores.nombre =
        "Ingresá un nombre válido, sin números ni símbolos.";
    }

    if (!telefono) {
      nuevosErrores.telefono = "Ingresá el teléfono.";
    } else if (!/^\+?[\d\s().-]+$/.test(telefono)) {
      nuevosErrores.telefono = "El teléfono contiene caracteres no válidos.";
    } else if (
      telefonoNormalizado.replace(/^\+/, "").length < 8 ||
      telefonoNormalizado.replace(/^\+/, "").length > 15
    ) {
      nuevosErrores.telefono =
        "El teléfono debe contener entre 8 y 15 dígitos.";
    }

    if (!email) {
      nuevosErrores.email = "Ingresá el correo electrónico.";
    } else if (email.length > 50) {
      nuevosErrores.email =
        "El correo electrónico no puede superar los 50 caracteres.";
    } else if (!patronEmail.test(email)) {
      nuevosErrores.email = "Ingresá un correo electrónico válido.";
    }

    if (!calle) {
      nuevosErrores.calle = "Ingresá la calle.";
    } else if (calle.length > 20) {
      nuevosErrores.calle = "La calle no puede superar los 20 caracteres.";
    }

    if (!numero) {
      nuevosErrores.numero = "Ingresá el número del domicilio.";
    } else if (numero.length > 20) {
      nuevosErrores.numero = "El número no puede superar los 20 caracteres.";
    }

    if (!formData.localidad) {
      nuevosErrores.localidad = "Seleccioná una localidad.";
    } else if (!CODIGOS_POSTALES[formData.localidad]) {
      nuevosErrores.localidad = "La localidad seleccionada no es válida.";
    }

    if (!formData.codigoPostal) {
      nuevosErrores.codigoPostal =
        "No se pudo determinar el código postal de la localidad.";
    }

    if (!["1", "2"].includes(formData.id_rol)) {
      nuevosErrores.id_rol = "Seleccioná un rol válido.";
    }

    setErrors(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSaving) return;

    setIsSubmitted(true);
    setGeneralError("");
    setGeneralSuccess("");

    if (!validarFormulario()) {
      setGeneralError("Revisá los campos marcados antes de continuar.");
      return;
    }

    if (typeof onSave !== "function") {
      setGeneralError(
        "El formulario está validado, pero todavía no está conectado al backend.",
      );
      return;
    }

    const datosEmpleado = {
      dni: formData.dni.trim(),
      apellido: formData.apellido.trim(),
      nombre: formData.nombre.trim(),
      telefono: formData.telefono.trim(),
      email: formData.email.trim(),
      calle: formData.calle.trim(),
      numero: formData.numero.trim(),
      localidad: formData.localidad,
      codigo_postal: formData.codigoPostal,
      id_rol: Number(formData.id_rol),
    };

    try {
      setIsSaving(true);

      await onSave(datosEmpleado);

      setGeneralSuccess("Empleado registrado correctamente.");
      setFormData(FORMULARIO_INICIAL);
      setErrors({});
      setIsSubmitted(false);
    } catch (error) {
      setGeneralError(
        error?.message ||
          "No se pudo registrar el empleado. Intentá nuevamente.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleClose() {
    if (isSaving) return;
    onClose?.();
  }

  function renderError(name) {
    if (!errors[name]) return null;

    return (
      <span className="empleado-field-error" role="alert">
        {errors[name]}
      </span>
    );
  }

  return (
    <div className="empleado-modal-overlay" onClick={handleClose}>
      <section
        className="empleado-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="empleado-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="empleado-modal-header">
          <div className="empleado-modal-title">
            <div className="empleado-modal-title-icon">
              <i className="bi bi-person-plus" aria-hidden="true" />
            </div>

            <span id="empleado-modal-title">{title}</span>
          </div>

          <button
            type="button"
            className="empleado-modal-close"
            aria-label="Cerrar modal"
            onClick={handleClose}
            disabled={isSaving}
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </header>

        <form
          id="empleado-form"
          className="empleado-modal-content"
          onSubmit={handleSubmit}
          noValidate
        >
          <section className="empleado-modal-section">
            <h3>Información personal</h3>

            <label className="empleado-label">
              <span>
                DNI <span className="span-required">*</span>
              </span>

              <input
                className={`empleado-input ${errors.dni ? "is-invalid" : ""}`}
                name="dni"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Ej.: 12345678"
                value={formData.dni}
                onChange={handleChange}
                maxLength={8}
                aria-invalid={Boolean(errors.dni)}
                aria-describedby={errors.dni ? "empleado-error-dni" : undefined}
              />

              {renderError("dni")}
            </label>

            <div className="empleado-modal-row">
              <label className="empleado-label">
                <span>
                  Apellido <span className="span-required">*</span>
                </span>

                <input
                  className={`empleado-input ${errors.apellido ? "is-invalid" : ""}`}
                  name="apellido"
                  type="text"
                  autoComplete="family-name"
                  maxLength={100}
                  value={formData.apellido}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.apellido)}
                />

                {renderError("apellido")}
              </label>

              <label className="empleado-label">
                <span>
                  Nombre <span className="span-required">*</span>
                </span>

                <input
                  className={`empleado-input ${errors.nombre ? "is-invalid" : ""}`}
                  name="nombre"
                  type="text"
                  autoComplete="given-name"
                  maxLength={100}
                  value={formData.nombre}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.nombre)}
                />

                {renderError("nombre")}
              </label>
            </div>

            <label className="empleado-label">
              <span>
                Teléfono <span className="span-required">*</span>
              </span>

              <input
                className={`empleado-input ${errors.telefono ? "is-invalid" : ""}`}
                name="telefono"
                type="tel"
                autoComplete="tel"
                placeholder="Ej.: 11 1234-5678"
                maxLength={30}
                value={formData.telefono}
                onChange={handleChange}
                aria-invalid={Boolean(errors.telefono)}
              />

              {renderError("telefono")}
            </label>

            <label className="empleado-label">
              <span>
                Correo electrónico <span className="span-required">*</span>
              </span>

              <input
                className={`empleado-input ${errors.email ? "is-invalid" : ""}`}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nombre@ejemplo.com"
                maxLength={50}
                value={formData.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
              />

              {renderError("email")}
            </label>

            <label className="empleado-label">
              <span>
                Rol de usuario <span className="span-required">*</span>
              </span>

              <div className="select-wrapper">
                <select
                  className={`empleado-input ${errors.id_rol ? "is-invalid" : ""}`}
                  name="id_rol"
                  value={formData.id_rol}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.id_rol)}
                >
                  {ROLES.map((rol) => (
                    <option key={rol.id_rol} value={String(rol.id_rol)}>
                      {rol.nombre_rol}
                    </option>
                  ))}
                </select>

                <span className="select-arrow" aria-hidden="true" />
              </div>

              {renderError("id_rol")}
            </label>
          </section>

          <section className="empleado-modal-section">
            <h3>Información de domicilio</h3>

            <div className="empleado-modal-row">
              <label className="empleado-label">
                <span>
                  Calle <span className="span-required">*</span>
                </span>

                <input
                  className={`empleado-input ${errors.calle ? "is-invalid" : ""}`}
                  name="calle"
                  type="text"
                  autoComplete="street-address"
                  maxLength={20}
                  value={formData.calle}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.calle)}
                />

                {renderError("calle")}
              </label>

              <label className="empleado-label">
                <span>
                  Número <span className="span-required">*</span>
                </span>

                <input
                  className={`empleado-input ${errors.numero ? "is-invalid" : ""}`}
                  name="numero"
                  type="text"
                  autoComplete="off"
                  maxLength={20}
                  value={formData.numero}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.numero)}
                />

                {renderError("numero")}
              </label>
            </div>

            <div className="empleado-modal-row">
              <label className="empleado-label">
                <span>
                  Localidad <span className="span-required">*</span>
                </span>

                <div className="select-wrapper">
                  <select
                    className={`empleado-input ${errors.localidad ? "is-invalid" : ""}`}
                    name="localidad"
                    value={formData.localidad}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.localidad)}
                  >
                    <option value="">Seleccioná una localidad</option>
                    <option value="alejandro-korn">Alejandro Korn</option>
                    <option value="san-vicente">San Vicente</option>
                    <option value="domselaar">Domselaar</option>
                  </select>

                  <span className="select-arrow" aria-hidden="true" />
                </div>

                {renderError("localidad")}
              </label>

              <label className="empleado-label">
                <span>
                  Código postal <span className="span-required">*</span>
                </span>

                <input
                  className={`empleado-input ${errors.codigoPostal ? "is-invalid" : ""}`}
                  name="codigoPostal"
                  type="text"
                  value={formData.codigoPostal}
                  readOnly
                  autoComplete="postal-code"
                  aria-invalid={Boolean(errors.codigoPostal)}
                />

                {renderError("codigoPostal")}
              </label>
            </div>
          </section>

          {generalError && (
            <div
              className="empleado-form-message empleado-form-error"
              role="alert"
            >
              <i className="bi bi-exclamation-circle" aria-hidden="true" />
              <span>{generalError}</span>
            </div>
          )}

          {generalSuccess && (
            <div
              className="empleado-form-message empleado-form-success"
              role="status"
            >
              <i className="bi bi-check-circle" aria-hidden="true" />
              <span>{generalSuccess}</span>
            </div>
          )}

          {isSubmitted && Object.keys(errors).length > 0 && (
            <p className="empleado-form-hint">
              Los campos marcados necesitan tu atención.
            </p>
          )}

          <footer className="empleado-modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancelar
            </button>

            <button className="btn-action" type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="empleado-spinner" aria-hidden="true" />
                  Guardando...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus" aria-hidden="true" />
                  Guardar empleado
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default EmpleadoModal;
