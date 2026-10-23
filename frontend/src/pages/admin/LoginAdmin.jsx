
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import escudo from "../../assets/muni-muni.png";
import "./LoginAdmin.css";

function LoginAdmin() {
  const { iniciarSesionAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dni, setDni] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!dni.trim() || !contrasenia) {
      setError("Ingresá tu DNI y contraseña.");
      return;
    }

    try {
      setCargando(true);

      const respuesta = await iniciarSesionAdmin(
        dni.trim(),
        contrasenia
      );

      const rol = respuesta.data.usuario.nombre_rol;

      if (rol !== "Administrador" && rol !== "Empleado") {
        setError("No tenés permisos para acceder al panel.");
        return;
      }

      navigate("/admin", { replace: true });
    } catch (error) {
      setError(error.message || "No se pudo iniciar sesión.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="login-admin">
      <div className="login-admin_container">

        {/* Panel institucional */}
        <section className="login-admin_welcome">
          <div className="login-admin_welcome-overlay" />

          <div className="login-admin_brand">
            <img src={escudo} alt="Escudo municipal" />

            <div className="login-admin_brand-name">
              <strong>SAN VICENTE</strong>
              <span>MUNICIPIO</span>
            </div>

            <span className="login-admin_brand-divider" />
          </div>

          <div className="login-admin_welcome-copy">
            <h2>Bienvenido</h2>
            <h3>al Panel Administrativo</h3>

            <p>
              Trabajamos juntos por una ciudad
              <br />
              más ordenada, segura y cercana.
            </p>
          </div>

         
        </section>

        {/* Panel de acceso */}
        <section className="login-admin_access">
          <div className="login-admin_access-content">

            <div className="login-admin_access-header">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM7 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm9 1c-2.2 0-6 1.1-6 3.3V19h12v-2.7C22 14.1 18.2 13 16 13ZM7 14c-2.2 0-6 1.1-6 3.3V19h6v-2.7c0-.8.3-1.5.9-2.1A9 9 0 0 0 7 14Z"
                  fill="currentColor"
                />
              </svg>
              <span>Acceso interno</span>
            </div>

            <img
              className="login-admin_mobile-logo"
              src={escudo}
              alt="Escudo de la municipalidad"
            />

            <header className="login-admin_heading">
              <h1>Iniciar sesión</h1>
              <h2>Panel Administrativo</h2>
              <span className="login-admin_heading-line" />
              <p>
                Ingresá tus credenciales para acceder al sistema.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="login-admin_form">
              <div className="login-admin_field">
                <label htmlFor="dni">DNI</label>

                <div className="login-admin_input-wrapper">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="1.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle
                      cx="8"
                      cy="10"
                      r="2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M5.5 15c.5-2 4.5-2 5 0M13 9h5M13 12h5M13 15h3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>

                  <input
                    id="dni"
                    type="text"
                    inputMode="numeric"
                    autoComplete="username"
                    maxLength={8}
                    placeholder="Ingresá tu DNI"
                    value={dni}
                    onChange={(event) =>
                      setDni(event.target.value.replace(/\D/g, ""))
                    }
                    disabled={cargando}
                    required
                  />
                </div>
              </div>

              <div className="login-admin_field">
                <label htmlFor="contrasenia">Contraseña</label>

                <div className="login-admin_input-wrapper">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="11"
                      rx="2"
                      fill="currentColor"
                      opacity=".25"
                    />
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="11"
                      rx="2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M8 10V7a4 4 0 0 1 8 0v3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="15" r="1.3" fill="currentColor" />
                    <path
                      d="M12 16v2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>

                  <input
                    id="contrasenia"
                    type={mostrarContrasenia ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Ingresá tu contraseña"
                    value={contrasenia}
                    onChange={(event) =>
                      setContrasenia(event.target.value)
                    }
                    disabled={cargando}
                    required
                  />

                  <button
                    type="button"
                    className="login-admin_toggle-password"
                    onClick={() =>
                      setMostrarContrasenia(!mostrarContrasenia)
                    }
                    aria-label={
                      mostrarContrasenia
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    title={
                      mostrarContrasenia
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {mostrarContrasenia ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.7 10.7 0 0 1 12 5c5.5 0 9 7 9 7a14 14 0 0 1-3 3.8M6.2 6.2C4.1 7.5 3 10 3 12s3.5 7 9 7a10 10 0 0 0 4-.8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="login-admin_error" role="alert">
                  {error}
                </p>
              )}

              <button
                className="login-admin_submit"
                type="submit"
                disabled={cargando}
              >
                <span>
                  {cargando ? "Ingresando..." : "Iniciar sesión"}
                </span>
                {!cargando && (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M4 12h15m-6-6 6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </form>

            <div className="login-admin_separator">
              <span />
              <span className="login-admin_separator-or">o</span>
              <span />
            </div>

            <button
              type="button"
              className="login-admin_forgot"
              onClick={() =>
                setError(
                  "Para recuperar tu acceso, contactá al administrador del sistema."
                )
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="11"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              ¿Olvidaste tu contraseña?
            </button>

          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginAdmin;
