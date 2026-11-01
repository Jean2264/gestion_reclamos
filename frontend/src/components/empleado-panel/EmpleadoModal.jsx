import { useEffect, useRef, useState } from "react";

import "./EmpleadoModal.css";
import { fetchEmpleadoById } from "../../services/empleado.service.js";

const CODIGOS_POSTALES = {
  "alejandro-korn": "1864",
  "san-vicente": "1865",
  domselaar: "1984",
};

const LOCALIDADES = [
  { value: "alejandro-korn", label: "Alejandro Korn" },
  { value: "san-vicente", label: "San Vicente" },
  { value: "domselaar", label: "Domselaar" },
];

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

function normalizarLocalidad(localidad) {
  if (!localidad) return "";

  const valor = String(localidad).trim().toLowerCase();

  const equivalencias = {
    "alejandro korn": "alejandro-korn",
    "alejandro-korn": "alejandro-korn",
    "san vicente": "san-vicente",
    "san-vicente": "san-vicente",
    domselaar: "domselaar",
  };

  return equivalencias[valor] ?? "";
}

function normalizarEmpleado(empleado) {
  const localidad = normalizarLocalidad(
    empleado.localidad ?? empleado.nombre_localidad,
  );

  return {
    dni: String(empleado.dni ?? ""),
    apellido: empleado.apellido ?? "",
    nombre: empleado.nombre ?? "",
    telefono: empleado.telefono ?? "",
    email: empleado.email ?? "",
    calle: empleado.calle ?? "",
    numero: String(empleado.numero ?? ""),
    localidad,
    codigoPostal:
      empleado.codigoPostal ??
      empleado.codigo_postal ??
      CODIGOS_POSTALES[localidad] ??
      "",
    id_rol: String(empleado.id_rol ?? empleado.idRol ?? "2"),
  };
}

function EmpleadoModal({
  title = "Nuevo empleado",
  mode = "create",
  empleadoId = null,
  onClose,
  onSave,
}) {
  const esCreacion = mode === "create";
  const esVisualizacion = mode === "view";
  const esEdicion = mode === "edit";

  const [formData, setFormData] = useState({ ...FORMULARIO_INICIAL });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // null = formulario, success = éxito, error = fallo del guardado.
  const [resultado, setResultado] = useState(null);
  const [mensajeResultado, setMensajeResultado] = useState("");

  const timeoutRef = useRef(null);

  // Limpiar el temporizador si se desmonta el componente.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Cargar los datos cuando se abre el modal para ver o editar.
  useEffect(() => {
    let cancelado = false;

    async function cargarEmpleado() {
      setResultado(null);
      setMensajeResultado("");
      setGeneralError("");
      setErrors({});
      setIsSubmitted(false);

      if (esCreacion) {
        setFormData({ ...FORMULARIO_INICIAL });
        setIsLoading(false);
        return;
      }

      if (!empleadoId) {
        setGeneralError("No se recibió el ID del empleado.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setFormData({ ...FORMULARIO_INICIAL });

      try {
        const empleado = await fetchEmpleadoById(empleadoId);

        if (cancelado) return;

        if (!empleado) {
          throw new Error("No se encontraron los datos del empleado.");
        }

        setFormData(normalizarEmpleado(empleado));
      } catch (error) {
        if (cancelado) return;

        console.error("Error al cargar el empleado:", error);

        if (error.status === 401) {
          setGeneralError(
            "Tu sesión no está autenticada. Iniciá sesión nuevamente.",
          );
        } else if (error.status === 403) {
          setGeneralError(
            "No tenés permisos para consultar los datos del empleado.",
          );
        } else {
          setGeneralError(
            error.message || "No se pudieron cargar los datos del empleado.",
          );
        }
      } finally {
        if (!cancelado) {
          setIsLoading(false);
        }
      }
    }

    cargarEmpleado();

    return () => {
      cancelado = true;
    };
  }, [mode, empleadoId, esCreacion]);

  function handleChange(event) {
    const { name, value } = event.target;

    if (esVisualizacion || isLoading || isSaving) return;

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

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSaving || isLoading || esVisualizacion) return;

    setIsSubmitted(true);
    setGeneralError("");

    if (!validarFormulario()) {
      setGeneralError("Revisá los campos marcados antes de continuar.");
      return;
    }

    if (typeof onSave !== "function") {
      setGeneralError("El formulario todavía no está conectado al backend.");
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
      codigoPostal: formData.codigoPostal,
      codigo_postal: formData.codigoPostal,
      id_rol: Number(formData.id_rol),
    };

    try {
      setIsSaving(true);

      await onSave(datosEmpleado);

      setGeneralError("");
      setMensajeResultado(
        esEdicion
          ? "Los cambios del empleado se guardaron correctamente."
          : "El nuevo empleado se registró correctamente.",
      );

      setResultado("success");

      // Cerrar automáticamente después de un segundo.
      timeoutRef.current = window.setTimeout(() => {
        onClose?.();
      }, 1000);
    } catch (error) {
      console.error("Error al guardar el empleado:", error);

      setMensajeResultado(
        error?.message ||
          `No se pudo ${
            esEdicion ? "actualizar" : "registrar"
          } el empleado. Intentá nuevamente.`,
      );

      if (error?.errors && typeof error.errors === "object") {
        setErrors((prev) => ({
          ...prev,
          ...error.errors,
        }));
      }

      // Se conserva formData para que el usuario pueda reintentar.
      setResultado("error");
    } finally {
      setIsSaving(false);
    }
  }

  function handleClose() {
    if (isSaving) return;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    onClose?.();
  }

  function handleRetry() {
    setResultado(null);
    setMensajeResultado("");
    setGeneralError("");
    // No se modifica formData: conserva los valores ingresados.
  }

  function renderError(name) {
    if (!errors[name]) return null;

    return (
      <span
        className="empleado-field-error"
        role="alert"
        id={`empleado-error-${name}`}
      >
        {errors[name]}
      </span>
    );
  }

  const camposBloqueados = esVisualizacion || isLoading || isSaving;

  const claseInput = (name) =>
    `empleado-input ${errors[name] ? "is-invalid" : ""}`;

  return (
    <div className="empleado-modal-overlay" onClick={handleClose}>
      <section
        className="empleado-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="empleado-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        {resultado ? (
          <>
            <header className="empleado-modal-header">
              <div className="empleado-modal-title">
                <div className="empleado-modal-title-icon">
                  <i
                    className={
                      resultado === "success"
                        ? "bi bi-check-lg"
                        : "bi bi-exclamation-lg"
                    }
                    aria-hidden="true"
                  />
                </div>

                <span id="empleado-modal-title">
                  {resultado === "success"
                    ? "Operación completada"
                    : "No se pudo completar la operación"}
                </span>
              </div>

              <button
                type="button"
                className="empleado-modal-close"
                aria-label="Cerrar modal"
                onClick={handleClose}
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </header>

            <div
              className={`empleado-modal-result ${
                resultado === "success"
                  ? "empleado-result-success"
                  : "empleado-result-error"
              }`}
              role={resultado === "success" ? "status" : "alert"}
              aria-live={resultado === "success" ? "polite" : "assertive"}
            >
              <div className="empleado-result-icon">
                <i
                  className={
                    resultado === "success"
                      ? "bi bi-check-circle-fill"
                      : "bi bi-exclamation-triangle-fill"
                  }
                  aria-hidden="true"
                />
              </div>

              <h2 className="empleado-result-title">
                {resultado === "success"
                  ? esEdicion
                    ? "¡Empleado actualizado correctamente!"
                    : "¡Empleado registrado correctamente!"
                  : "No pudimos guardar los cambios"}
              </h2>

              <p className="empleado-result-description">
                {resultado === "success"
                  ? mensajeResultado
                  : "Los datos que ingresaste se conservaron. Podés volver al formulario e intentarlo nuevamente."}
              </p>

              {resultado === "error" && mensajeResultado && (
                <div className="empleado-result-error-detail">
                  {mensajeResultado}
                </div>
              )}

              {resultado === "success" ? (
                <>
                  <p className="empleado-result-countdown">
                    Cerrando ventana...
                  </p>

                  <div className="empleado-result-progress" aria-hidden="true">
                    <div className="empleado-result-progress-bar" />
                  </div>
                </>
              ) : (
                <div className="empleado-result-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleClose}
                  >
                    Cerrar
                  </button>

                  <button
                    type="button"
                    className="btn-action"
                    onClick={handleRetry}
                  >
                    <i
                      className="bi bi-arrow-counterclockwise"
                      aria-hidden="true"
                    />
                    Volver a intentar
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <header className="empleado-modal-header">
              <div className="empleado-modal-title">
                <div className="empleado-modal-title-icon">
                  <i
                    className={`bi ${
                      esVisualizacion
                        ? "bi-person"
                        : esEdicion
                          ? "bi-person-gear"
                          : "bi-person-plus"
                    }`}
                    aria-hidden="true"
                  />
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

            {isLoading ? (
              <div className="empleado-modal-content">
                <div className="empleados-loading">
                  <span
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  />
                  <span>Cargando datos del empleado...</span>
                </div>
              </div>
            ) : (
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
                      DNI{" "}
                      {!esVisualizacion && (
                        <span className="span-required">*</span>
                      )}
                    </span>

                    <input
                      className={claseInput("dni")}
                      name="dni"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="Ej.: 12345678"
                      value={formData.dni}
                      onChange={handleChange}
                      maxLength={8}
                      readOnly={!esCreacion || camposBloqueados}
                      aria-invalid={Boolean(errors.dni)}
                      aria-describedby={
                        errors.dni ? "empleado-error-dni" : undefined
                      }
                    />

                    {renderError("dni")}
                  </label>

                  <div className="empleado-modal-row">
                    <label className="empleado-label">
                      <span>
                        Apellido{" "}
                        {!esVisualizacion && (
                          <span className="span-required">*</span>
                        )}
                      </span>

                      <input
                        className={claseInput("apellido")}
                        name="apellido"
                        type="text"
                        autoComplete="family-name"
                        maxLength={100}
                        value={formData.apellido}
                        onChange={handleChange}
                        readOnly={camposBloqueados}
                        aria-invalid={Boolean(errors.apellido)}
                      />

                      {renderError("apellido")}
                    </label>

                    <label className="empleado-label">
                      <span>
                        Nombre{" "}
                        {!esVisualizacion && (
                          <span className="span-required">*</span>
                        )}
                      </span>

                      <input
                        className={claseInput("nombre")}
                        name="nombre"
                        type="text"
                        autoComplete="given-name"
                        maxLength={100}
                        value={formData.nombre}
                        onChange={handleChange}
                        readOnly={camposBloqueados}
                        aria-invalid={Boolean(errors.nombre)}
                      />

                      {renderError("nombre")}
                    </label>
                  </div>

                  <label className="empleado-label">
                    <span>
                      Teléfono{" "}
                      {!esVisualizacion && (
                        <span className="span-required">*</span>
                      )}
                    </span>

                    <input
                      className={claseInput("telefono")}
                      name="telefono"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Ej.: 11 1234-5678"
                      maxLength={30}
                      value={formData.telefono}
                      onChange={handleChange}
                      readOnly={camposBloqueados}
                      aria-invalid={Boolean(errors.telefono)}
                    />

                    {renderError("telefono")}
                  </label>

                  <label className="empleado-label">
                    <span>
                      Correo electrónico{" "}
                      {!esVisualizacion && (
                        <span className="span-required">*</span>
                      )}
                    </span>

                    <input
                      className={claseInput("email")}
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="nombre@ejemplo.com"
                      maxLength={50}
                      value={formData.email}
                      onChange={handleChange}
                      readOnly={camposBloqueados}
                      aria-invalid={Boolean(errors.email)}
                    />

                    {renderError("email")}
                  </label>

                  <label className="empleado-label">
                    <span>
                      Rol de usuario{" "}
                      {!esVisualizacion && (
                        <span className="span-required">*</span>
                      )}
                    </span>

                    <div className="select-wrapper">
                      <select
                        className={claseInput("id_rol")}
                        name="id_rol"
                        value={formData.id_rol}
                        onChange={handleChange}
                        disabled={camposBloqueados}
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
                        Calle{" "}
                        {!esVisualizacion && (
                          <span className="span-required">*</span>
                        )}
                      </span>

                      <input
                        className={claseInput("calle")}
                        name="calle"
                        type="text"
                        autoComplete="street-address"
                        maxLength={20}
                        value={formData.calle}
                        onChange={handleChange}
                        readOnly={camposBloqueados}
                        aria-invalid={Boolean(errors.calle)}
                      />

                      {renderError("calle")}
                    </label>

                    <label className="empleado-label">
                      <span>
                        Número{" "}
                        {!esVisualizacion && (
                          <span className="span-required">*</span>
                        )}
                      </span>

                      <input
                        className={claseInput("numero")}
                        name="numero"
                        type="text"
                        autoComplete="off"
                        maxLength={20}
                        value={formData.numero}
                        onChange={handleChange}
                        readOnly={camposBloqueados}
                        aria-invalid={Boolean(errors.numero)}
                      />

                      {renderError("numero")}
                    </label>
                  </div>

                  <div className="empleado-modal-row">
                    <label className="empleado-label">
                      <span>
                        Localidad{" "}
                        {!esVisualizacion && (
                          <span className="span-required">*</span>
                        )}
                      </span>

                      <div className="select-wrapper">
                        <select
                          className={claseInput("localidad")}
                          name="localidad"
                          value={formData.localidad}
                          onChange={handleChange}
                          disabled={camposBloqueados}
                          aria-invalid={Boolean(errors.localidad)}
                        >
                          <option value="">Seleccioná una localidad</option>

                          {LOCALIDADES.map((localidad) => (
                            <option
                              key={localidad.value}
                              value={localidad.value}
                            >
                              {localidad.label}
                            </option>
                          ))}
                        </select>

                        <span className="select-arrow" aria-hidden="true" />
                      </div>

                      {renderError("localidad")}
                    </label>

                    <label className="empleado-label">
                      <span>
                        Código postal{" "}
                        {!esVisualizacion && (
                          <span className="span-required">*</span>
                        )}
                      </span>

                      <input
                        className={claseInput("codigoPostal")}
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
                    <i
                      className="bi bi-exclamation-circle"
                      aria-hidden="true"
                    />
                    <span>{generalError}</span>
                  </div>
                )}

                {isSubmitted && Object.keys(errors).length > 0 && (
                  <p className="empleado-form-hint">
                    Los campos marcados necesitan tu atención.
                  </p>
                )}

                {!esVisualizacion && (
                  <footer className="empleado-modal-footer">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={handleClose}
                      disabled={isSaving}
                    >
                      Cancelar
                    </button>

                    <button
                      className="btn-action"
                      type="submit"
                      disabled={isSaving || isLoading}
                    >
                      {isSaving ? (
                        <>
                          <span
                            className="empleado-spinner"
                            aria-hidden="true"
                          />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i
                            className={`bi ${
                              esEdicion ? "bi-check-lg" : "bi-person-plus"
                            }`}
                            aria-hidden="true"
                          />
                          {esEdicion ? "Guardar cambios" : "Guardar empleado"}
                        </>
                      )}
                    </button>
                  </footer>
                )}
              </form>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default EmpleadoModal;
