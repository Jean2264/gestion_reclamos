import { useState } from "react";
import "./MiPerfil.css";

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

function MiPerfil() {
  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    calle: "",
    numero: "",
    localidad: "",
    codigoPostal: "",
    telefono: "",
    email: "",
  });

  const [originalData, setOriginalData] = useState(formData);

  const [editing, setEditing] = useState({
    nombre: false,
    apellido: false,
    fechaNacimiento: false,
    calle: false,
    numero: false,
    localidad: false,
    codigoPostal: false,
    telefono: false,
    email: false,
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleEdit(field) {
    setEditing((prev) => ({
      ...prev,
      [field]: true,
    }));
  }

  function handleSave() {
    console.log("Datos guardados:", formData);

    setOriginalData(formData);

    setEditing({
      nombre: false,
      apellido: false,
      fechaNacimiento: false,
      calle: false,
      numero: false,
      localidad: false,
      codigoPostal: false,
      telefono: false,
      email: false,
    });
  }

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  function renderField({
    field,
    label,
    icon,
    editable = true,
    type = "text",
    options = [],
  }) {
    return (
      <section className="profile-card">
        <div className="profile-card-info">
          <div className="profile-card-icon">
            <i className={`bi ${icon}`}></i>
          </div>

          <div className="profile-card-data">
            <span className="profile-card-label">{label}</span>

            {type === "select" ? (
              <select
                className={`profile-card-value ${
                  editing[field] ? "is-editing" : ""
                }`}
                name={field}
                value={formData[field]}
                disabled={!editing[field]}
                onChange={handleChange}
              >
                <option value="">Seleccioná una localidad</option>

                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
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
            )}
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

  return (
    <div className="mi-perfil">
      <Header />

      <main className="mi-perfil-container">
        <div className="mi-perfil-header">
          <h1>Mi perfil</h1>

          <p>Administrá y actualizá tu información personal.</p>
        </div>

        <div className="mi-perfil-sections">
          {/* =========================
              INFORMACIÓN PERSONAL
              ========================= */}

          <section className="profile-section">
            <div className="profile-section-header">
              <div className="profile-section-icon">
                <i className="bi bi-person"></i>
              </div>

              <div>
                <h2>Información personal</h2>
                <p>Datos personales del ciudadano.</p>
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
                field: "fechaNacimiento",
                label: "Fecha de nacimiento",
                icon: "bi-calendar-event",
                type: "date",
              })}

              {renderField({
                field: "telefono",
                label: "Teléfono",
                icon: "bi-telephone",
              })}
            </div>
          </section>

          {/* =========================
              DOMICILIO
              ========================= */}

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
                type: "select",
                options: ["Alejandro Korn", "San Vicente", "Domselaar"],
              })}

              {renderField({
                field: "codigoPostal",
                label: "Código postal",
                icon: "bi-mailbox",
              })}
            </div>
          </section>

          {/* =========================
              INFORMACIÓN DE CUENTA
              ========================= */}

          <section className="profile-section">
            <div className="profile-section-header">
              <div className="profile-section-icon">
                <i className="bi bi-person-lock"></i>
              </div>

              <div>
                <h2>Información de cuenta</h2>
                <p>Datos asociados a tu cuenta ciudadana.</p>
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
                  onClick={() => console.log("Cambiar contraseña")}
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
            >
              <i className="bi bi-check-lg"></i>
              Guardar cambios
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MiPerfil;
