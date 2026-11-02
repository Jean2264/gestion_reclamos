import { useState, useEffect } from "react";
import "../public/MiPerfil.css";
import * as empleadoService from "../../services/empleado.service.js";

const datosIniciales = {
  dni: "",
  nombre: "",
  apellido: "",
  calle: "",
  numero: "",
  localidad: "",
  codigoPostal: "",
  telefono: "",
  email: "",
};

const camposEditables = {
  nombre: false,
  apellido: false,
  calle: false,
  numero: false,
  localidad: false,
  codigoPostal: false,
  telefono: false,
  email: false,
};

function normalizarPerfil(respuesta) {
  const perfil = respuesta?.data ?? respuesta;

  if (!perfil || typeof perfil !== "object") {
    throw new Error("El servidor no devolvió los datos del perfil.");
  }

  return {
    dni: perfil.dni ?? "",
    nombre: perfil.nombre ?? "",
    apellido: perfil.apellido ?? "",
    calle: perfil.calle ?? "",
    numero: perfil.numero ?? "",
    localidad: perfil.localidad ?? "",
    codigoPostal: perfil.codigo_postal ?? perfil.codigoPostal ?? "",
    telefono: perfil.telefono ?? "",
    email: perfil.email ?? "",
  };
}

function PerfilEmpleado() {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});

  const [formData, setFormData] = useState(datosIniciales);
  const [originalData, setOriginalData] = useState(datosIniciales);
  const [editing, setEditing] = useState(camposEditables);

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

    setError("");
    setMensaje("");
  }

  function handleEdit(field) {
    setEditing((prev) => ({
      ...prev,
      [field]: true,
    }));
  }

  function handleCancel() {
    setFormData(originalData);
    setEditing(camposEditables);
    setErrores({});
    setError("");
    setMensaje("");
  }

  async function handleSave() {
    try {
      setGuardando(true);
      setError("");
      setMensaje("");
      setErrores({});

      const respuesta =
        await empleadoService.actualizarMiPerfilEmpleado(formData);

      const datosPerfil = normalizarPerfil(respuesta);

      setFormData(datosPerfil);
      setOriginalData(datosPerfil);
      setEditing(camposEditables);

      setMensaje("Los cambios se guardaron correctamente.");
    } catch (err) {
      setError(err.message || "No se pudo actualizar el perfil.");

      if (err.errors) {
        setErrores(err.errors);
      }
    } finally {
      setGuardando(false);
    }
  }

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  function renderField({ field, label, icon, editable = true, type = "text" }) {
    return (
      <section className="profile-card" key={field}>
        <div className="profile-card-info">
          <div className="profile-card-icon">
            <i className={`bi ${icon}`}></i>
          </div>

          <div className="profile-card-data">
            <span className="profile-card-label">{label}</span>

            <input
              className={`profile-card-value ${
                editing[field] ? "is-editing" : ""
              }`}
              type={type}
              name={field}
              value={formData[field]}
              readOnly={!editing[field]}
              onChange={handleChange}
            />

            {errores[field] && <p className="field-error">{errores[field]}</p>}
          </div>
        </div>

        {editable && (
          <button
            type="button"
            className="profile-edit-button"
            onClick={() => handleEdit(field)}
            aria-label={`Editar ${label}`}
          >
            <i className="bi bi-pencil"></i>
          </button>
        )}
      </section>
    );
  }

  useEffect(() => {
    let activo = true;

    async function cargarPerfil() {
      try {
        setCargando(true);
        setError("");

        const respuesta = await empleadoService.miPerfilEmpleado();
        const perfil = respuesta?.data ?? respuesta;

        if (!perfil || typeof perfil !== "object") {
          throw new Error("El servidor no devolvió los datos del perfil.");
        }

        const datosPerfil = {
          dni: perfil.dni ?? "",
          nombre: perfil.nombre ?? "",
          apellido: perfil.apellido ?? "",
          calle: perfil.calle ?? "",
          numero: perfil.numero ?? "",
          localidad: perfil.localidad ?? "",
          codigoPostal: perfil.codigo_postal ?? perfil.codigoPostal ?? "",
          telefono: perfil.telefono ?? "",
          email: perfil.email ?? "",
        };

        if (activo) {
          setFormData(datosPerfil);
          setOriginalData(datosPerfil);
        }
      } catch (err) {
        if (activo) {
          setError(err.message || "No se pudo cargar el perfil.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarPerfil();

    return () => {
      activo = false;
    };
  }, []);

  if (cargando) {
    return (
      <div className="mi-perfil">
        <main className="mi-perfil-container">
          <p>Cargando perfil...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="mi-perfil">
      <main className="mi-perfil-container">
        <div className="mi-perfil-header">
          <h1>Mi perfil</h1>
        </div>

        {error && <p className="field-error">{error}</p>}

        {mensaje && <p className="profile-success-message">{mensaje}</p>}

        <div className="mi-perfil-sections">
          {/* INFORMACIÓN PERSONAL */}
          <section className="profile-section">
            <div className="profile-section-header">
              <div className="profile-section-icon">
                <i className="bi bi-person"></i>
              </div>

              <div>
                <h2>Información personal</h2>
                <p>Datos personales del empleado municipal.</p>
              </div>
            </div>

            <div className="profile-section-fields">
              {renderField({
                field: "dni",
                label: "DNI",
                icon: "bi-person-vcard",
                editable: false,
              })}

              {renderField({
                field: "nombre",
                label: "Nombre",
                icon: "bi-person",
              })}

              {renderField({
                field: "apellido",
                label: "Apellido",
                icon: "bi-person",
              })}

              {renderField({
                field: "telefono",
                label: "Teléfono",
                icon: "bi-telephone",
              })}
            </div>
          </section>

          {/* DOMICILIO */}
          <section className="profile-section">
            <div className="profile-section-header">
              <div className="profile-section-icon">
                <i className="bi bi-house"></i>
              </div>

              <div>
                <h2>Información de domicilio</h2>
                <p>Datos correspondientes a tu domicilio.</p>
              </div>
            </div>

            <div className="profile-section-fields">
              {renderField({
                field: "calle",
                label: "Calle",
                icon: "bi-signpost-2",
              })}

              {renderField({
                field: "numero",
                label: "Número",
                icon: "bi-house",
              })}

              {renderField({
                field: "localidad",
                label: "Localidad",
                icon: "bi-geo-alt",
              })}

              {renderField({
                field: "codigoPostal",
                label: "Código postal",
                icon: "bi-mailbox",
                editable: false,
              })}
            </div>
          </section>

          {/* INFORMACIÓN DE CUENTA */}
          <section className="profile-section">
            <div className="profile-section-header">
              <div className="profile-section-icon">
                <i className="bi bi-person-lock"></i>
              </div>

              <div>
                <h2>Información de cuenta</h2>
                <p>Datos asociados a tu cuenta de empleado.</p>
              </div>
            </div>

            <div className="profile-section-fields">
              {renderField({
                field: "email",
                label: "Correo electrónico",
                icon: "bi-envelope",
                type: "email",
              })}

              <section className="profile-card">
                <div className="profile-card-info">
                  <div className="profile-card-icon">
                    <i className="bi bi-key"></i>
                  </div>

                  <div className="profile-card-data">
                    <span className="profile-card-label">Contraseña</span>

                    <span className="profile-password-placeholder">
                      ••••••••
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="profile-edit-button"
                  onClick={() =>
                    setMensaje(
                      "El cambio de contraseña se implementará más adelante.",
                    )
                  }
                  aria-label="Cambiar contraseña"
                >
                  <i className="bi bi-pencil"></i>
                </button>
              </section>
            </div>
          </section>
        </div>

        {hasChanges && (
          <div className="mi-perfil-actions">
            <button
              type="button"
              className="profile-save-button"
              onClick={handleSave}
              disabled={guardando}
            >
              <i className="bi bi-check-lg"></i>
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>

            <button
              type="button"
              className="profile-edit-button"
              onClick={handleCancel}
              disabled={guardando}
            >
              Cancelar
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default PerfilEmpleado;
