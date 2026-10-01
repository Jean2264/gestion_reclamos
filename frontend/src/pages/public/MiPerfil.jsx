import { useState } from "react";
import "./MiPerfil.css";

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

function MiPerfil() {
  const [formData, setFormData] = useState({
    dni: "12.345.678",
    nombre: "Jean",
    apellido: "Paiva",
    fechaNacimiento: "2005-01-22",
    calle: "Av. Siempre Viva",
    numero: "123",
    localidad: "Alejandro Kor",
    codigoPostal: "1000",
    telefono: "11 1234-5678",
    email: "jean@email.com",
  });

  const [originalData, setOriginalData] = useState(formData);

  const [editing, setEditing] = useState({
    nombre: false,
    apellido: false,
    calle: false,
    numero: false,
    localidad: false,
    codigoPostal: false,
    telefono: false,
    email: false,
    fechaNacimiento: false,
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
      calle: false,
      numero: false,
      localidad: false,
      codigoPostal: false,
      telefono: false,
      email: false,
      fechaNacimiento: false,
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
          {/* DNI */}
          {renderField({
            field: "dni",
            label: "DNI",
            icon: "bi-person-vcard",
            editable: false,
          })}

          {/* Nombre */}
          {renderField({
            field: "nombre",
            label: "Nombre",
            icon: "bi-person",
          })}

          {/* Apellido */}
          {renderField({
            field: "apellido",
            label: "Apellido",
            icon: "bi-person",
          })}

          {/* Fecha de nacimiento */}
          {renderField({
            field: "fechaNacimiento",
            label: "Fecha de nacimiento",
            icon: "bi-calendar-event",
            type: "date",
          })}

          {/* Calle */}
          {renderField({
            field: "calle",
            label: "Calle",
            icon: "bi-signpost-2",
          })}

          {/* Número */}
          {renderField({
            field: "numero",
            label: "Número",
            icon: "bi-house",
          })}

          {/* Localidad */}
          {renderField({
            field: "localidad",
            label: "Localidad",
            icon: "bi-geo-alt",
            type: "select",
            options: ["Alejandro Korn", "San Vicente", "Domselar"],
          })}

          {/* Código postal */}
          {renderField({
            field: "codigoPostal",
            label: "Código postal",
            icon: "bi-mailbox",
          })}

          {/* Teléfono */}
          {renderField({
            field: "telefono",
            label: "Teléfono",
            icon: "bi-telephone",
          })}

          {/* Email */}
          {renderField({
            field: "email",
            label: "Correo electrónico",
            icon: "bi-envelope",
            type: "email",
          })}
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
