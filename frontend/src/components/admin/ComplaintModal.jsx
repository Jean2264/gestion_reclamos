import { useEffect, useState } from "react";
import "./ComplaintModal.css";

const API_BASE_URL = "http://localhost:3000";
function obtenerIdEstado(reclamo, estados) {
  if (reclamo.id_estado != null) return String(reclamo.id_estado);
  if (reclamo.idEstado != null) return String(reclamo.idEstado);

  const nombre = reclamo.nombre_estado ?? reclamo.estado ?? "";

  const encontrado = estados.find(
    (estado) => (estado.nombre_estado ?? estado.nombre) === nombre,
  );

  return encontrado ? String(encontrado.id_estado ?? encontrado.id) : "";
}

function obtenerIdArea(reclamo, areas) {
  if (reclamo.id_area != null) return String(reclamo.id_area);
  if (reclamo.idArea != null) return String(reclamo.idArea);

  const nombre = reclamo.nombre_area ?? reclamo.area ?? "";

  const encontrada = areas.find(
    (area) => (area.nombre_area ?? area.nombre) === nombre,
  );

  return encontrada ? String(encontrada.id_area ?? encontrada.id) : "";
}

function formatearFecha(fecha) {
  if (!fecha) return "No disponible";

  const fechaObjeto = new Date(fecha);

  if (Number.isNaN(fechaObjeto.getTime())) {
    return "No disponible";
  }

  const dia = String(fechaObjeto.getUTCDate()).padStart(2, "0");
  const mes = String(fechaObjeto.getUTCMonth() + 1).padStart(2, "0");
  const anio = fechaObjeto.getUTCFullYear();

  return `${dia}/${mes}/${anio}`;
}

function ComplaintModal({
  reclamo,
  estados = [],
  areas = [],
  onClose,
  onSaveEstado,
  onSaveArea,
}) {
  const [estadoOriginal, setEstadoOriginal] = useState("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
  const [areaOriginal, setAreaOriginal] = useState("");
  const [areaSeleccionada, setAreaSeleccionada] = useState("");

  const [guardandoEstado, setGuardandoEstado] = useState(false);
  const [guardandoArea, setGuardandoArea] = useState(false);

  const [errorEstado, setErrorEstado] = useState("");
  const [exitoEstado, setExitoEstado] = useState("");
  const [errorArea, setErrorArea] = useState("");
  const [exitoArea, setExitoArea] = useState("");

  useEffect(() => {
    if (!reclamo) return;

    const idEstado = obtenerIdEstado(reclamo, estados);
    const idArea = obtenerIdArea(reclamo, areas);

    setEstadoOriginal(idEstado);
    setEstadoSeleccionado(idEstado);
    setAreaOriginal(idArea);
    setAreaSeleccionada(idArea);

    setGuardandoEstado(false);
    setGuardandoArea(false);

    setErrorEstado("");
    setExitoEstado("");
    setErrorArea("");
    setExitoArea("");
  }, [reclamo, estados, areas]);

  if (!reclamo) return null;

  const hayCambiosEstado =
    estadoSeleccionado !== "" && estadoSeleccionado !== estadoOriginal;

  const hayCambiosArea =
    areaSeleccionada !== "" && areaSeleccionada !== areaOriginal;

  const codigo = reclamo.codigo_reclamo ?? reclamo.codigo ?? "Sin código";

  const estadoActual = estados.find(
    (estado) => String(estado.id_estado ?? estado.id) === estadoOriginal,
  );

  const areaActual = areas.find(
    (area) => String(area.id_area ?? area.id) === areaOriginal,
  );

  const nombreEstadoActual =
    estadoActual?.nombre_estado ??
    estadoActual?.nombre ??
    reclamo.nombre_estado ??
    reclamo.estado ??
    "No disponible";

  const nombreAreaActual =
    areaActual?.nombre_area ??
    areaActual?.nombre ??
    reclamo.nombre_area ??
    reclamo.area ??
    "No asignada";

  const imagenes = Array.isArray(reclamo.imagenes)
    ? reclamo.imagenes
        .map((imagen) =>
          typeof imagen === "string"
            ? imagen
            : (imagen?.imagen_url ?? imagen?.url),
        )
        .filter((src) => typeof src === "string" && src.trim() !== "")
        .map((src) => {
          if (src.startsWith("http://") || src.startsWith("https://")) {
            return src;
          }

          return `${API_BASE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
        })
    : [];

  async function handleGuardarArea() {
    if (!hayCambiosArea || guardandoArea) return;

    if (typeof onSaveArea !== "function") {
      setErrorArea("No se configuró la función para guardar el área.");
      return;
    }

    try {
      setGuardandoArea(true);
      setErrorArea("");
      setExitoArea("");

      await onSaveArea(reclamo, Number(areaSeleccionada));

      setAreaOriginal(areaSeleccionada);
      setExitoArea("Área actualizada correctamente.");
    } catch (err) {
      setErrorArea(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el área. Por favor, intentelo nuevamente.",
      );
    } finally {
      setGuardandoArea(false);
    }
  }

  async function handleGuardarEstado() {
    if (!hayCambiosEstado || guardandoEstado) return;

    if (typeof onSaveEstado !== "function") {
      setErrorEstado("No se configuró la función para guardar el estado.");
      return;
    }

    try {
      setGuardandoEstado(true);
      setErrorEstado("");
      setExitoEstado("");

      await onSaveEstado(reclamo, Number(estadoSeleccionado));

      setEstadoOriginal(estadoSeleccionado);
      setExitoEstado("Estado actualizado correctamente.");
    } catch (err) {
      setErrorEstado(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el estado. Por favor, intentelo nuevamente.",
      );
    } finally {
      setGuardandoEstado(false);
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
        <header className="complaint-modal-header">
          <div>
            <p className="complaint-modal-subtitle">Detalle del reclamo</p>

            <div className="cd-reclamo">
              <span>Código:</span>
              <strong>{codigo}</strong>
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

        <div className="complaint-modal-content">
          {/* DATOS DEL RECLAMANTE */}
          <section className="complaint-modal-section">
            <h3 className="complaint-modal-section-title">
              Datos del reclamante
            </h3>

            <div className="complaint-modal-grid">
              <Campo
                etiqueta="DNI"
                valor={reclamo.ciudadano_dni ?? reclamo.dni}
              />

              <Campo
                etiqueta="Nombre"
                valor={reclamo.ciudadano_nombre ?? reclamo.nombre}
              />

              <Campo
                etiqueta="Apellido"
                valor={reclamo.ciudadano_apellido ?? reclamo.apellido}
              />

              <Campo
                etiqueta="Teléfono"
                valor={reclamo.ciudadano_telefono ?? reclamo.telefono}
              />

              <Campo
                etiqueta="Estado tributario"
                valor={
                  typeof reclamo.estadoTributario === "boolean"
                    ? reclamo.estadoTributario
                      ? "Regular"
                      : "Irregular"
                    : (reclamo.estadoTributario ?? reclamo.estado_tributario)
                }
              />

              <Campo
                etiqueta="Número de partida"
                valor={reclamo.numeroPartida ?? reclamo.numero_partida}
              />

              <Campo
                etiqueta="Fecha de alta"
                valor={formatearFecha(reclamo.fecha_alta ?? reclamo.fechaAlta)}
              />
            </div>
          </section>

          {/* ÁREA RESPONSABLE */}
          <section className="complaint-modal-section">
            <h3 className="complaint-modal-section-title">Área responsable</h3>

            <Campo
              etiqueta="Área actualmente asignada"
              valor={nombreAreaActual}
            />

            <div className="complaint-modal-field">
              <label htmlFor="area-responsable">Cambiar área responsable</label>

              <div className="complaint-edit-actions">
                <select
                  id="area-responsable"
                  value={areaSeleccionada}
                  onChange={(event) => {
                    setAreaSeleccionada(event.target.value);
                    setErrorArea("");
                    setExitoArea("");
                  }}
                  disabled={guardandoArea}
                >
                  <option value="" disabled>
                    Seleccioná un área
                  </option>

                  {areas.map((area) => {
                    const id = String(area.id_area ?? area.id);

                    return (
                      <option key={id} value={id}>
                        {area.nombre_area ?? area.nombre}
                      </option>
                    );
                  })}
                </select>

                {hayCambiosArea && (
                  <button
                    type="button"
                    className="complaint-edit-save"
                    onClick={handleGuardarArea}
                    disabled={guardandoArea}
                  >
                    {guardandoArea ? "Guardando..." : "Guardar cambios"}
                  </button>
                )}
              </div>
            </div>

            {exitoArea && (
              <p className="complaint-modal-success" role="status">
                {exitoArea}
              </p>
            )}

            {errorArea && (
              <p className="complaint-modal-error" role="alert">
                {errorArea}
              </p>
            )}
          </section>

          {/* UBICACIÓN */}
          <section className="complaint-modal-section">
            <h3 className="complaint-modal-section-title">Ubicación</h3>

            <div className="complaint-modal-grid">
              <Campo etiqueta="Calle" valor={reclamo.calle} />

              <Campo etiqueta="Altura" valor={reclamo.altura} />

              <Campo
                etiqueta="Entre calle 1"
                valor={reclamo.calle_uno ?? reclamo.calleUno}
              />

              <Campo
                etiqueta="Entre calle 2"
                valor={reclamo.calle_dos ?? reclamo.calleDos}
              />

              <Campo etiqueta="Localidad" valor={reclamo.localidad} />

              <Campo
                etiqueta="Código postal"
                valor={reclamo.codigoPostal ?? reclamo.codigo_postal}
              />
            </div>
          </section>

          {/* IMÁGENES */}
          {imagenes.length > 0 && (
            <section className="complaint-modal-section">
              <h3 className="complaint-modal-section-title">Imágenes</h3>

              <div className="complaint-modal-images-grid">
                {imagenes.map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className="complaint-image-container"
                  >
                    <img
                      src={src}
                      alt={`Imagen ${index + 1} del reclamo`}
                      loading="lazy"
                      onError={(event) => {
                        console.error(
                          "No se pudo cargar la imagen del reclamo:",
                          src,
                        );
                      }}
                    />
                  </div>
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
                value={reclamo.detalle ?? reclamo.detalle_reclamo ?? ""}
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

            <Campo etiqueta="Estado actual" valor={nombreEstadoActual} />

            <div className="complaint-modal-field">
              <label htmlFor="estado-reclamo">Cambiar estado</label>

              <div className="complaint-edit-actions complaint-state-actions">
                <select
                  id="estado-reclamo"
                  value={estadoSeleccionado}
                  onChange={(event) => {
                    setEstadoSeleccionado(event.target.value);
                    setErrorEstado("");
                    setExitoEstado("");
                  }}
                  disabled={guardandoEstado}
                >
                  <option value="" disabled>
                    Seleccioná un estado
                  </option>

                  {estados.map((estado) => {
                    const id = String(estado.id_estado ?? estado.id);

                    return (
                      <option key={id} value={id}>
                        {estado.nombre_estado ?? estado.nombre}
                      </option>
                    );
                  })}
                </select>

                {hayCambiosEstado && (
                  <button
                    type="button"
                    className="complaint-edit-save"
                    onClick={handleGuardarEstado}
                    disabled={guardandoEstado}
                  >
                    {guardandoEstado ? "Guardando..." : "Cambiar estado"}
                  </button>
                )}
              </div>
            </div>

            {hayCambiosEstado && (
              <p className="complaint-modal-status-hint">
                Estado actual: <strong>{nombreEstadoActual}</strong>
                {" · "}
                Nuevo estado:{" "}
                <strong>
                  {estados.find(
                    (estado) =>
                      String(estado.id_estado ?? estado.id) ===
                      estadoSeleccionado,
                  )?.nombre_estado ??
                    estados.find(
                      (estado) =>
                        String(estado.id_estado ?? estado.id) ===
                        estadoSeleccionado,
                    )?.nombre ??
                    "No disponible"}
                </strong>
              </p>
            )}

            {exitoEstado && (
              <p className="complaint-modal-success" role="status">
                {exitoEstado}
              </p>
            )}

            {errorEstado && (
              <p className="complaint-modal-error" role="alert">
                {errorEstado}
              </p>
            )}
          </section>
        </div>

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

function Campo({ etiqueta, valor }) {
  const mostrar =
    valor === false
      ? "No"
      : valor === true
        ? "Sí"
        : valor != null && String(valor).trim() !== ""
          ? valor
          : "No disponible";

  return (
    <div className="complaint-modal-field">
      <span>{etiqueta}</span>
      <strong>{mostrar}</strong>
    </div>
  );
}

export default ComplaintModal;
