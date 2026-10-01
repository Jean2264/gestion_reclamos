import { useState } from "react";
import "./ComplaintForm.css";

function ComplaintForm() {
  const [formData, setFormData] = useState({
    area: "",
    calle: "",
    altura: "",
    localidad: "",
    codigoPostal: "",
    numeroPartida: "",
    descripcion: "",
  });

  const [images, setImages] = useState([null, null]);

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  }

  function handleImageChange(index, e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = file;
      return newImages;
    });

    // Permite volver a seleccionar el mismo archivo
    e.target.value = "";
  }

  function handleRemoveImage(index) {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = null;
      return newImages;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log("Datos del formulario:", formData);
    console.log("Imágenes:", images);

    // Más adelante:
    // - validación
    // - envío al backend
    // - FormData
    // - loading
    // - mensaje de éxito
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

            <input
              className="complaint-input"
              type="text"
              name="numeroPartida"
              value={formData.numeroPartida}
              onChange={handleChange}
            />
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

            <select
              className="complaint-input"
              name="area"
              value={formData.area}
              onChange={handleChange}
            >
              <option value="">Seleccione un área</option>
              <option value="alumbrado">Alumbrado Público / Luminaria</option>
              <option value="pavimentacion">Pavimentación</option>
              <option value="abovedado">Abovedado con Zanjeo</option>
              <option value="residuos">Recolección de Residuos</option>
              <option value="ramas">Recolección de Ramas</option>
              <option value="poda">Poda de Arbustos</option>
              <option value="otros">Otros...</option>
            </select>
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
              />
            </label>
          </div>

          <div className="complaint-row">
            <label className="complaint-label">
              <span className="label-text">
                Localidad <span className="span-required">*</span>
              </span>

              <select
                className="complaint-input"
                name="localidad"
                value={formData.localidad}
                onChange={handleChange}
              >
                <option value="">Seleccione una localidad</option>
                <option value="localidad1">Localidad 1</option>
                <option value="localidad2">Localidad 2</option>
                <option value="localidad3">Localidad 3</option>
              </select>
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
              />
            </label>
          </div>

          <div className="complaint-row">
            <label className="complaint-label">
              <span className="label-text">
                Entre calle 1 <span className="span-required">*</span>
              </span>

              <input
                className="complaint-input"
                type="text"
                name="calle"
                value={formData.calle}
                onChange={handleChange}
              />
            </label>

            <label className="complaint-label">
              <span className="label-text">
                Entre calle 2 <span className="span-required">*</span>
              </span>

              <input
                className="complaint-input"
                type="text"
                name="altura"
                value={formData.altura}
                onChange={handleChange}
              />
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

          <div className="complaint-images">
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
              </div>
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
          </label>
        </section>

        {/* DECLARACIÓN */}
        <div className="complaint-declaration">
          <label className="declaration-label">
            <input type="checkbox" />

            <span>
              Declaro que la información proporcionada es verdadera y
              corresponde al reclamo que deseo realizar.
            </span>
          </label>
          <label className="declaration-label">
            <input type="checkbox" />

            <span>Declaro que mi estado tributario es al día.</span>
          </label>
        </div>

        {/* ACCIONES */}
        <div className="complaint-actions">
          <button className="cancelar" type="button">
            Cancelar
          </button>

          <button className="enviar" type="submit">
            Enviar reclamo
          </button>
        </div>
      </form>
    </div>
  );
}

export default ComplaintForm;
