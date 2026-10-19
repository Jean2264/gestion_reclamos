import { useState } from "react";
import "./CiudadanoModal.css";
import * as usuarioService from "../../services/usuario.service.js";

function CiudadanoModal({ onClose }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    fechaNacimiento: "",
    calle: "",
    numero: "",
    localidad: "",
    codigoPostal: "",
  });

  const [errores, setErrores] = useState({});
  const [registrando, setRegistrando] = useState(false);
  const [errorRegistro, setErrorRegistro] = useState("");
  const [password, setPassword] = useState("");
  const hoy = new Date();

  const fechaMaximaNacimiento = new Date(
    hoy.getFullYear() - 18,
    hoy.getMonth(),
    hoy.getDate(),
  );

  const fechaMaximaNacimientoString = fechaMaximaNacimiento
    .toISOString()
    .split("T")[0];

  const fechaNacimientoValida =
    formData.fechaNacimiento !== "" &&
    new Date(`${formData.fechaNacimiento}T00:00:00`) <= fechaMaximaNacimiento;

  const nombreValido =
    formData.nombre.trim().length > 0 &&
    /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(formData.nombre);

  const apellidoValido =
    formData.apellido.trim().length > 0 &&
    /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(formData.apellido);

  const dniValido = /^\d{8}$/.test(formData.dni);

  const telefonoValido =
    formData.telefono.trim().length > 0 &&
    formData.telefono.length <= 30 &&
    /^[0-9+\-()\s]+$/.test(formData.telefono);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const calleValida = formData.calle.trim().length > 0;

  const numeroValido = formData.numero.trim().length > 0;

  const localidadValida = formData.localidad !== "";

  const codigoPostalValido = formData.codigoPostal.trim().length > 0;

  const formularioValido =
    nombreValido &&
    apellidoValido &&
    dniValido &&
    telefonoValido &&
    emailValido &&
    fechaNacimientoValida &&
    calleValida &&
    numeroValido &&
    localidadValida &&
    codigoPostalValido;

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrores((prev) => ({
      ...prev,
      [name]: "",
    }));

    setErrorRegistro("");
  }

  // =========================
  // VALIDACIÓN COMPLETA
  // =========================

  function validarFormulario() {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(formData.nombre)) {
      nuevosErrores.nombre = "El nombre solo puede contener letras y espacios.";
    }

    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es obligatorio.";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(formData.apellido)) {
      nuevosErrores.apellido =
        "El apellido solo puede contener letras y espacios.";
    }

    if (!formData.dni) {
      nuevosErrores.dni = "El DNI es obligatorio.";
    } else if (!/^\d{8}$/.test(formData.dni)) {
      nuevosErrores.dni = "El DNI debe contener exactamente 8 números.";
    }

    if (!formData.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    } else if (!fechaNacimientoValida) {
      nuevosErrores.fechaNacimiento = "Debés tener al menos 18 años.";
    }

    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    } else if (!/^[0-9+\-()\s]+$/.test(formData.telefono)) {
      nuevosErrores.telefono = "El teléfono contiene caracteres no permitidos.";
    } else if (formData.telefono.length > 30) {
      nuevosErrores.telefono =
        "El teléfono no puede superar los 30 caracteres.";
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = "El correo electrónico es obligatorio.";
    } else if (!emailValido) {
      nuevosErrores.email = "Ingresá un correo electrónico válido.";
    }

    if (!formData.calle.trim()) {
      nuevosErrores.calle = "La calle es obligatoria.";
    }

    if (!formData.numero.trim()) {
      nuevosErrores.numero = "El número de domicilio es obligatorio.";
    }

    if (!formData.localidad) {
      nuevosErrores.localidad = "Seleccioná una localidad.";
    }

    if (!formData.codigoPostal.trim()) {
      nuevosErrores.codigoPostal = "El código postal es obligatorio.";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  }

  //Registro//
  async function handleSubmit(e) {
    e.preventDefault();

    setErrorRegistro("");

    const formularioEsValido = validarFormulario();

    if (!formularioEsValido) {
      return;
    }

    try {
      setRegistrando(true);

      await usuarioService.registrarUsuario({
        ...formData,
        contrasenia: password,
      });
    } catch (error) {
      console.error("Error al registrar ciudadano: ", error);

      setErrorRegistro(error.message || "No se pudo crear la cuenta.");
    } finally {
      setRegistrando(false);
    }
  }
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
                className={`ciudadano-input ${errores.dni ? "input-error" : ""}`}
                name="dni"
                type="text"
                value={formData.dni}
                autoComplete="off"
                maxLength={8}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");

                  if (value.length <= 8) {
                    setFormData((prev) => ({
                      ...prev,
                      dni: value,
                    }));

                    setErrores((prev) => ({
                      ...prev,
                      dni: "",
                    }));
                  }
                }}
              />

              {errores.dni && (
                <small className="registrar-error">{errores.dni}</small>
              )}
            </label>

            <div className="ciudadano-modal-row">
              <label className="ciudadano-label">
                <span>
                  Apellido
                  <span className="span-required">*</span>
                </span>

                <input
                  className={`ciudadano-input ${errores.apellido ? "input-error" : ""}`}
                  name="apellido"
                  type="text"
                  value={formData.apellido}
                  maxLength={100}
                  handleChange={handleChange}
                  autoComplete="off"
                />

                {errores.apellido && (
                  <small className="registrar-error">{errores.apellido}</small>
                )}
              </label>

              <label className="ciudadano-label">
                <span>
                  Nombre
                  <span className="span-required">*</span>
                </span>

                <input
                  className={`ciudadano-input ${errores.nombre ? "input-error" : ""}`}
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  maxLength={100}
                  handleChange={handleChange}
                  autoComplete="off"
                />
                {errores.nombre && (
                  <small className="registrar-error">{errores.nombre}</small>
                )}
              </label>
            </div>

            <label className="ciudadano-label">
              <span>
                Teléfono
                <span className="span-required">*</span>
              </span>

              <input
                className={`ciudadano-input ${errores.nombre ? "input-error" : ""}`}
                name="telefono"
                value={formData.telefono}
                type="text"
                autoComplete="tel"
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^[0-9+\-()\s]*$/.test(value) && value.length <= 30) {
                    setFormData((prev) => ({
                      ...prev,
                      telefono: value,
                    }));

                    setErrores((prev) => ({
                      ...prev,
                      telefono: "",
                    }));
                  }
                }}
                maxLength={30}
                placeholder="+54 9 11 1234-5678"
              />

              {errores.telefono && (
                <small className="register-error">{errores.dni}</small>
              )}
            </label>

            <label className="ciudadano-label">
              <span>
                Correo electrónico
                <span className="span-required">*</span>
              </span>

              <input
                className={`ciudadano-input ${errores.nombre ? "input-error" : ""}`}
                name="email"
                type="email"
                value={formData.email}
                maxLength={50}
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
