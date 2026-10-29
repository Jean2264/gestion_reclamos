import { useEffect, useState } from "react";
import "./NuevoReclamo.css";

const STORAGE_KEY = "nuevoReclamoBorrador";

const datosIniciales = {
  dni: "",
  area: "alumbrado",
  calle: "",
  numero: "",
  localidad: "",
  codigoPostal: "",
  descripcion: "",
};

function NuevoReclamo() {
  const [datos, setDatos] = useState(() => {
    try {
      const borrador = localStorage.getItem(STORAGE_KEY);

      return borrador
        ? { ...datosIniciales, ...JSON.parse(borrador) }
        : datosIniciales;
    } catch {
      return datosIniciales;
    }
  });

  const [estadoDni, setEstadoDni] = useState("inicial");
  const [guardado, setGuardado] = useState(false);
  const [paso, setPaso] = useState("formulario");

  // Determina si hay algún campo con contenido.
  const hayDatos = Object.entries(datos).some(([campo, valor]) => {
    if (campo === "area") {
      return valor !== datosIniciales.area;
    }

    return typeof valor === "string" && valor.trim() !== "";
  });

  // Guarda automáticamente los cambios del formulario.
  useEffect(() => {
    try {
      if (hayDatos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }

      setGuardado(false);
    } catch (error) {
      console.error("No se pudieron guardar los datos:", error);
    }
  }, [datos, hayDatos]);

  function handleChange(event) {
    const { name, value } = event.target;

    setDatos((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "dni") {
      setEstadoDni("inicial");
    }
  }

  // Por ahora es una simulación.
  // Más adelante se reemplazará por una petición al backend.
  async function comprobarDni() {
    const dni = datos.dni.trim();

    if (!dni) {
      setEstadoDni("invalido");
      return;
    }

    if (!/^\d{7,8}$/.test(dni)) {
      setEstadoDni("invalido");
      return;
    }

    setEstadoDni("buscando");

    try {
      /*
       * TODO: conectar con el backend.
       *
       * Ejemplo futuro:
       *
       * const respuesta = await fetch(
       *   `/api/ciudadanos/${encodeURIComponent(dni)}`
       * );
       *
       * if (!respuesta.ok) {
       *   setEstadoDni("no-encontrado");
       *   return;
       * }
       *
       * const ciudadano = await respuesta.json();
       * setEstadoDni("encontrado");
       */

      // Simulación temporal para probar la interfaz.
      await new Promise((resolve) => setTimeout(resolve, 700));

      // No se consulta una base de datos real.
      // Se utiliza un DNI de prueba para mostrar los estados visuales.
      if (dni === "12345678") {
        setEstadoDni("encontrado");
      } else {
        setEstadoDni("no-encontrado");
      }
    } catch {
      setEstadoDni("error");
    }
  }

  function guardarBorrador() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
      setGuardado(true);
    } catch {
      setGuardado(false);
      alert("No se pudieron guardar los datos en este navegador.");
    }
  }

  function confirmarDatos(event) {
    event.preventDefault();

    const dniValido = /^\d{7,8}$/.test(datos.dni.trim());

    if (!dniValido) {
      setEstadoDni("invalido");
      return;
    }

    if (estadoDni !== "encontrado") {
      alert("Primero tenés que comprobar la existencia del ciudadano.");
      return;
    }

    const camposObligatorios = [
      "calle",
      "numero",
      "localidad",
      "codigoPostal",
      "descripcion",
    ];

    const hayCamposVacios = camposObligatorios.some(
      (campo) => !datos[campo].trim(),
    );

    if (hayCamposVacios) {
      alert("Completá todos los campos obligatorios antes de continuar.");
      return;
    }

    setPaso("confirmacion");
  }

  function volverAlFormulario() {
    setPaso("formulario");
  }

  function limpiarBorrador() {
    const confirmar = window.confirm(
      "¿Querés borrar todos los datos del formulario?",
    );

    if (!confirmar) return;

    setDatos({ ...datosIniciales });
    setEstadoDni("inicial");
    setGuardado(false);
    setPaso("formulario");

    localStorage.removeItem(STORAGE_KEY);
  }

  if (paso === "confirmacion") {
    return (
      <div className="nuevo-reclamo">
        <header className="nuevo-reclamo-header">
          <div>
            <span className="nuevo-reclamo-etiqueta">NUEVO RECLAMO</span>

            <h1>Confirmar información</h1>

            <p>Revisá los datos antes de continuar.</p>
          </div>

          <button
            type="button"
            className="btn-secundario"
            onClick={volverAlFormulario}
          >
            Volver a editar
          </button>
        </header>

        <div className="nuevo-reclamo-resumen">
          <section className="nuevo-reclamo-section">
            <h2>Información personal</h2>

            <div className="resumen-grid">
              <div className="resumen-item">
                <span>DNI</span>
                <strong>{datos.dni}</strong>
              </div>
            </div>
            <div className="resumen-grid"></div>
          </section>

          <section className="nuevo-reclamo-section">
            <h2>Área del reclamo</h2>

            <div className="resumen-grid">
              <div className="resumen-item">
                <span>Área</span>
                <strong>
                  {
                    {
                      alumbrado: "Alumbrado público / luminaria",
                      pavimentacion: "Pavimentación",
                      zanjeo: "Abovedado con zanjeo",
                      residuos: "Recolección de residuos",
                      ramas: "Recolección de ramas",
                      arbustos: "Poda de arbustos",
                    }[datos.area]
                  }
                </strong>
              </div>
            </div>
          </section>

          <section className="nuevo-reclamo-section">
            <h2>Detalles del reclamo</h2>

            <div className="resumen-grid">
              <div className="resumen-item">
                <span>Calle</span>
                <strong>{datos.calle}</strong>
              </div>

              <div className="resumen-item">
                <span>Altura</span>
                <strong>{datos.numero}</strong>
              </div>

              <div className="resumen-item">
                <span>Localidad</span>
                <strong>{datos.localidad}</strong>
              </div>

              <div className="resumen-item">
                <span>Código postal</span>
                <strong>{datos.codigoPostal}</strong>
              </div>

              <div className="resumen-item resumen-descripcion">
                <span>Descripción</span>
                <p>{datos.descripcion}</p>
              </div>
            </div>
          </section>
        </div>

        <footer className="nuevo-reclamo-actions">
          <button
            type="button"
            className="btn-secundario"
            onClick={volverAlFormulario}
          >
            Volver
          </button>

          <button
            type="button"
            className="btn-principal"
            onClick={() => {
              alert(
                "Datos confirmados en el frontend. Falta implementar el envío al backend.",
              );
            }}
          >
            Confirmar reclamo
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="nuevo-reclamo">
      <header className="nuevo-reclamo-header">
        <div className="nuevo-reclamo-titulo">
          <span className="nuevo-reclamo-etiqueta">GESTIÓN MUNICIPAL</span>

          <h1>Nuevo reclamo</h1>

          <p>Completá la información para registrar un reclamo.</p>
        </div>

        {hayDatos && (
          <div className="nuevo-reclamo-guardar">
            <button
              type="button"
              className={`btn-guardar ${guardado ? "guardado" : ""}`}
              onClick={guardarBorrador}
            >
              {guardado ? "✓ Borrador guardado" : "Guardar borrador"}
            </button>

            <span className="guardar-ayuda">
              {guardado
                ? "Tus datos están guardados"
                : "Guardá tus avances cuando quieras"}
            </span>
          </div>
        )}
      </header>

      <form
        id="nuevo-reclamo-form"
        className="nuevo-reclamo-form"
        onSubmit={confirmarDatos}
      >
        <section className="nuevo-reclamo-section">
          <div className="section-heading">
            <span className="section-numero">01</span>

            <div>
              <h2>Información personal del ciudadano</h2>
              <p>Comprobá la existencia del ciudadano por su DNI.</p>
            </div>
          </div>

          <div className="dni-busqueda">
            <label className="ciudadano-label" htmlFor="dni">
              <span>
                DNI <span className="span-required">*</span>
              </span>

              <input
                id="dni"
                className="ciudadano-input"
                name="dni"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Ingresá el DNI sin puntos"
                value={datos.dni}
                onChange={handleChange}
                maxLength={8}
                required
              />
            </label>

            <button
              type="button"
              className="btn-comprobar"
              onClick={comprobarDni}
              disabled={estadoDni === "buscando"}
            >
              {estadoDni === "buscando"
                ? "Comprobando..."
                : "Comprobar existencia"}
            </button>
          </div>

          {estadoDni !== "inicial" && (
            <div
              className={`dni-mensaje dni-${estadoDni}`}
              role="status"
              aria-live="polite"
            >
              {estadoDni === "buscando" && "Estamos comprobando el DNI..."}

              {estadoDni === "encontrado" &&
                "Ciudadano encontrado. Podés continuar."}

              {estadoDni === "no-encontrado" &&
                "No se encontró un ciudadano con ese DNI."}

              {estadoDni === "invalido" &&
                "Ingresá un DNI válido de 7 u 8 dígitos."}

              {estadoDni === "error" &&
                "Ocurrió un error durante la comprobación."}
            </div>
          )}

          <p className="campo-ayuda">
            La comprobación actual es una demostración. El DNI 12345678 simula
            un ciudadano existente.
          </p>

          <div className="resumen-grid">
            <label className="ciudadano-label" htmlFor="numeroPartida">
              <span>
                Número de partida <span className="span-required">*</span>
              </span>

              <input
                id="numeroPartida"
                className="ciudadano-input"
                name="numeroPartida"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Ej. 123-456789-0"
                value={datos.numeroPartida}
                onChange={handleChange}
                maxLength={12}
                required
              />
            </label>
          </div>
        </section>

        <section className="nuevo-reclamo-section">
          <div className="section-heading">
            <span className="section-numero">02</span>

            <div>
              <h2>Área del reclamo</h2>
              <p>Seleccioná el área correspondiente al problema.</p>
            </div>
          </div>

          <label className="ciudadano-label" htmlFor="area">
            <span>
              Área <span className="span-required">*</span>
            </span>

            <select
              id="area"
              className="ciudadano-input"
              name="area"
              value={datos.area}
              onChange={handleChange}
              required
            >
              <option value="alumbrado">Alumbrado público / luminaria</option>
              <option value="pavimentacion">Pavimentación</option>
              <option value="zanjeo">Abovedado con zanjeo</option>
              <option value="residuos">Recolección de residuos</option>
              <option value="ramas">Recolección de ramas</option>
              <option value="arbustos">Poda de arbustos</option>
            </select>
          </label>
        </section>

        <section className="nuevo-reclamo-section">
          <div className="section-heading">
            <span className="section-numero">03</span>

            <div>
              <h2>Ubicación y detalles</h2>
              <p>Indicá dónde ocurre el problema y describilo.</p>
            </div>
          </div>

          <div className="ciudadano-modal-row">
            <label className="ciudadano-label" htmlFor="calle">
              <span>
                Calle <span className="span-required">*</span>
              </span>

              <input
                id="calle"
                className="ciudadano-input"
                name="calle"
                type="text"
                autoComplete="off"
                placeholder="Ej. San Martín"
                value={datos.calle}
                onChange={handleChange}
                required
              />
            </label>

            <label className="ciudadano-label" htmlFor="numero">
              <span>
                Altura <span className="span-required">*</span>
              </span>

              <input
                id="numero"
                className="ciudadano-input"
                name="numero"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Ej. 450"
                value={datos.numero}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="ciudadano-modal-row">
            <label className="ciudadano-label" htmlFor="localidad">
              <span>
                Localidad <span className="span-required">*</span>
              </span>

              <select
                id="localidad"
                className="ciudadano-input"
                name="localidad"
                value={datos.localidad}
                onChange={handleChange}
                required
              >
                <option value="">Seleccioná una localidad</option>
                <option value="alejandro-korn">Alejandro Korn</option>
                <option value="san-vicente">San Vicente</option>
                <option value="domselaar">Domselaar</option>
              </select>
            </label>

            <label className="ciudadano-label" htmlFor="codigoPostal">
              <span>
                Código postal <span className="span-required">*</span>
              </span>

              <input
                id="codigoPostal"
                className="ciudadano-input"
                name="codigoPostal"
                type="text"
                autoComplete="off"
                placeholder="Ej. 1864"
                value={datos.codigoPostal}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label className="ciudadano-label" htmlFor="descripcion">
            <span>
              Descripción <span className="span-required">*</span>
            </span>

            <textarea
              id="descripcion"
              className="ciudadano-input ciudadano-textarea"
              name="descripcion"
              placeholder="Describí el problema, su ubicación exacta y cualquier detalle relevante..."
              value={datos.descripcion}
              onChange={handleChange}
              rows={5}
              required
            />
          </label>
        </section>
      </form>

      <footer className="nuevo-reclamo-actions">
        <button
          type="button"
          className="btn-secundario"
          onClick={limpiarBorrador}
          disabled={!hayDatos}
        >
          Limpiar formulario
        </button>

        <button
          type="submit"
          form="nuevo-reclamo-form"
          className="btn-principal"
        >
          Confirmar datos →
        </button>
      </footer>
    </div>
  );
}

export default NuevoReclamo;
