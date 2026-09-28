import { useState } from "react";
import muniImage from "../../assets/escudo.png";
import "./LoginForm.css";

function LoginForm({ onRegister }) {
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    contrasenia: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log("Datos del formulario:", formData);

    // Más adelante:
    // 1. Validar los campos.
    // 2. Mostrar errores.
    // 3. Enviar los datos al backend.
    // 4. Mostrar loading.
    // 5. Mostrar success/error.
  }

  return (
    <div className="login-form">
      <header className="login-header">
        <img className="login-logo" src={muniImage} alt="Logo del municipio" />

        <h2>Iniciar sesión</h2>
      </header>

      <form className="login-form-content" onSubmit={handleSubmit}>
        <label className="login-label">
          <span>Correo electrónico</span>

          <input
            className="login-input"
            name="email"
            type="email"
            autoComplete="off"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label className="login-label">
          <span>Contraseña</span>

          <div className="div-input">
            <input
              name="contrasenia"
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              value={formData.contrasenia}
              onChange={handleChange}
            />

            <button
              type="button"
              className="ojo"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"} />
            </button>
          </div>
        </label>

        {error && (
          <span className="login-error" role="alert">
            {error}
          </span>
        )}

        <button className="btn-login" type="submit">
          Ingresar
        </button>

        <a className="pass" href="#" onClick={(e) => e.preventDefault()}>
          ¿Olvidaste tu contraseña?
        </a>
      </form>

      <div className="login-actions">
        <p>
          ¿No tienes cuenta?
          <span className="link-button" onClick={onRegister}>
            Registrarse
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
