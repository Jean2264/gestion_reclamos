
import { useMemo, useState } from "react";

import "./CiudadanoModal.css";
//import { crearCiudadano } from "../../services/ciudadano.service";

const CODIGOS_POSTALES = {
  "alejandro-korn": "1864",
  "san-vicente": "1865",
  domselaar: "1984",
};

const LOCALIDADES = [
  { value: "alejandro-korn", label: "Alejandro Korn" },
  { value: "san-vicente", label: "San Vicente" },
  { value: "domselaar", label: "Domselaar" },
];

const FORMULARIO_INICIAL = {
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
};

function validarCampo(nombre, valor) {
  const texto = String(valor ?? "").trim();

  switch (nombre) {
    case "nombre":
    case "apellido":
      if (!texto) return "Este campo es obligatorio.";
      if (!/^[\p{L}\s'-]+$/u.test(texto)) {
        return "Ingresá un nombre válido.";
      }
      if (texto.length < 2 || texto.length > 100) {
        return "Debe tener entre 2 y 100 caracteres.";
      }
      return "";

    case "dni":
      if (!texto) return "El DNI es obligatorio.";
      if (!/^\d{8}$/.test(texto)) {
        return "El DNI debe contener exactamente 8 números.";
      }
      return "";

    case "telefono":
      if (!texto) return "El teléfono es obligatorio.";
      if (!/^[0-9+()\s-]{8,20}$/.test(texto)) {
        return "Ingresá un teléfono válido.";
      }
      return "";

    case "email":
      if (!texto) return "El correo electrónico es obligatorio.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto)) {
        return "Ingresá un correo electrónico válido.";
      }
      if (texto.length > 50) {
        return "El correo no puede superar los 50 caracteres.";
      }
      return "";

    case "fechaNacimiento": {
      if (!texto) return "La fecha de nacimiento es obligatoria.";

      const fecha = new Date(`${texto}T00:00:00`);
      if (Number.isNaN(fecha.getTime())) {
        return "Ingresá una fecha válida.";
      }

      const hoy = new Date();
      const minimo = new Date(
        hoy.getFullYear() - 18,
        hoy.getMonth(),
        hoy.getDate()
      );

      if (fecha > minimo) {
        return "El ciudadano debe tener al menos 18 años.";
      }

      if (fecha > hoy) return "La fecha no puede ser futura.";
      return "";
    }

    case "calle":
      if (!texto) return "La calle es obligatoria.";
      if (texto.length > 20) {
        return "La calle no puede superar los 20 caracteres.";
      }
      return "";

    case "numero":
      if (!texto) return "El número de domicilio es obligatorio.";
      if (texto.length > 20) {
        return "El número no puede superar los 20 caracteres.";
      }
      return "";

    case "localidad":
      if (!texto) return "Seleccioná una localidad.";
      if (!CODIGOS_POSTALES[texto]) {
        return "Seleccioná una localidad válida.";
      }
      return "";

    case "codigoPostal":
      if (!texto) return "El código postal es obligatorio.";
      return "";

    default:
      return "";
  }
}

export default function CiudadanoModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [registrando, setRegistrando] = useState(false);
  const [intentoEnviar, setIntentoEnviar] = useState(false);

  const fechaMaxima = useMemo(() => {
    const hoy = new Date();
    const fecha = new Date(
      hoy.getFullYear() - 18,
      hoy.getMonth(),
      hoy.getDate()
    );

    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setErrorGeneral("");

    setFormData((previo) => {
      const actualizado = {
        ...previo,
        [name]: value,
      };

      if (name === "localidad") {
        actualizado.codigoPostal = CODIGOS_POSTALES[value] ?? "";
      }

      return actualizado;
    });

    setErrores((previo) => ({
      ...previo,
      [name]: "",
      ...(name === "localidad" ? { codigoPostal: "" } : {}),
    }));
  }

  function validarFormulario() {
    const nuevosErrores = {};

    Object.entries(formData).forEach(([campo, valor]) => {
      const error = validarCampo(campo, valor);
      if (error) nuevosErrores[campo] = error;
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (registrando) return;

    setIntentoEnviar(true);
    setErrorGeneral("");

    if (!validarFormulario()) return;

    setRegistrando(true);

    try {
      const datosCiudadano = {
        ...formData,
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        dni: formData.dni.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim().toLowerCase(),
        calle: formData.calle.trim(),
        numero: formData.numero.trim(),
        localidad: formData.localidad,
        codigoPostal: formData.codigoPostal,
      };

      // El backend generará la contraseña inicial a partir del DNI.
      // Este formulario NO envía una contraseña ni inicia sesión como ciudadano.
      const resultado = await crearCiudadano(datosCiudadano);

      onCreated?.(resultado);
      onClose?.();
    } catch (error) {
      if (error.errors && typeof error.errors === "object") {
        setErrores((previo) => ({ ...previo, ...error.errors }));
      }

      setErrorGeneral(
        error.message ||
          "No se pudo registrar al ciudadano. Intentá nuevamente."
      );
    } finally {
      setRegistrando(false);
    }
  }

  function cerrarModal() {
    if (!registrando) onClose?.();
  }

  function detenerPropagacion(event) {
    event.stopPropagation();
  }

  function campoInvalido(nombre) {
    return intentoEnviar && Boolean(errores[nombre]);
  }

  return (
    <div
      className="ciudadano-modal-overlay"
      onClick={cerrarModal}
      role="presentation"
    >
      <section
        className="ciudadano-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-alta-ciudadano"
        onClick={detenerPropagacion}
      >
        <header className="ciudadano-modal-header">
          <div>
            <h2 id="titulo-alta-ciudadano">Registrar ciudadano</h2>
            <p>Completá los datos para dar de alta al ciudadano.</p>
          </div>

          <button
            type="button"
            className="ciudadano-modal-close"
            onClick={cerrarModal}
            disabled={registrando}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </header>

        <form
          id="form-ciudadano"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="ciudadano-modal-body">
            <h3>Datos personales</h3>

            <div className="ciudadano-form-grid">
              <div className="ciudadano-form-group">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  onBlur={() =>
                    setErrores((previo) => ({
                      ...previo,
                      nombre: validarCampo("nombre", formData.nombre),
                    }))
                  }
                  autoComplete="given-name"
                  maxLength={100}
                  required
                  aria-invalid={campoInvalido("nombre")}
                />
                {intentoEnviar && errores.nombre && (
                  <small className="registrar-error">{errores.nombre}</small>
                )}
              </div>

              <div className="ciudadano-form-group">
                <label htmlFor="apellido">Apellido *</label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={handleChange}
                  onBlur={() =>
                    setErrores((previo) => ({
                      ...previo,
                      apellido: validarCampo("apellido", formData.apellido),
                    }))
                  }
                  autoComplete="family-name"
                  maxLength={100}
                  required
                  aria-invalid={campoInvalido("apellido")}
                />
                {intentoEnviar && errores.apellido && (
                  <small className="registrar-error">{errores.apellido}</small>
                )}
              </div>

              <div className="ciudadano-form-group">
                <label htmlFor="dni">DNI *</label>
                <input
                  id="dni"
                  name="dni"
                  type="text"
                  inputMode="numeric"
                  value={formData.dni}
                  onChange={(event) => {
                    const dni = event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 8);

                    handleChange({
                      target: { name: "dni", value: dni },
                    });
                  }}
                  maxLength={8}
                  autoComplete="off"
                  required
                  aria-invalid={campoInvalido("dni")}
                  placeholder="Ej.: 12345678"
                />
                {intentoEnviar && errores.dni && (
                  <small className="registrar-error">{errores.dni}</small>
                )}
              </div>

              <div className="ciudadano-form-group">
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  autoComplete="tel"
                  maxLength={20}
                  required
                  aria-invalid={campoInvalido("telefono")}
                />
                {intentoEnviar && errores.telefono && (
                  <small className="registrar-error">
                    {errores.telefono}
                  </small>
                )}
              </div>

              <div className="ciudadano-form-group">
                <label htmlFor="email">Correo electrónico *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  maxLength={50}
                  required
                  aria-invalid={campoInvalido("email")}
                />
                {intentoEnviar && errores.email && (
                  <small className="registrar-error">{errores.email}</small>
                )}
              </div>

              <div className="ciudadano-form-group">
                <label htmlFor="fechaNacimiento">Fecha de nacimiento *</label>
                <input
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  max={fechaMaxima}
                  required
                  aria-invalid={campoInvalido("fechaNacimiento")}
                />
                {intentoEnviar && errores.fechaNacimiento && (
                  <small className="registrar-error">
                    {errores.fechaNacimiento}
                  </small>
                )}
              </div>
            </div>

            <h3 className="ciudadano-section-title">Domicilio</h3>

            <div className="ciudadano-form-grid">
              <div className="ciudadano-form-group">
                <label htmlFor="calle">Calle *</label>
                <input
                  id="calle"
                  name="calle"
                  type="text"
                  value={formData.calle}
                  onChange={handleChange}
                  autoComplete="address-line1"
                  maxLength={20}
                  required
                  aria-invalid={campoInvalido("calle")}
                />
                {intentoEnviar && errores.calle && (
                  <small className="registrar-error">{errores.calle}</small>
                )}
              </div>

              <div className="ciudadano-form-group">
                <label htmlFor="numero">Número *</label>
                <input
                  id="numero"
                  name="numero"
                  type="text"
                  value={formData.numero}
                  onChange={handleChange}
                  maxLength={20}
                  required
                  aria-invalid={campoInvalido("numero")}
                />
                {intentoEnviar && errores.numero && (
                  <small className="registrar-error">{errores.numero}</small>
                )}
              </div>

              <div className="ciudadano-form-group">
                <label htmlFor="localidad">Localidad *</label>
                
             
               <div className="select-wrapper">
                <select
                 className="complaint-input"
                  id="localidad"
                  name="localidad"
                  value={formData.localidad}
                  onChange={handleChange}
                  required
                  aria-invalid={campoInvalido("localidad")}
                >
                  <option value="">Seleccioná una localidad</option>
                  {LOCALIDADES.map((localidad) => (
                    <option key={localidad.value} value={localidad.value}>
                      {localidad.label}
                    </option>
                  ))}
                </select>
                 <span className="select-arrow" aria-hidden="true"></span>
                 </div>
                {intentoEnviar && errores.localidad && (
                  <small className="registrar-error">
                    {errores.localidad}
                  </small>
                )}
              </div>

              <div className="ciudadano-form-group">
                <label htmlFor="codigoPostal">Código postal *</label>
                <input
                  id="codigoPostal"
                  name="codigoPostal"
                  type="text"
                  value={formData.codigoPostal}
                  readOnly
                  required
                  placeholder="Se completa automáticamente"
                  aria-invalid={campoInvalido("codigoPostal")}
                />
                {intentoEnviar && errores.codigoPostal && (
                  <small className="registrar-error">
                    {errores.codigoPostal}
                  </small>
                )}
              </div>
            </div>

            <p className="ciudadano-modal-help">
              La contraseña inicial del ciudadano será su DNI. Podrá cambiarla
              después de ingresar al sistema.
            </p>

            {errorGeneral && (
              <div className="ciudadano-modal-error" role="alert">
                {errorGeneral}
              </div>
            )}
          </div>

          <footer className="ciudadano-modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={cerrarModal}
              disabled={registrando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-action"
              disabled={registrando}
            >
              {registrando ? "Guardando..." : "Registrar ciudadano"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
