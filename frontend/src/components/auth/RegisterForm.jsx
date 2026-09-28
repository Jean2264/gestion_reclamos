import { useState } from "react";
import "./RegisterForm.css";

function RegisterForm({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="register-form">
      <header className="register-header">
        <h1>Crear ciudadano</h1>
        <p>Completá tus datos para crear tu cuenta ciudadana.</p>
      </header>

      <form className="register-form-content">
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
                className="register-input"
                name="nombre"
                type="text"
                autoComplete="off"
              />
            </label>

            <label className="register-label">
              <span>
                Apellido
                <span className="span-required">*</span>
              </span>

              <input
                className="register-input"
                name="apellido"
                type="text"
                autoComplete="off"
              />
            </label>
          </div>

          <label className="register-label">
            <span>
              DNI
              <span className="span-required">*</span>
            </span>

            <input
              className="register-input"
              name="dni"
              type="text"
              autoComplete="off"
            />
          </label>

          <label className="register-label">
            <span>
              Teléfono
              <span className="span-required">*</span>
            </span>

            <input
              className="register-input"
              name="telefono"
              type="text"
              autoComplete="off"
            />
          </label>

          <label className="register-label">
            <span>
              Correo electrónico
              <span className="span-required">*</span>
            </span>

            <input
              className="register-input"
              name="email"
              type="email"
              autoComplete="off"
            />
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
                className="register-input"
                name="calle"
                type="text"
                autoComplete="off"
              />
            </label>

            <label className="register-label">
              <span>
                Número
                <span className="span-required">*</span>
              </span>

              <input
                className="register-input"
                name="numero"
                type="text"
                autoComplete="off"
              />
            </label>
          </div>

          <div className="form-row">
            <label className="register-label">
              <span>
                Localidad
                <span className="span-required">*</span>
              </span>

              <select className="register-input" name="localidad">
                <option value="">Seleccioná una localidad</option>

                <option value="alejandro-korn">Alejandro Korn</option>

                <option value="san-vicente">San Vicente</option>

                <option value="domselaar">Domselaar</option>
              </select>
            </label>

            <label className="register-label">
              <span>
                Código postal
                <span className="span-required">*</span>
              </span>

              <input
                className="register-input"
                name="codigoPostal"
                type="text"
                autoComplete="off"
              />
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
                autoComplete="new-password"
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
                autoComplete="new-password"
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
          </label>
        </section>

        <button className="btn-register" type="submit">
          Crear cuenta
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
