import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";
import * as ciudadanoService from "../../services/ciudadano.service.js";
import * as reclamoService from "../../services/reclamo.service.js";
import "./NuevoReclamo.css";

const STORAGE_KEY = "nuevoReclamoBorrador";

const datosIniciales = {
  dni: "",
  numeroPartida: "",
  area: "",
  calle: "",
  calleUno: "",
  calleDos: "",
  altura: "",
  localidad: "",
  codigoPostal: "",
  descripcion: "",
  estadoTributario: false,
};

const codigosPostales = {
  "alejandro-korn": "1864",
  "san-vicente": "1865",
  domselaar: "1984",
};

function tieneDatos(datos) {
  return Object.entries(datos).some(([campo, valor]) => {
    if (campo === "estadoTributario") return valor;
    return typeof valor === "string" && valor.trim() !== "";
  });
}

function leerBorrador() {
  try {
    const borrador = localStorage.getItem(STORAGE_KEY);
    return borrador
      ? { ...datosIniciales, ...JSON.parse(borrador) }
      : { ...datosIniciales };
  } catch (error) {
    console.error("No se pudo recuperar el borrador del reclamo:", error);
    return { ...datosIniciales };
  }
}

function NuevoReclamo() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState(leerBorrador);
  const [areas, setAreas] = useState([]);
  const [areasError, setAreasError] = useState("");
  const [estadoDni, setEstadoDni] = useState("inicial");
  const [ciudadano, setCiudadano] = useState(null);
  const [errorDni, setErrorDni] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [errorBorrador, setErrorBorrador] = useState("");
  const [errorRegistro, setErrorRegistro] = useState("");
  const [modal, setModal] = useState("");
  const [paso, setPaso] = useState("formulario");
  const [enviando, setEnviando] = useState(false);
  const [reclamoCreado, setReclamoCreado] = useState(null);

  const hayDatos = tieneDatos(datos);

  useEffect(() => {
    let cancelado = false;

    async function cargarAreas() {
      try {
        const resultado = await reclamoService.obtenerAreas();
        if (!cancelado) {
          setAreas(resultado);
          setAreasError("");
        }
      } catch (error) {
        if (!cancelado) {
          setAreasError(error.message || "No se pudieron cargar las áreas.");
        }
      }
    }

    cargarAreas();
    return () => {
      cancelado = true;
    };
  }, []);

  function persistirBorrador(datosActualizados) {
    try {
      if (tieneDatos(datosActualizados)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(datosActualizados));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      setErrorBorrador("");
      return true;
    } catch (error) {
      console.error("No se pudo guardar el borrador del reclamo:", error);
      setErrorBorrador("No se pudo guardar el borrador en este navegador.");
      return false;
    }
  }

  function handleChange(event) {
    const { name, value, checked, type } = event.target;
    const nuevosDatos = {
      ...datos,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "localidad"
        ? { codigoPostal: codigosPostales[value] ?? "" }
        : {}),
    };
    setDatos(nuevosDatos);
    persistirBorrador(nuevosDatos);
    setGuardado(false);
    setErrorRegistro("");

    if (name === "dni") {
      setEstadoDni("inicial");
      setCiudadano(null);
      setErrorDni("");
    }
  }

  async function comprobarDni() {
    const dni = datos.dni.trim();

    if (!/^\d{7,8}$/.test(dni)) {
      setEstadoDni("invalido");
      setCiudadano(null);
      return;
    }

    setEstadoDni("buscando");
    setCiudadano(null);
    setErrorDni("");

    try {
      const resultado = await ciudadanoService.buscarCiudadanoPorDni(dni);
      setCiudadano(resultado);
      setEstadoDni("encontrado");
    } catch (error) {
      if (error.status === 404) {
        setEstadoDni("no-encontrado");
        return;
      }

      setEstadoDni("error");
      setErrorDni(error.message || "No se pudo comprobar el DNI.");
    }
  }

  function guardarBorrador() {
    if (persistirBorrador(datos)) {
      setGuardado(true);
      return true;
    }
    setGuardado(false);
    return false;
  }

  function validarDatosReclamo() {
    const partidaValida =
      /^[0-9-]+$/.test(datos.numeroPartida.trim()) &&
      /[0-9]/.test(datos.numeroPartida) &&
      !/^-|-$|--/.test(datos.numeroPartida);
    const areaValida = areas.some(
      (area) => String(area.id_area) === String(datos.area),
    );

    return (
      partidaValida &&
      areaValida &&
      Boolean(datos.calle.trim()) &&
      Boolean(datos.calleUno.trim()) &&
      Boolean(datos.calleDos.trim()) &&
      /^[1-9]\d*$/.test(datos.altura) &&
      Object.hasOwn(codigosPostales, datos.localidad) &&
      datos.codigoPostal === codigosPostales[datos.localidad] &&
      Boolean(datos.descripcion.trim())
    );
  }

  function confirmarDatos(event) {
    event.preventDefault();

    if (!/^\d{7,8}$/.test(datos.dni.trim())) {
      setEstadoDni("invalido");
      return;
    }

    if (estadoDni === "inicial" || estadoDni === "buscando") {
      setModal("verificacion-requerida");
      return;
    }

    if (estadoDni === "no-encontrado") {
      setModal("ciudadano-no-encontrado");
      return;
    }

    if (estadoDni === "error") {
      setErrorRegistro(
        errorDni || "No se pudo comprobar el DNI. Intentá nuevamente.",
      );
      return;
    }

    if (!ciudadano?.id_ciudadano) {
      setEstadoDni("inicial");
      setModal("verificacion-requerida");
      return;
    }

    if (!validarDatosReclamo()) {
      setErrorRegistro("Completá correctamente todos los campos obligatorios.");
      return;
    }

    setErrorRegistro("");
    setPaso("confirmacion");
  }

  function volverAlFormulario() {
    setPaso("formulario");
    setErrorRegistro("");
  }

  function guardarYRegistrarCiudadano() {
    if (!guardarBorrador()) {
      setModal("");
      return;
    }
    setModal("");
    navigate("/admin/ciudadanos");
  }

  async function registrarReclamo() {
    if (!ciudadano?.id_ciudadano || estadoDni !== "encontrado") {
      setPaso("formulario");
      setModal("verificacion-requerida");
      return;
    }

    setEnviando(true);
    setErrorRegistro("");

    try {
      const resultado = await reclamoService.crearReclamoAdmin(
        {
          numeroPartida: datos.numeroPartida.trim(),
          calle: datos.calle.trim(),
          calleUno: datos.calleUno.trim(),
          calleDos: datos.calleDos.trim(),
          altura: datos.altura,
          localidad: datos.localidad,
          codigoPostal: datos.codigoPostal,
          detalle: datos.descripcion.trim(),
          estadoTributario: datos.estadoTributario,
          idArea: datos.area,
        },
        ciudadano.id_ciudadano,
        ciudadano.dni,
      );

      setReclamoCreado(resultado.data);
      const datosLimpios = { ...datosIniciales };
      setDatos(datosLimpios);
      persistirBorrador(datosLimpios);
      setCiudadano(null);
      setEstadoDni("inicial");
      setPaso("exito");
    } catch (error) {
      setErrorRegistro(error.message || "No se pudo registrar el reclamo.");
    } finally {
      setEnviando(false);
    }
  }

  if (paso === "exito") {
    return (
      <div className="nuevo-reclamo">
        <section className="nuevo-reclamo-section reclamo-registro-exito">
          <div className="reclamo-exito-icono" aria-hidden="true">
            <i className="bi bi-check-lg"></i>
          </div>
          <h1>Reclamo registrado correctamente</h1>
          <p>El reclamo quedó asociado al ciudadano verificado.</p>
          <div className="codigo-reclamo-admin">
            <span>Código de reclamo</span>
            <strong>{reclamoCreado?.codigo_reclamo || "Registrado"}</strong>
          </div>
          <button
            type="button"
            className="btn-principal"
            onClick={() => {
              setReclamoCreado(null);
              setPaso("formulario");
            }}
          >
            Crear otro reclamo
          </button>
        </section>
      </div>
    );
  }

  if (paso === "confirmacion") {
    const areaSeleccionada = areas.find(
      (area) => String(area.id_area) === String(datos.area),
    );

    return (
      <div className="nuevo-reclamo">
        <header className="nuevo-reclamo-header">
          <div>
            <span className="nuevo-reclamo-etiqueta">NUEVO RECLAMO</span>
            <h1>Confirmar información</h1>
            <p>Revisá los datos antes de dar de alta el reclamo.</p>
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
            <h2>Ciudadano verificado</h2>
            <div className="resumen-grid">
              <div className="resumen-item">
                <span>Ciudadano</span>
                <strong>
                  {ciudadano.nombre} {ciudadano.apellido}
                </strong>
              </div>
              <div className="resumen-item">
                <span>DNI · ID</span>
                <strong>
                  {ciudadano.dni} · {ciudadano.id_ciudadano}
                </strong>
              </div>
            </div>
          </section>
          <section className="nuevo-reclamo-section">
            <h2>Información del reclamo</h2>
            <div className="resumen-grid">
              <div className="resumen-item">
                <span>Número de partida</span>
                <strong>{datos.numeroPartida}</strong>
              </div>
              <div className="resumen-item">
                <span>Área</span>
                <strong>{areaSeleccionada?.nombre_area}</strong>
              </div>
              <div className="resumen-item">
                <span>Calle y altura</span>
                <strong>
                  {datos.calle} {datos.altura}
                </strong>
              </div>
              <div className="resumen-item">
                <span>Entre calles</span>
                <strong>
                  {datos.calleUno} y {datos.calleDos}
                </strong>
              </div>
              <div className="resumen-item">
                <span>Localidad · código postal</span>
                <strong>
                  {datos.localidad} · {datos.codigoPostal}
                </strong>
              </div>
              <div className="resumen-item resumen-descripcion">
                <span>Descripción</span>
                <p>{datos.descripcion}</p>
              </div>
            </div>
          </section>
        </div>

        {errorRegistro && (
          <p className="reclamo-form-error" role="alert">
            {errorRegistro}
          </p>
        )}
        <footer className="nuevo-reclamo-actions">
          <button
            type="button"
            className="btn-secundario"
            onClick={volverAlFormulario}
            disabled={enviando}
          >
            Volver
          </button>
          <button
            type="button"
            className="btn-principal"
            onClick={registrarReclamo}
            disabled={enviando}
          >
            {enviando ? "Registrando..." : "Registrar reclamo"}
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
          <p>Completá los datos y verificá el DNI antes de darlo de alta.</p>
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
        noValidate
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
                disabled={estadoDni === "buscando"}
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
                `Ciudadano encontrado: ${ciudadano?.nombre} ${ciudadano?.apellido} (ID ${ciudadano?.id_ciudadano}).`}
              {estadoDni === "no-encontrado" &&
                "No se encontró un ciudadano con ese DNI."}
              {estadoDni === "invalido" &&
                "Ingresá un DNI válido de 7 u 8 dígitos."}
              {estadoDni === "error" &&
                (errorDni || "Ocurrió un error durante la comprobación.")}
            </div>
          )}
        </section>

        <section className="nuevo-reclamo-section">
          <div className="section-heading">
            <span className="section-numero">02</span>
            <div>
              <h2>Información del reclamo</h2>
              <p>Completá los datos de la partida, el área y la ubicación.</p>
            </div>
          </div>
          <div className="ciudadano-modal-row">
            <label className="ciudadano-label" htmlFor="numeroPartida">
              <span>
                Número de partida <span className="span-required">*</span>
              </span>
              <input
                id="numeroPartida"
                className="ciudadano-input"
                name="numeroPartida"
                type="text"
                value={datos.numeroPartida}
                onChange={handleChange}
                maxLength={20}
                required
              />
            </label>
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
                disabled={areas.length === 0}
              >
                <option value="">
                  {areas.length ? "Seleccioná un área" : "Cargando áreas..."}
                </option>
                {areas.map((area) => (
                  <option key={area.id_area} value={area.id_area}>
                    {area.nombre_area}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {areasError && (
            <p className="reclamo-form-error" role="alert">
              {areasError}
            </p>
          )}
          <label className="ciudadano-label" htmlFor="calle">
            <span>
              Calle <span className="span-required">*</span>
            </span>
            <input
              id="calle"
              className="ciudadano-input"
              name="calle"
              type="text"
              value={datos.calle}
              onChange={handleChange}
              maxLength={20}
              required
            />
          </label>
          <div className="ciudadano-modal-row">
            <label className="ciudadano-label" htmlFor="calleUno">
              <span>
                Entre calle 1 <span className="span-required">*</span>
              </span>
              <input
                id="calleUno"
                className="ciudadano-input"
                name="calleUno"
                type="text"
                value={datos.calleUno}
                onChange={handleChange}
                maxLength={20}
                required
              />
            </label>
            <label className="ciudadano-label" htmlFor="calleDos">
              <span>
                Entre calle 2 <span className="span-required">*</span>
              </span>
              <input
                id="calleDos"
                className="ciudadano-input"
                name="calleDos"
                type="text"
                value={datos.calleDos}
                onChange={handleChange}
                maxLength={20}
                required
              />
            </label>
          </div>
          <div className="ciudadano-modal-row">
            <label className="ciudadano-label" htmlFor="altura">
              <span>
                Altura <span className="span-required">*</span>
              </span>
              <input
                id="altura"
                className="ciudadano-input"
                name="altura"
                type="text"
                inputMode="numeric"
                value={datos.altura}
                onChange={handleChange}
                maxLength={20}
                required
              />
            </label>
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
              <span>Código postal</span>
              <input
                id="codigoPostal"
                className="ciudadano-input"
                name="codigoPostal"
                type="text"
                value={datos.codigoPostal}
                readOnly
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
              value={datos.descripcion}
              onChange={handleChange}
              rows={5}
              required
            />
          </label>
          <label className="reclamo-check-label" htmlFor="estadoTributario">
            <input
              id="estadoTributario"
              name="estadoTributario"
              type="checkbox"
              checked={datos.estadoTributario}
              onChange={handleChange}
            />
            El estado tributario se encuentra regular
          </label>
        </section>
      </form>

      {errorRegistro && (
        <p className="reclamo-form-error" role="alert">
          {errorRegistro}
        </p>
      )}
      {errorBorrador && (
        <p className="reclamo-form-error" role="alert">
          {errorBorrador}
        </p>
      )}
      <footer className="nuevo-reclamo-actions">
        <button
          type="button"
          className="btn-secundario"
          onClick={() => {
            if (!hayDatos) return;
            const datosLimpios = { ...datosIniciales };
            setDatos(datosLimpios);
            persistirBorrador(datosLimpios);
            setCiudadano(null);
            setEstadoDni("inicial");
            setGuardado(false);
            setErrorRegistro("");
          }}
          disabled={!hayDatos}
        >
          Limpiar formulario
        </button>
        <button
          type="submit"
          form="nuevo-reclamo-form"
          className="btn-principal"
        >
          Continuar →
        </button>
      </footer>

      <ConfirmModal
        isOpen={modal === "verificacion-requerida"}
        title="Verificación requerida"
        message="Primero comprobá la existencia del ciudadano y después da de alta el reclamo."
        onConfirm={() => setModal("")}
        onCancel={() => setModal("")}
        confirmLabel="OK"
        showCancel={false}
        icon="bi-arrow-right"
        variant="info"
      />
      <ConfirmModal
        isOpen={modal === "ciudadano-no-encontrado"}
        title="Ciudadano no encontrado"
        message="No existe ningún ciudadano afiliado con ese DNI. Por favor, registrá primero al ciudadano y después volvé a comprobar su existencia para dar de alta el reclamo."
        onConfirm={guardarYRegistrarCiudadano}
        onCancel={() => setModal("")}
        confirmLabel="Guardar borrador y registrar"
        cancelLabel="Seguir editando"
        icon="bi-person-exclamation"
        variant="warning"
      />
    </div>
  );
}

export default NuevoReclamo;
