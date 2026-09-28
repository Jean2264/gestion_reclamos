import { useState } from "react";
import "./NuevoReclamo.css";

function NuevoReclamo() {
  return (
    <div className="nuevo-reclamo">
      <header className="nuevo-reclamo-header">
        <h1>Nuevo reclamo</h1>
        <p>Completá la información del reclamo.</p>
      </header>

      <form className="nuevo-reclamo-form">
        <section className="nuevo-reclamo-section">
          <h2>Información personal del ciudadano</h2>

          <label className="ciudadano-label">
            <span>
              DNI
              <span className="span-required">*</span>
            </span>

            <input
              className="ciudadano-input"
              name="dni"
              type="text"
              autoComplete="off"
            />
          </label>
        </section>

        <section className="nuevo-reclamo-section">
          <h2>Área del reclamo</h2>

          <select id="complaint-area">
            <option value="alumbrado">Alumbrado Público / Luminaria</option>

            <option value="pavimentacion">Pavimentación</option>

            <option value="zanjeo">Abovedado con Zanjeo</option>

            <option value="residuos">Recolección de Residuos</option>

            <option value="ramas">Recolección de Ramas</option>

            <option value="arbustos">Poda de Arbustos</option>
          </select>
        </section>

        <section className="nuevo-reclamo-section">
          <h2>Detalles del reclamo</h2>

          <div className="ciudadano-modal-row">
            <label className="ciudadano-label">
              <span>
                Calle
                <span className="span-required">*</span>
              </span>

              <input
                className="ciudadano-input"
                name="calle"
                type="text"
                autoComplete="off"
              />
            </label>

            <label className="ciudadano-label">
              <span>
                Altura
                <span className="span-required">*</span>
              </span>

              <input
                className="ciudadano-input"
                name="numero"
                type="text"
                autoComplete="off"
              />
            </label>
          </div>

          <div className="ciudadano-modal-row">
            <label className="ciudadano-label">
              <span>
                Localidad
                <span className="span-required">*</span>
              </span>

              <select className="ciudadano-input" name="localidad">
                <option value="">Seleccioná una localidad</option>
                <option value="alejandro-korn">Alejandro Korn</option>
                <option value="san-vicente">San Vicente</option>
                <option value="domselaar">Domselaar</option>
              </select>
            </label>

            <label className="ciudadano-label">
              <span>
                Código postal
                <span className="span-required">*</span>
              </span>

              <input
                className="ciudadano-input"
                name="codigoPostal"
                type="text"
                autoComplete="off"
              />
            </label>
          </div>

          <label className="ciudadano-label">
            <span>
              Descripción
              <span className="span-required">*</span>
            </span>

            <textarea className="ciudadano-input" name="descripcion" />
          </label>
        </section>
      </form>
      <div className="nuevo-reclamo-actions">
        <button type="submit" form="nuevo-reclamo-form">
          Cargar reclamo
        </button>
      </div>
    </div>
  );
}
export default NuevoReclamo;
