import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthProvider";

import "./RegisterForm.css";
import PasswordStrength from "./PasswordStrength";

function RegisterForm({ onLogin }) {
  const { registrarUsuario, setIsAuthModalOpen } = useContext(AuthContext);
  const navigate = useNavigate();
  // =========================
  // DATOS DEL FORMULARIO
  // =========================

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

  // =========================
  // CONTRASEÑAS
  // =========================

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =========================
  // ESTADOS
  // =========================

  const [errores, setErrores] = useState({});
  const [registrando, setRegistrando] = useState(false);
  const [errorRegistro, setErrorRegistro] = useState("");

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

  // =========================
  // VALIDACIONES
  // =========================

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

  const passwordIsValid =
    password.length >= 8 &&
    password.length <= 50 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[!-/:-@[-`{-~]/.test(password);

  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === password;

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
    codigoPostalValido &&
    passwordIsValid &&
    passwordsMatch;

  // =========================
  // CAMBIO DE INPUT
  // =========================

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

    if (!passwordIsValid) {
      nuevosErrores.contrasenia = "La contraseña no cumple con los requisitos.";
    }

    if (!passwordsMatch) {
      nuevosErrores.confirmarContrasenia = "Las contraseñas no coinciden.";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  }

  // =========================
  // REGISTRO
  // =========================

  async function handleSubmit(e) {
    e.preventDefault();

    setErrorRegistro("");

    const formularioEsValido = validarFormulario();

    if (!formularioEsValido) {
      return;
    }

    try {
      setRegistrando(true);

      await registrarUsuario({
        ...formData,
        contrasenia: password,
      });

      // El backend ya creó la cookie JWT
      // y AuthProvider ya actualizó usuario.
      setIsAuthModalOpen(false);

      navigate("/reclamo", { replace: true });
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      setErrorRegistro(error.message || "No se pudo crear la cuenta.");
    } finally {
      setRegistrando(false);
    }
  }

  return (
    <div className="register-form">
      <header className="register-header">
        <h1>Crear ciudadano</h1>
        <p>Completá tus datos para crear tu cuenta ciudadana.</p>
      </header>

      <form
        className="register-form-content"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* =========================
            INFORMACIÓN PERSONAL
            ========================= */}

        <section className="register-section">
          <h2>Información personal</h2>

          <div className="names">
            <label className="register-label">
              <span>
                Nombre
                <span className="span-required">*</span>
              </span>

              <input
                className={`register-input ${
                  errores.nombre ? "input-error" : ""
                }`}
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                autoComplete="given-name"
                maxLength={100}
              />

              {errores.nombre && (
                <small className="register-error">{errores.nombre}</small>
              )}
            </label>

            <label className="register-label">
              <span>
                Apellido
                <span className="span-required">*</span>
              </span>

              <input
                className={`register-input ${
                  errores.apellido ? "input-error" : ""
                }`}
                name="apellido"
                type="text"
                value={formData.apellido}
                onChange={handleChange}
                autoComplete="family-name"
                maxLength={100}
              />

              {errores.apellido && (
                <small className="register-error">{errores.apellido}</small>
              )}
            </label>
          </div>

          <label className="register-label">
            <span>
              DNI
              <span className="span-required">*</span>
            </span>

            <input
              className={`register-input ${errores.dni ? "input-error" : ""}`}
              name="dni"
              type="text"
              inputMode="numeric"
              value={formData.dni}
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
              autoComplete="off"
              maxLength={8}
            />

            {errores.dni && (
              <small className="register-error">{errores.dni}</small>
            )}
          </label>

          <label className="register-label">
            <span>
              Fecha de nacimiento
              <span className="span-required">*</span>
            </span>

            <input
              className={`register-input ${
                errores.fechaNacimiento ? "input-error" : ""
              }`}
              name="fechaNacimiento"
              type="date"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              max={fechaMaximaNacimientoString}
            />

            {errores.fechaNacimiento && (
              <small className="register-error">
                {errores.fechaNacimiento}
              </small>
            )}
          </label>

          <label className="register-label">
            <span>
              Teléfono
              <span className="span-required">*</span>
            </span>

            <input
              className={`register-input ${
                errores.telefono ? "input-error" : ""
              }`}
              name="telefono"
              type="text"
              inputMode="tel"
              value={formData.telefono}
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
              autoComplete="tel"
              maxLength={30}
              placeholder="+54 9 11 1234-5678"
            />

            {errores.telefono && (
              <small className="register-error">{errores.telefono}</small>
            )}
          </label>

          <label className="register-label">
            <span>
              Correo electrónico
              <span className="span-required">*</span>
            </span>

            <input
              className={`register-input ${errores.email ? "input-error" : ""}`}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              maxLength={50}
              placeholder="ejemplo@correo.com"
            />

            {errores.email && (
              <small className="register-error">{errores.email}</small>
            )}
          </label>
        </section>

        {/* =========================
            DOMICILIO
            ========================= */}

        <section className="register-section">
          <h2>Información de domicilio</h2>

          <div className="form-row">
            <label className="register-label">
              <span>
                Calle
                <span className="span-required">*</span>
              </span>

              <input
                className={`register-input ${
                  errores.calle ? "input-error" : ""
                }`}
                name="calle"
                type="text"
                value={formData.calle}
                onChange={handleChange}
                autoComplete="street-address"
                maxLength={20}
              />

              {errores.calle && (
                <small className="register-error">{errores.calle}</small>
              )}
            </label>

            <label className="register-label">
              <span>
                Número
                <span className="span-required">*</span>
              </span>

              <input
                className={`register-input ${
                  errores.numero ? "input-error" : ""
                }`}
                name="numero"
                type="text"
                value={formData.numero}
                onChange={handleChange}
                autoComplete="address-line2"
                maxLength={20}
              />

              {errores.numero && (
                <small className="register-error">{errores.numero}</small>
              )}
            </label>
          </div>

          <div className="form-row">
            <label className="register-label">
              <span>
                Localidad
                <span className="span-required">*</span>
              </span>

              <select
                className={`register-input ${
                  errores.localidad ? "input-error" : ""
                }`}
                name="localidad"
                value={formData.localidad}
                onChange={handleChange}
              >
                <option value="">Seleccioná una localidad</option>

                <option value="alejandro-korn">Alejandro Korn</option>

                <option value="san-vicente">San Vicente</option>

                <option value="domselaar">Domselaar</option>
              </select>

              {errores.localidad && (
                <small className="register-error">{errores.localidad}</small>
              )}
            </label>

            <label className="register-label">
              <span>
                Código postal
                <span className="span-required">*</span>
              </span>

              <input
                className={`register-input ${
                  errores.codigoPostal ? "input-error" : ""
                }`}
                name="codigoPostal"
                type="text"
                value={formData.codigoPostal}
                onChange={handleChange}
                autoComplete="postal-code"
                maxLength={20}
              />

              {errores.codigoPostal && (
                <small className="register-error">{errores.codigoPostal}</small>
              )}
            </label>
          </div>
        </section>

        {/* =========================
            SEGURIDAD
            ========================= */}

        <section className="register-section">
          <h2>Seguridad</h2>

          <label className="register-label">
            <span>
              Contraseña
              <span className="span-required">*</span>
            </span>

            <div className="register-password">
              <input
                name="contrasenia"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  setErrores((prev) => ({
                    ...prev,
                    contrasenia: "",
                  }));
                }}
                autoComplete="new-password"
                maxLength={50}
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"} />
              </button>
            </div>

            <PasswordStrength value={password} />

            {errores.contrasenia && (
              <small className="register-error">{errores.contrasenia}</small>
            )}
          </label>

          <label className="register-label">
            <span>
              Confirmar contraseña
              <span className="span-required">*</span>
            </span>

            <div className="register-password">
              <input
                name="confirmarContrasenia"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);

                  setErrores((prev) => ({
                    ...prev,
                    confirmarContrasenia: "",
                  }));
                }}
                autoComplete="new-password"
                maxLength={50}
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                <i
                  className={
                    showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"
                  }
                />
              </button>
            </div>

            {confirmPassword.length > 0 && (
              <p
                className={
                  passwordsMatch ? "password-match" : "password-mismatch"
                }
              >
                {passwordsMatch
                  ? "✓ Las contraseñas coinciden"
                  : "Las contraseñas no coinciden"}
              </p>
            )}
          </label>
        </section>

        {/* ERROR GENERAL */}

        {errorRegistro && (
          <div className="register-general-error">
            <i className="bi bi-exclamation-circle"></i>
            <span>{errorRegistro}</span>
          </div>
        )}

        {/* BOTÓN */}

        <button
          className="btn-register"
          type="submit"
          disabled={!formularioValido || registrando}
        >
          {registrando ? (
            <>
              <span className="register-spinner"></span>
              Creando cuenta...
            </>
          ) : (
            "Crear cuenta"
          )}
        </button>
      </form>

      <div className="register-actions">
        <p>
          ¿Ya tienes una cuenta?
          <span className="register-login-link" onClick={onLogin}>
            Iniciar sesión
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
