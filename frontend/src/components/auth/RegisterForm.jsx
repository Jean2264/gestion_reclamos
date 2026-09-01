import "./RegisterForm.css";
import { useState } from "react";

function RegisterForm({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <div className="register-form">
      <div className="register-header">
        <h1>Registrarse</h1>
      </div>
      <form>
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
              Telefono
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
              Correo electronico
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
                name="dni"
                type="text"
                autoComplete="off"
              />
            </label>

            <label className="register-label">
              <span>
                Numero
                <span className="span-required">*</span>
              </span>

              <input
                className="register-input"
                name="telefono"
                type="text"
                autoComplete="off"
              />
            </label>
          </div>
          <div className="form-row">
            <label>
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
                Codigo postal
                <span className="span-required">*</span>
              </span>

              <input
                className="register-input"
                name="cp"
                type="text"
                autoComplete="off"
              />
            </label>
          </div>
        </section>

        <section className="register-section">
          <h2>Seguridad</h2>

          <label className="login-label">
            <span>
              Contraseña
              <span className="span-required">*</span>
            </span>

            <div className="div-input">
              <input
                name="contrasenia"
                type={showPassword ? "text" : "password"}
              />

              {/** <button
                type="button"
                className="ojo"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"} />
              </button> */}
            </div>
          </label>
          <label className="login-label">
            <span>
              Confirmar contraseña
              <span className="span-required">*</span>
            </span>

            <div className="div-input">
              <input
                name="confirmarContrasenia"
                type={showConfirmPassword ? "text" : "password"}
              />

              {/** <button
                type="button"
                className="ojo"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i
                  className={
                    showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"
                  }
                />
              </button> */}
            </div>
          </label>
        </section>

        <button className="btn-login" type="submit">
          Crear cuenta
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
