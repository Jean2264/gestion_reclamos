import { useEffect, useState } from "react";

import { obtenerMisReclamos } from "../../services/reclamo.service.js";

import "./MisReclamos.css";

import Header from "../../components/common/Header";

import Footer from "../../components/common/Footer";

const LIMITE_POR_PAGINA = 10;

const ESTADOS = ["Nuevo", "Asignado", "En proceso", "Finalizado"];

function obtenerFechaActual() {
  const fecha = new Date();

  const anio = fecha.getFullYear();

  const mes = String(fecha.getMonth() + 1).padStart(2, "0");

  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function formatearFecha(fecha) {
  if (!fecha) return "—";

  const fechaDate = new Date(fecha);

  if (Number.isNaN(fechaDate.getTime())) {
    return "—";
  }

  return fechaDate.toLocaleDateString("es-AR", {
    day: "2-digit",

    month: "2-digit",

    year: "numeric",
  });
}

function obtenerClaseEstado(estado) {
  const clases = {
    Nuevo: "nuevo",

    Asignado: "asignado",

    "En proceso": "en-proceso",

    Finalizado: "finalizado",
  };

  return clases[estado] ?? "desconocido";
}

function MisReclamos() {
  const fechaActual = obtenerFechaActual();

  const [reclamos, setReclamos] = useState([]);

  const [paginacion, setPaginacion] = useState({
    pagina: 1,

    limite: LIMITE_POR_PAGINA,

    total: 0,

    totalPaginas: 0,
  });

  const [filtros, setFiltros] = useState({
    estado: "",

    desde: "",

    hasta: "",
  });

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    estado: "",

    desde: "",

    hasta: "",
  });

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  const [errorFiltros, setErrorFiltros] = useState("");

  async function cargarReclamos(
    filtrosActuales = filtrosAplicados,

    paginaActual = 1,
  ) {
    try {
      setCargando(true);

      setError("");

      const resultado = await obtenerMisReclamos({
        ...filtrosActuales,

        pagina: paginaActual,

        limite: LIMITE_POR_PAGINA,
      });

      setReclamos(resultado.data ?? []);

      setPaginacion(
        resultado.paginacion ?? {
          pagina: 1,

          limite: LIMITE_POR_PAGINA,

          total: 0,

          totalPaginas: 0,
        },
      );
    } catch (error) {
      setReclamos([]);

      setPaginacion({
        pagina: 1,

        limite: LIMITE_POR_PAGINA,

        total: 0,

        totalPaginas: 0,
      });

      setError(error.message || "No se pudieron cargar los reclamos.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarReclamos(
      {
        estado: "",

        desde: "",

        hasta: "",
      },

      1,
    );

    // La carga inicial se realiza una sola vez.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setFiltros((prev) => ({
      ...prev,

      [name]: value,
    }));

    setErrorFiltros("");
  }

  function handleFiltrar(e) {
    e.preventDefault();

    if (filtros.desde && filtros.desde > fechaActual) {
      setErrorFiltros("La fecha inicial no puede ser posterior al día de hoy.");

      return;
    }

    if (filtros.hasta && filtros.hasta > fechaActual) {
      setErrorFiltros("La fecha final no puede ser posterior al día de hoy.");

      return;
    }

    if (filtros.desde && filtros.hasta && filtros.desde > filtros.hasta) {
      setErrorFiltros(
        "La fecha inicial no puede ser posterior a la fecha final.",
      );

      return;
    }

    setErrorFiltros("");

    const nuevosFiltros = { ...filtros };

    setFiltrosAplicados(nuevosFiltros);

    cargarReclamos(nuevosFiltros, 1);
  }

  function handleLimpiarFiltros() {
    const filtrosVacios = {
      estado: "",

      desde: "",

      hasta: "",
    };

    setFiltros(filtrosVacios);

    setFiltrosAplicados(filtrosVacios);

    setErrorFiltros("");

    cargarReclamos(filtrosVacios, 1);
  }

  function handleCambiarPagina(nuevaPagina) {
    if (
      nuevaPagina < 1 ||
      nuevaPagina > paginacion.totalPaginas ||
      nuevaPagina === paginacion.pagina
    ) {
      return;
    }

    cargarReclamos(filtrosAplicados, nuevaPagina);
  }

  const primerRegistro =
    paginacion.total === 0
      ? 0
      : (paginacion.pagina - 1) * paginacion.limite + 1;

  const ultimoRegistro = Math.min(
    paginacion.pagina * paginacion.limite,

    paginacion.total,
  );

  return (
    <>
      <Header />

      <main className="mis-reclamos">
        <header className="mis-reclamos-header">
          <div className="mis-reclamos-titulo">
            <span className="mis-reclamos-icono">
              <i className="bi bi-file-earmark-text"></i>
            </span>

            <div>
              <h1>Mis reclamos</h1>

              <p>
                Consultá tus reclamos y conocé el estado actual de cada uno.
              </p>
            </div>
          </div>

          <div
            className="mis-reclamos-total"
            onClick={() => {
              document.getElementById("listado-reclamos")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();

                document.getElementById("listado-reclamos")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }}
            aria-label="Ir al listado de reclamos"
          >
            <span className="mis-reclamos-total-icono">
              <i className="bi bi-folder2-open"></i>
            </span>

            <div>
              <strong>{paginacion.total}</strong>
              <span>reclamos en total</span>
            </div>
          </div>
        </header>

        <section className="mis-reclamos-filtros">
          <div className="mis-reclamos-seccion-titulo">
            <i className="bi bi-funnel"></i>

            <h2>Filtrar reclamos</h2>
          </div>

          <form onSubmit={handleFiltrar}>
            <div className="mis-reclamos-filtros-grid">
              <div className="mis-reclamos-campo">
                <label htmlFor="filtro-estado">Estado del reclamo</label>

                <select
                  id="filtro-estado"
                  name="estado"
                  value={filtros.estado}
                  onChange={handleChange}
                >
                  <option value="">Todos los estados</option>

                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mis-reclamos-campo">
                <label htmlFor="filtro-desde">Desde</label>

                <input
                  id="filtro-desde"
                  type="date"
                  name="desde"
                  value={filtros.desde}
                  max={fechaActual}
                  onChange={handleChange}
                />
              </div>

              <div className="mis-reclamos-campo">
                <label htmlFor="filtro-hasta">Hasta</label>

                <input
                  id="filtro-hasta"
                  type="date"
                  name="hasta"
                  value={filtros.hasta}
                  min={filtros.desde || undefined}
                  max={fechaActual}
                  onChange={handleChange}
                />
              </div>
            </div>

            {errorFiltros && (
              <div className="mis-reclamos-alerta mis-reclamos-alerta-error">
                <i className="bi bi-exclamation-circle"></i>

                <span>{errorFiltros}</span>
              </div>
            )}

            <div className="mis-reclamos-acciones-filtro">
              <button
                type="button"
                className="mis-reclamos-btn mis-reclamos-btn-secundario"
                onClick={handleLimpiarFiltros}
                disabled={cargando}
              >
                <i className="bi bi-arrow-counterclockwise"></i>
                Limpiar filtros
              </button>

              <button
                type="submit"
                className="mis-reclamos-btn mis-reclamos-btn-principal"
                disabled={cargando}
              >
                <i className="bi bi-search"></i>
                Filtrar
              </button>
            </div>
          </form>
        </section>

        <section id="listado-reclamos" className="mis-reclamos-tabla-seccion">
          <div className="mis-reclamos-tabla-header">
            <div>
              <h2>Listado de reclamos</h2>

              <p>Consultá la información de tus solicitudes.</p>
            </div>

            <button
              type="button"
              className="mis-reclamos-btn-actualizar"
              onClick={() =>
                cargarReclamos(filtrosAplicados, paginacion.pagina)
              }
              disabled={cargando}
              aria-label="Actualizar listado"
              title="Actualizar listado"
            >
              <i
                className={`bi bi-arrow-clockwise ${cargando ? "girando" : ""}`}
              ></i>
            </button>
          </div>

          {error && (
            <div className="mis-reclamos-alerta mis-reclamos-alerta-error">
              <i className="bi bi-exclamation-triangle"></i>

              <div>
                <strong>No se pudieron cargar los reclamos</strong>

                <p>{error}</p>

                <button
                  type="button"
                  onClick={() =>
                    cargarReclamos(filtrosAplicados, paginacion.pagina)
                  }
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {!error && cargando && (
            <div className="mis-reclamos-estado-vacio">
              <span className="mis-reclamos-spinner"></span>

              <p>Cargando tus reclamos...</p>
            </div>
          )}

          {!error && !cargando && reclamos.length === 0 && (
            <div className="mis-reclamos-estado-vacio">
              <span className="mis-reclamos-vacio-icono">
                <i className="bi bi-inbox"></i>
              </span>

              <h3>No se encontraron reclamos</h3>

              <p>
                No hay reclamos que coincidan con los filtros seleccionados.
              </p>

              {(filtrosAplicados.estado ||
                filtrosAplicados.desde ||
                filtrosAplicados.hasta) && (
                <button
                  type="button"
                  className="mis-reclamos-btn mis-reclamos-btn-secundario"
                  onClick={handleLimpiarFiltros}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

          {!error && !cargando && reclamos.length > 0 && (
            <>
              <div className="mis-reclamos-tabla-contenedor">
                <table className="mis-reclamos-tabla">
                  <thead>
                    <tr>
                      <th>Fecha de alta</th>

                      <th>Código de reclamo</th>

                      <th>Área de gestión</th>

                      <th>N.º de partida</th>

                      <th>Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reclamos.map((reclamo) => (
                      <tr key={reclamo.id_reclamo}>
                        <td data-label="Fecha de alta">
                          <span className="mis-reclamos-fecha">
                            <i className="bi bi-calendar3"></i>

                            {formatearFecha(reclamo.fecha_alta)}
                          </span>
                        </td>

                        <td data-label="Código de reclamo">
                          <span className="mis-reclamos-codigo">
                            {reclamo.codigo_reclamo}
                          </span>
                        </td>

                        <td data-label="Área de gestión">
                          {reclamo.nombre_area || "Sin área asignada"}
                        </td>

                        <td data-label="N.º de partida">
                          {reclamo.numero_partida || "—"}
                        </td>

                        <td data-label="Estado">
                          <span
                            className={`mis-reclamos-estado-badge ${obtenerClaseEstado(
                              reclamo.nombre_estado,
                            )}`}
                          >
                            <span className="mis-reclamos-estado-punto"></span>

                            {reclamo.nombre_estado || "Sin estado"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <footer className="mis-reclamos-paginacion">
                <p>
                  Mostrando{" "}
                  <strong>
                    {primerRegistro}–{ultimoRegistro}
                  </strong>{" "}
                  de <strong>{paginacion.total}</strong>{" "}
                  {paginacion.total === 1 ? "reclamo" : "reclamos"}
                </p>

                <div className="mis-reclamos-paginacion-controles">
                  <button
                    type="button"
                    className="mis-reclamos-pagina-btn"
                    onClick={() => handleCambiarPagina(paginacion.pagina - 1)}
                    disabled={paginacion.pagina <= 1 || cargando}
                    aria-label="Página anterior"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>

                  <span className="mis-reclamos-pagina-actual">
                    Página <strong>{paginacion.pagina}</strong> de{" "}
                    <strong>{paginacion.totalPaginas}</strong>
                  </span>

                  <button
                    type="button"
                    className="mis-reclamos-pagina-btn"
                    onClick={() => handleCambiarPagina(paginacion.pagina + 1)}
                    disabled={
                      paginacion.pagina >= paginacion.totalPaginas || cargando
                    }
                    aria-label="Página siguiente"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </footer>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default MisReclamos;
