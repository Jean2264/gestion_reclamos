import { useState, useEffect, useRef } from "react";
import { obtenerAreas, crearReclamo } from "../../services/reclamo.service.js";
import { generarComprobante } from "../../utils/generarComprobante.js";

import imageCompression from "browser-image-compression";
import "./ComplaintForm.css";

function ComplaintForm({ onMostrarResultado }) {
  const [areas, setAreas] = useState([]);
  const [errorAreas, setErrorAreas] = useState("");
  const [formData, setFormData] = useState({
    area: "",
    calle: "",
    calleUno: "",
    calleDos: "",
    altura: "",
    localidad: "",
    codigoPostal: "",
    numeroPartida: "",
    descripcion: "",
    estadoTributario: false,
  });
  const codigosPostales = {
    "alejandro-korn": "1864",
    "san-vicente": "1865",
    domselaar: "1984",
  };

  const [status, setStatus] = useState("idle");
  const [images, setImages] = useState([null, null]);
  const [activeImage, setActiveImage] = useState(0);
  const imagesContainerRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [imageErrors, setImageErrors] = useState(["", ""]);
  const [reclamoRegistrado, setReclamoRegistrado] = useState(null);
  const [errorRegistro, setErrorRegistro] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    // Número de partida: solo números y guiones.
    if (name === "numeroPartida" && !/^[0-9-]*$/.test(value)) {
      return;
    }

    // Altura: solo números, sin espacios ni signos.
    if (name === "altura" && !/^[0-9]*$/.test(value)) {
      return;
    }

    setFormData((prev) => {
      const nuevosDatos = {
        ...prev,
        [name]: value,
      };

      if (name === "localidad") {
        nuevosDatos.codigoPostal =
          codigosPostales[value.toLowerCase().replaceAll(" ", "-")] ?? "";
      }

      return nuevosDatos;
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      ...(name === "localidad" ? { codigoPostal: "" } : {}),
    }));
  }

  async function handleImageChange(index, e) {
    const file = e.target.files[0];

    // Si no se seleccionó ningún archivo, terminamos.
    if (!file) return;

    // Permitimos JPG, PNG y WEBP.
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

    if (!tiposPermitidos.includes(file.type)) {
      setImageErrors((prev) => {
        const nuevosErrores = [...prev];
        nuevosErrores[index] =
          "Formato no válido. Seleccioná una imagen JPG, PNG o WEBP.";
        return nuevosErrores;
      });
      e.target.value = "";
      return;
    }

    // Límite de 5 MB para la imagen original.
    const MAX_SIZE_ORIGINAL = 5 * 1024 * 1024;

    if (file.size > MAX_SIZE_ORIGINAL) {
      setImageErrors((prev) => {
        const nuevosErrores = [...prev];
        nuevosErrores[index] =
          "La imagen supera los 5 MB. Seleccioná una imagen más pequeña.";
        return nuevosErrores;
      });

      e.target.value = "";
      return;
    }
    try {
      const opciones = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
      };

      // Comprimimos la imagen en el navegador.
      const imagenComprimida = await imageCompression(file, opciones);

      // Comprobamos el tamaño final.
      if (imagenComprimida.size > 2 * 1024 * 1024) {
        setImageErrors((prev) => {
          const nuevosErrores = [...prev];
          nuevosErrores[index] =
            "No se pudo reducir la imagen a 2 MB. Intentá con otra imagen.";
          return nuevosErrores;
        });
        e.target.value = "";
        return;
      }

      // Guardamos la imagen comprimida en el campo seleccionado.
      setImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = imagenComprimida;
        return newImages;
      });

      console.log(
        "Imagen original:",
        (file.size / 1024 / 1024).toFixed(2),
        "MB",
      );
      console.log(
        "Imagen comprimida:",
        (imagenComprimida.size / 1024 / 1024).toFixed(2),
        "MB",
      );

      setImageErrors((prev) => {
        const nuevosErrores = [...prev];
        nuevosErrores[index] = "";
        return nuevosErrores;
      });
    } catch (error) {
      console.error("Error al comprimir la imagen:", error);
      setImageErrors((prev) => {
        const nuevosErrores = [...prev];
        nuevosErrores[index] =
          "No se pudo procesar la imagen. Intentá con otra.";
        return nuevosErrores;
      });
    } finally {
      // Permite volver a seleccionar el mismo archivo.
      e.target.value = "";
    }
  }
  function handleRemoveImage(index) {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = null;
      return newImages;
    });

    setImageErrors((prev) => {
      const nuevosErrores = [...prev];
      nuevosErrores[index] = "";
      return nuevosErrores;
    });
  }

  function handleImagesScroll() {
    const container = imagesContainerRef.current;

    if (!container) return;

    const imageWidth =
      container.firstElementChild?.getBoundingClientRect().width;

    if (!imageWidth) return;

    const gap = Number.parseFloat(getComputedStyle(container).columnGap) || 0;

    const index = Math.round(container.scrollLeft / (imageWidth + gap));

    setActiveImage(Math.min(1, Math.max(0, index)));
  }

  function validarFormulario() {
    const nuevosErrores = {};

    // Número de partida: obligatorio, solo dígitos y guiones.
    const partida = formData.numeroPartida;

    if (!partida.trim()) {
      nuevosErrores.numeroPartida = "El número de partida es obligatorio.";
    } else if (!/^[0-9-]+$/.test(partida)) {
      nuevosErrores.numeroPartida = "Solo se permiten números y guiones.";
    } else if (!/[0-9]/.test(partida)) {
      nuevosErrores.numeroPartida =
        "La partida debe contener al menos un número.";
    } else if (/^-|-$/.test(partida) || /--/.test(partida)) {
      nuevosErrores.numeroPartida = "Revisá la posición de los guiones.";
    }

    // Área: debe existir entre las áreas devueltas por el backend.
    if (
      !formData.area ||
      !areas.some((area) => String(area.id_area) === String(formData.area))
    ) {
      nuevosErrores.area = "Seleccioná un área válida.";
    }

    if (!formData.calle.trim()) {
      nuevosErrores.calle = "La calle es obligatoria.";
    }

    // Altura: entero positivo, sin espacios ni signos.
    if (!formData.altura) {
      nuevosErrores.altura = "La altura es obligatoria.";
    } else if (!/^[1-9][0-9]*$/.test(formData.altura)) {
      nuevosErrores.altura =
        "Ingresá un número entero mayor que cero, sin espacios.";
    }

    // Se mantienen obligatorias como en el formulario original.
    if (!formData.calleUno.trim()) {
      nuevosErrores.calleUno = "El campo entre calle 1 es obligatorio.";
    }

    if (!formData.calleDos.trim()) {
      nuevosErrores.calleDos = "El campo entre calle 2 es obligatorio.";
    }

    const localidadesValidas = ["alejandro-korn", "san-vicente", "domselaar"];

    if (!localidadesValidas.includes(formData.localidad)) {
      nuevosErrores.localidad = "Seleccioná una localidad válida.";
    }

    const codigoPostalEsperado = codigosPostales[formData.localidad] ?? "";

    if (
      !formData.codigoPostal ||
      formData.codigoPostal !== codigoPostalEsperado
    ) {
      nuevosErrores.codigoPostal =
        "No se pudo determinar un código postal válido para la localidad.";
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción del reclamo es obligatoria.";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function reiniciarFormulario() {
    setFormData({
      area: "",
      calle: "",
      calleUno: "",
      calleDos: "",
      altura: "",
      localidad: "",
      codigoPostal: "",
      numeroPartida: "",
      descripcion: "",
      estadoTributario: false,
    });

    setImages([null, null]);
    setImageErrors(["", ""]);
    setErrors({});
    setReclamoRegistrado(null);
    setStatus("idle");

    onMostrarResultado?.(false);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 1. Validar los campos del formulario.
    const formularioValido = validarFormulario();

    // 2. Comprobar si hay errores en las imágenes.
    const hayErroresImagenes = imageErrors.some((error) => error !== "");

    if (!formularioValido || hayErroresImagenes) {
      return;
    }

    // 3. Preparar los datos con los nombres que espera el backend.
    const datosReclamo = {
      numeroPartida: formData.numeroPartida.trim(),
      calle: formData.calle.trim(),
      altura: formData.altura,
      calleUno: formData.calleUno.trim(),
      calleDos: formData.calleDos.trim(),
      localidad: formData.localidad,
      codigoPostal: formData.codigoPostal,
      detalle: formData.descripcion.trim(),
      estadoTributario: formData.estadoTributario,
      idArea: formData.area,
    };

    // Eliminar los espacios vacíos del arreglo de imágenes.
    const imagenesSeleccionadas = images.filter((imagen) => imagen !== null);

    try {
      setStatus("loading");

      const resultado = await crearReclamo(datosReclamo, imagenesSeleccionadas);

      // Buscamos el área que seleccionó el ciudadano.
      const areaSeleccionada = areas.find(
        (area) => String(area.id_area) === String(formData.area),
      );

      // Guardamos el reclamo junto con el nombre del área.
      const reclamoConArea = {
        ...resultado.reclamo,
        areaResponsable: areaSeleccionada?.nombre_area ?? "No especificada",
      };

      setReclamoRegistrado(reclamoConArea);
      setStatus("success");
      onMostrarResultado(true);
    } catch (error) {
      console.error("Error al registrar el reclamo:", error);

      setErrorRegistro(
        error.message || "Ocurrió un error inesperado al registrar el reclamo.",
      );

      setStatus("error");
      onMostrarResultado(true);
    }
  };

  useEffect(() => {
    async function cargarAreas() {
      try {
        const data = await obtenerAreas();
        setAreas(data);
      } catch (error) {
        console.error("Error al cargar las áreas:", error);
        setErrorAreas("No se pudieron cargar las áreas.");
      }
    }

    cargarAreas();
  }, []);

  if (status === "success" && reclamoRegistrado) {
    return (
      <section className="reclamo-success">
        <div className="success-icon" aria-hidden="true">
          ✓
        </div>

        <h2>¡Reclamo registrado correctamente!</h2>

        <p>
          Tu reclamo se registró correctamente. Conservá el siguiente código
          para consultar su estado.
        </p>

        <div className="codigo-reclamo">
          <span>Código de reclamo</span>

          <strong>{reclamoRegistrado.codigoReclamo}</strong>
        </div>

        <p>Estado inicial: {reclamoRegistrado.estado}</p>

        <div className="reclamo-success-actions">
          <button
            type="button"
            className="btn-imprimir"
            onClick={async () => {
              try {
                await generarComprobante(reclamoRegistrado);
              } catch (error) {
                console.error("Error al generar el comprobante:", error);
                alert(error.message || "No se pudo generar el PDF.");
              }
            }}
          >
            Descargar comprobante PDF
          </button>

          <button
            type="button"
            className="btn-nuevo-reclamo"
            onClick={() => {
              setReclamoRegistrado(null);
              setErrorRegistro("");
              setStatus("idle");
              onMostrarResultado(false);
              setFormData({
                area: "",
                calle: "",
                calleUno: "",
                calleDos: "",
                altura: "",
                localidad: "",
                codigoPostal: "",
                numeroPartida: "",
                descripcion: "",
                estadoTributario: false,
              });
              setImages([null, null]);
            }}
          >
            Registrar otro reclamo
          </button>
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="reclamo-error">
        <div className="error-icon" aria-hidden="true">
          ✕
        </div>

        <h2>No se pudo registrar el reclamo</h2>

        <p>
          {errorRegistro ||
            "Ocurrió un problema al intentar registrar tu reclamo. Revisá tu conexión e intentá nuevamente."}
        </p>

        <div className="reclamo-error-actions">
          <button
            type="button"
            className="btn-reintentar"
            onClick={() => {
              setStatus("idle");
              setErrorRegistro("");
              onMostrarResultado(false);
            }}
          >
            Volver a intentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="complaint-form">
      <form onSubmit={handleSubmit}>
        {/* ENCABEZADO */}
        <section className="complaint-header">
          <h2>Nuevo reclamo</h2>

          <p className="desc">
            Complete los siguientes datos para registrar su reclamo. Los campos
            indicados con (<span className="span-required">*</span>) son
            obligatorios.
          </p>
        </section>
        <section className="complaint-section">
          <label className="complaint-label">
            <span className="label-text">
              Numero de partida <span className="span-required">*</span>
            </span>
            <p className="desc">
              Ingrese el número de partida de la propiedad de residencia
            </p>
            <input
              className="complaint-input"
              type="text"
              name="numeroPartida"
              value={formData.numeroPartida}
              onChange={handleChange}
              autoComplete="off"
              aria-invalid={Boolean(errors.numeroPartida)}
              aria-describedby={
                errors.numeroPartida ? "error-numero-partida" : undefined
              }
            />
            {errors.numeroPartida && (
              <small className="field-error">{errors.numeroPartida}</small>
            )}
          </label>
        </section>
        {/* ÁREA */}
        <section className="complaint-section">
          <h3>Área del reclamo</h3>

          <p className="section-description">
            Seleccione el área correspondiente al reclamo que desea realizar.
          </p>

          <label className="complaint-label">
            <span className="label-text">
              Área <span className="span-required">*</span>
            </span>
            {errorAreas && (
              <small className="field-error" role="alert">
                {errorAreas}
              </small>
            )}

            <div className="select-wrapper">
              <select
                className="complaint-input"
                name="area"
                value={formData.area}
                onChange={handleChange}
              >
                <option value="">Seleccione un área</option>

                {areas.map((area) => (
                  <option key={area.id_area} value={area.id_area}>
                    {area.nombre_area}
                  </option>
                ))}
              </select>

              <span className="select-arrow" aria-hidden="true"></span>
            </div>
            {errors.area && (
              <small className="field-error">{errors.area}</small>
            )}
          </label>
        </section>

        {/* UBICACIÓN */}
        <section className="complaint-section">
          <h3>Ubicación del reclamo</h3>

          <p className="section-description">
            Indique dónde se encuentra el inconveniente.
          </p>

          <div className="complaint-row">
            <label className="complaint-label">
              <span className="label-text">
                Calle <span className="span-required">*</span>
              </span>

              <input
                className="complaint-input"
                type="text"
                name="calle"
                value={formData.calle}
                onChange={handleChange}
              />
              {errors.calle && (
                <small className="field-error">{errors.calle}</small>
              )}
            </label>

            <label className="complaint-label">
              <span className="label-text">
                Altura <span className="span-required">*</span>
              </span>

              <input
                className="complaint-input"
                type="text"
                name="altura"
                value={formData.altura}
                onChange={handleChange}
                inputMode="numeric"
                autoComplete="off"
                aria-invalid={Boolean(errors.altura)}
                aria-describedby={errors.altura ? "error-altura" : undefined}
              />
              {errors.altura && (
                <small className="field-error">{errors.altura}</small>
              )}
            </label>
          </div>
          <div className="complaint-row-calles">
            <label className="complaint-label">
              <span className="label-text">
                Entre calle 1 <span className="span-required">*</span>
              </span>

              <input
                className="complaint-input"
                type="text"
                name="calleUno"
                value={formData.calleUno}
                onChange={handleChange}
              />
              {errors.calleUno && (
                <small className="field-error">{errors.calleUno}</small>
              )}
            </label>

            <label className="complaint-label">
              <span className="label-text">
                Entre calle 2 <span className="span-required">*</span>
              </span>

              <input
                className="complaint-input"
                type="text"
                name="calleDos"
                value={formData.calleDos}
                onChange={handleChange}
              />
              {errors.calleDos && (
                <small className="field-error">{errors.calleDos}</small>
              )}
            </label>
          </div>
          <div className="complaint-row">
            <label className="complaint-label">
              <span className="label-text">
                Localidad <span className="span-required">*</span>
              </span>
              <div className="select-wrapper">
                <select
                  className="complaint-input"
                  name="localidad"
                  value={formData.localidad}
                  onChange={handleChange}
                >
                  <option value="">Seleccioná una localidad</option>

                  <option value="alejandro-korn">Alejandro Korn</option>

                  <option value="san-vicente">San Vicente</option>

                  <option value="domselaar">Domselaar</option>
                </select>
                <span className="select-arrow" aria-hidden="true"></span>
              </div>
              {errors.localidad && (
                <small className="field-error">{errors.localidad}</small>
              )}
            </label>

            <label className="complaint-label">
              <span className="label-text">
                Código postal <span className="span-required">*</span>
              </span>

              <input
                className="complaint-input"
                type="text"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
                readOnly
              />
              {errors.codigoPostal && (
                <small className="field-error">{errors.codigoPostal}</small>
              )}
            </label>
          </div>
        </section>

        {/* IMÁGENES */}
        <section className="complaint-section">
          <h3>Imágenes</h3>

          <p className="section-description">
            Puede adjuntar hasta dos imágenes que ayuden a identificar el
            inconveniente.
          </p>

          <div
            className="complaint-images"
            ref={imagesContainerRef}
            onScroll={handleImagesScroll}
          >
            {images.map((image, index) => (
              <div className="complaint-image-container" key={index}>
                {image ? (
                  <>
                    <img
                      className="complaint-image-preview"
                      src={URL.createObjectURL(image)}
                      alt={`Imagen ${index + 1}`}
                    />

                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => handleRemoveImage(index)}
                      aria-label={`Eliminar imagen ${index + 1}`}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </>
                ) : (
                  <label className="complaint-image-upload">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => handleImageChange(index, e)}
                    />

                    <i className="bi bi-image"></i>

                    <span>Agregar imagen {index + 1}</span>

                    <small>JPG, PNG o WEBP</small>
                  </label>
                )}

                {/* ERROR DE ESTA IMAGEN */}
                {imageErrors[index] && (
                  <small className="field-error">{imageErrors[index]}</small>
                )}
              </div>
            ))}
          </div>
          <div className="image-pagination" aria-label="Paginación de imágenes">
            {images.map((_, index) => (
              <span
                key={index}
                className={`image-dot ${activeImage === index ? "active" : ""}`}
              />
            ))}
          </div>
        </section>

        {/* DETALLE */}
        <section className="complaint-section">
          <h3>Detalle del reclamo</h3>

          <p className="section-description">
            Describa brevemente el inconveniente que desea informar.
          </p>

          <label className="complaint-label">
            <span className="label-text">
              Descripción <span className="span-required">*</span>
            </span>

            <textarea
              className="complaint-input complaint-textarea"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describa el problema..."
            />
            {errors.descripcion && (
              <small className="field-error">{errors.descripcion}</small>
            )}
          </label>
        </section>

        {/* DECLARACIÓN */}
        <div className="complaint-declaration">
          <label className="declaration-label">
            <input
              type="checkbox"
              name="estadoTributario"
              checked={formData.estadoTributario}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  estadoTributario: e.target.checked,
                }));

                setErrors((prev) => ({
                  ...prev,
                  estadoTributario: "",
                }));
              }}
            />

            <span>
              <strong>En carácter de declaración jurada,</strong> declaro que al
              momento de realizar el presente reclamo, mi estado tributario se
              encuentra al día.
            </span>
          </label>
        </div>

        {status === "loading" && <p role="status">Enviando reclamo...</p>}

        {status === "success" && (
          <p role="status">¡Tu reclamo se registró correctamente!</p>
        )}

        {status === "error" && (
          <p role="alert">
            No se pudo registrar el reclamo. Revisá tu conexión e intentá
            nuevamente.
          </p>
        )}

        {/* ACCIONES */}
        <div className="complaint-actions">
          <button className="cancelar" type="button">
            Cancelar
          </button>

          <button
            className="enviar"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Enviando..." : "Enviar reclamo"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ComplaintForm;
