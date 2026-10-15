import { useState, useRef } from "react";

import "./CambiarPassword.css";
import BtnClose from "../common/BtnClose";
import PasswordStrength from "../auth/PasswordStrength";
import { actualizarPassword } from "../../services/usuario.service";

function CambiarPassword({ onClose }) {
  // Código temporal para probar el frontend.
  const codigoEsperado = "482731";

  const [paso, setPaso] = useState("verificar");
  const [codigo, setCodigo] = useState("");
  const [estadoVerificacion, setEstadoVerificacion] = useState("idle");

  const inputsRef = useRef([]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errores, setErrores] = useState({});

  const [actualizando, setActualizando] = useState(false);
  const [mensajeActualizacion, setMensajeActualizacion] = useState("");
  const [errorActualizacion, setErrorActualizacion] = useState("");
  const [estadoActualizacion, setEstadoActualizacion] = useState("idle");

  // Validaciones de la nueva contraseña.
  const passwordValida =
    password.length >= 8 &&
    password.length <= 50 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === password;

  function verificarCodigo(valor) {
    if (valor.length !== 6) return;

    if (valor !== codigoEsperado) {
      setEstadoVerificacion("error");

      setTimeout(() => {
        setCodigo("");
        setEstadoVerificacion("idle");
        inputsRef.current[0]?.focus();
      }, 1000);
    } else {
      setEstadoVerificacion("success");

      setTimeout(() => {
        setPaso("actualizar");
      }, 1000);
    }
  }

  const handleChange = (e, index) => {
    const digito = e.target.value;

    if (!/^\d?$/.test(digito)) return;

    const nuevoCodigo = codigo.split("");
    nuevoCodigo[index] = digito;

    const codigoActualizado = Array.from(
      { length: 6 },
      (_, i) => nuevoCodigo[i] ?? "",
    );

    const valorActualizado = codigoActualizado.join("");

    setCodigo(valorActualizado);

    if (valorActualizado.length === 6) {
      verificarCodigo(valorActualizado);
    }

    if (digito && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  async function enviarActualizacionPassword() {
    setActualizando(true);
    setMensajeActualizacion("");
    setErrorActualizacion("");

    try {
      const resultado = await actualizarPassword(password);

      setMensajeActualizacion(
        resultado.message || "Contraseña actualizada correctamente",
      );
      setEstadoActualizacion("success");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setErrorActualizacion(
        error.message || "No se pudo actualizar la contraseña",
      );
      setMensajeActualizacion(
        error.message || "No se pudo actualizar la contraseña",
      );
      setEstadoActualizacion("error");
    } finally {
      setActualizando(false);
    }
  }

  const renderInput = (index) => (
    <input
      ref={(elemento) => {
        inputsRef.current[index] = elemento;
      }}
      className={`codigo-input ${
        estadoVerificacion === "error" ? "error" : ""
      } ${estadoVerificacion === "success" ? "exito" : ""}`}
      key={index}
      type="text"
      maxLength={1}
      inputMode="numeric"
      autoComplete={index === 0 ? "one-time-code" : "off"}
      aria-label={`Dígito ${index + 1}`}
      value={codigo[index] ?? ""}
      onChange={(e) => handleChange(e, index)}
    />
  );

  function handleSubmit(e) {
    e.preventDefault();

    if (!passwordValida || !passwordsMatch) return;

    enviarActualizacionPassword();
  }

  return (
    <div className="password-modal-overlay" onClick={onClose}>
      <section
        className="password-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-modal-title"
      >
        {/* Encabezado: queda fuera del área desplazable. */}
        <header className="password-modal-header">
          <h2 id="password-modal-title">
            {paso === "verificar"
              ? "Verificar identidad"
              : "Actualizar contraseña"}
          </h2>

          <BtnClose onClick={onClose} />
        </header>

        {/* Solo esta área tiene scroll. */}
        <div className="password-modal-content">
          {paso === "verificar" && (
            <div className="modal-codigo">
              <p>
                Ingresá el código que enviamos al correo electrónico asociado a
                tu cuenta.
              </p>

              <form>
                <label htmlFor="codigo-verificacion">
                  Código de verificación
                </label>

                <div id="codigo-verificacion" className="codigo-container">
                  <div className="codigo-grupo">
                    {[0, 1, 2].map((index) => renderInput(index))}
                  </div>

                  <div className="codigo-grupo">
                    {[3, 4, 5].map((index) => renderInput(index))}
                  </div>
                </div>

                {estadoVerificacion === "error" && (
                  <p className="mensaje-error" role="alert">
                    Código incorrecto. Intentá nuevamente.
                  </p>
                )}

                {estadoVerificacion === "success" && (
                  <p className="mensaje-exito" role="status">
                    Verificación exitosa.
                  </p>
                )}
              </form>
            </div>
          )}

          {paso === "actualizar" &&
            (estadoActualizacion === "success" ? (
              <div className="resultado-modal resultado-exito">
                <div className="resultado-icono" aria-hidden="true">
                  ✓
                </div>

                <h3>¡Contraseña actualizada!</h3>
                <p>{mensajeActualizacion}</p>

                <p className="resultado-ayuda">
                  Este modal se cerrará automáticamente...
                </p>
              </div>
            ) : estadoActualizacion === "error" ? (
              <div className="resultado-modal resultado-error">
                <div className="resultado-icono" aria-hidden="true">
                  !
                </div>

                <h3>No pudimos actualizar la contraseña</h3>
                <p role="alert">{errorActualizacion || mensajeActualizacion}</p>

                <button
                  type="button"
                  className="btn-reintentar-password"
                  onClick={() => {
                    setEstadoActualizacion("idle");
                    setMensajeActualizacion("");
                  }}
                >
                  Volver a intentar
                </button>
              </div>
            ) : (
              <div className="modal-actualizar">
                <p>
                  Ingresá tu nueva contraseña y confirmala para guardar los
                  cambios.
                </p>

                <form onSubmit={handleSubmit}>
                  <section className="password-section">
                    <h3>Seguridad</h3>

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
                          required
                        />

                        <button
                          type="button"
                          className="register-password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                        >
                          <i
                            className={
                              showPassword ? "bi bi-eye-slash" : "bi bi-eye"
                            }
                          />
                        </button>
                      </div>

                      <PasswordStrength value={password} />

                      {!passwordValida && password.length > 0 && (
                        <small className="register-error">
                          La contraseña debe tener entre 8 y 50 caracteres,
                          mayúsculas, minúsculas, un número y un carácter
                          especial.
                        </small>
                      )}

                      {errores.contrasenia && (
                        <small className="register-error">
                          {errores.contrasenia}
                        </small>
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
                          required
                        />

                        <button
                          type="button"
                          className="register-password-toggle"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          aria-label={
                            showConfirmPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                        >
                          <i
                            className={
                              showConfirmPassword
                                ? "bi bi-eye-slash"
                                : "bi bi-eye"
                            }
                          />
                        </button>
                      </div>

                      {confirmPassword.length > 0 && (
                        <p
                          className={
                            passwordsMatch
                              ? "password-match"
                              : "password-mismatch"
                          }
                        >
                          {passwordsMatch
                            ? "✓ Las contraseñas coinciden"
                            : "Las contraseñas no coinciden"}
                        </p>
                      )}
                    </label>

                    {errores.general && (
                      <p className="register-error">{errores.general}</p>
                    )}

                    <button
                      type="submit"
                      className="btn-actualizar-password"
                      disabled={
                        !passwordValida || !passwordsMatch || actualizando
                      }
                    >
                      {actualizando ? "Actualizando…" : "Actualizar contraseña"}
                    </button>
                  </section>
                </form>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default CambiarPassword;
