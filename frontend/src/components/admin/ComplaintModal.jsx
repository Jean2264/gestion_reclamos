import { useEffect, useState } from "react";
import "./ComplaintModal.css";

function ComplaintModal({ reclamo, estados = [], onClose, onSaveEstado }) {
  const [estadoOriginal, setEstadoOriginal] = useState("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  // Sincronizar el estado cuando cambia el reclamo seleccionado.
  useEffect(() => {
    if (!reclamo) return;

    const estadoActual = reclamo.estado ?? "";

    setEstadoOriginal(estadoActual);
    setEstadoSeleccionado(estadoActual);
    setGuardando(false);
    setError("");
  }, [reclamo]);

  if (!reclamo) {
    return null;
  }

  // El botón aparece únicamente cuando el estado seleccionado
  // es diferente del estado original.
  const hayCambios = estadoSeleccionado !== estadoOriginal;

  // Normalizar las imágenes.
  // Se admiten URLs como strings o como objetos con propiedad "url".
  const imagenes = Array.isArray(reclamo.imagenes)
    ? reclamo.imagenes
        .map((imagen) => (typeof imagen === "string" ? imagen : imagen?.url))
        .filter((src) => typeof src === "string" && src.trim() !== "")
    : [];

  async function handleGuardarCambios() {
    if (!hayCambios || guardando) {
      return;
    }

    if (typeof onSaveEstado !== "function") {
      setError("No se configuró la función para guardar el estado.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      await onSaveEstado(reclamo, estadoSeleccionado);

      // Solo actualizar el estado original si el guardado tuvo éxito.
      setEstadoOriginal(estadoSeleccionado);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar el estado del reclamo.",
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="complaint-modal-overlay" onClick={onClose}>
      <div
        className="complaint-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="complaint-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <header className="complaint-modal-header">
          <div>
            <p className="complaint-modal-subtitle">Detalle del reclamo</p>

            <div className="cd-reclamo">
              <span>Código:</span>
              <strong>{reclamo.codigo ?? "Sin código"}</strong>
            </div>
          </div>

          <button
            type="button"
            className="complaint-modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </header>

        {/* CONTENIDO */}
        <div className="complaint-modal-content">
          {/* DATOS DEL RECLAMANTE */}
          <section className="complaint-modal-section">
            <h3 className="complaint-modal-section-title">
              Datos del reclamante
            </h3>

            <div className="complaint-modal-grid">
              <div className="complaint-modal-field">
                <span>DNI</span>
                <strong>{reclamo.dni || "No disponible"}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Nombre</span>
                <strong>{reclamo.nombre || "No disponible"}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Apellido</span>
                <strong>{reclamo.apellido || "No disponible"}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Estado tributario</span>
                <strong>{reclamo.estadoTributario || "No disponible"}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Número de partida</span>
                <strong>{reclamo.numeroPartida || "No disponible"}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Fecha de alta</span>
                <strong>{reclamo.fechaAlta || "No disponible"}</strong>
              </div>
            </div>
          </section>

          {/* UBICACIÓN */}
          <section className="complaint-modal-section">
            <h3 className="complaint-modal-section-title">Ubicación</h3>

            <div className="complaint-modal-grid">
              <div className="complaint-modal-field">
                <span>Área responsable</span>
                <strong>{reclamo.area || "No asignada"}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Calle</span>
                <strong>{reclamo.calle || "No disponible"}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Altura</span>
                <strong>{reclamo.altura || "No disponible"}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Entre calle</span>
                <strong>{reclamo.calleUno || "No disponible"}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Localidad</span>
                <strong>{reclamo.localidad || "No disponible"}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Y calle</span>
                <strong>{reclamo.calleDos || "No disponible"}</strong>
              </div>

              <div className="complaint-modal-field">
                <span>Código postal</span>
                <strong>{reclamo.codigoPostal || "No disponible"}</strong>
              </div>
            </div>
          </section>

          {/* IMÁGENES: LA SECCIÓN SOLO APARECE SI HAY IMÁGENES */}
          {imagenes.length > 0 && (
            <section className="complaint-modal-section">
              <h3 className="complaint-modal-section-title">Imágenes</h3>

              <div className="complaint-modal-images-grid">
                {imagenes.map((src, index) => (
                  <a
                    key={`${src}-${index}`}
                    href={src}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Abrir imagen ${index + 1} en otra pestaña`}
                  >
                    <img
                      src={src}
                      alt={`Imagen ${index + 1} del reclamo`}
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* DESCRIPCIÓN */}
          <section className="complaint-modal-section">
            <h3 className="complaint-modal-section-title">
              Descripción del reclamo
            </h3>

            <div className="complaint-modal-field">
              <textarea
                value={reclamo.detalle || ""}
                readOnly
                aria-label="Descripción del reclamo"
              />
            </div>
          </section>

          {/* ESTADO DEL RECLAMO */}
          <section className="complaint-modal-section">
            <h3 className="complaint-modal-section-title">
              Estado del reclamo
            </h3>

            <div className="complaint-modal-field">
              <label htmlFor="estado-reclamo">Estado actual</label>

              <div className="complaint-area-actions">
                <select
                  id="estado-reclamo"
                  value={estadoSeleccionado}
                  onChange={(event) =>
                    setEstadoSeleccionado(event.target.value)
                  }
                  disabled={guardando}
                >
                  {/* Conservar el estado actual aunque no esté
                      incluido temporalmente en la lista recibida. */}
                  {estadoSeleccionado &&
                    !estados.some(
                      (estado) => String(estado.nombre) === estadoSeleccionado,
                    ) && (
                      <option value={estadoSeleccionado}>
                        {estadoSeleccionado}
                      </option>
                    )}

                  {estados.map((estado) => (
                    <option
                      key={estado.id ?? estado.nombre}
                      value={estado.nombre}
                    >
                      {estado.nombre}
                    </option>
                  ))}
                </select>

                {/* SOLO SE MUESTRA SI EL ESTADO CAMBIÓ */}
                {hayCambios && (
                  <button
                    type="button"
                    className="complaint-area-save"
                    onClick={handleGuardarCambios}
                    disabled={guardando}
                  >
                    {guardando ? "Guardando..." : "Guardar cambios"}
                  </button>
                )}
              </div>
            </div>

            {hayCambios && (
              <p className="complaint-modal-status-hint">
                Estado original: <strong>{estadoOriginal}</strong>
                {" · "}
                Nuevo estado: <strong>{estadoSeleccionado}</strong>
              </p>
            )}

            {error && (
              <p className="complaint-modal-error" role="alert">
                {error}
              </p>
            )}
          </section>
        </div>

        {/* FOOTER */}
        <footer className="complaint-modal-footer">
          <button
            type="button"
            className="complaint-modal-button complaint-modal-button-secondary"
            onClick={onClose}
          >
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}

export default ComplaintModal;
