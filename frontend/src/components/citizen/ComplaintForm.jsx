import { useState } from "react";

import "./ComplaintForm.css";

function ComplaintForm() {
    const [formData, setFormData] = useState({
        dni: "",
        nombre: "",
        apellido: "",
        direccion: "",
        lote: "",
        descripcion: ""
    });

    const [errors, setErrors] = useState({});

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        // Si el usuario corrige el campo,
        // eliminamos el error de ese campo.
        setErrors({
            ...errors,
            [name]: ""
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        console.log("Datos del formulario:", formData);

        // Más adelante acá vamos a:
        // 1. Validar los campos.
        // 2. Mostrar errores.
        // 3. Enviar los datos al backend.
        // 4. Mostrar loading.
        // 5. Mostrar success/error.
    }

    return (
        <div className="complaint-form">

            <form onSubmit={handleSubmit}>

                <section className="complaint-header">

                    <h2>Nuevo reclamo</h2>

                    <p className="desc">
                        Complete los siguientes datos para registrar su reclamo.
                        Los campos indicados con (
                        <span className="span-required">*</span>
                        ) son obligatorios.
                    </p>

                </section>


                <section className="complaint-info">

                    {/* DNI */}
                    <label className="complaint-label">

                        <span className="label-text">
                            DNI
                            <span className="span-required">*</span>
                        </span>

                        <input
                            className="inputt field-compact"
                            name="dni"
                            type="text"
                            autoComplete="off"
                            inputMode="numeric"
                            value={formData.dni}
                            onChange={handleChange}
                        />

                        {errors.dni && (
                            <p className="input-error">
                                {errors.dni}
                            </p>
                        )}

                    </label>


                    {/* NOMBRE */}
                    <label className="complaint-label">

                        <span className="label-text">
                            Nombre
                            <span className="span-required">*</span>
                        </span>

                        <input
                            className="inputt"
                            name="nombre"
                            type="text"
                            value={formData.nombre}
                            onChange={handleChange}
                        />

                        {errors.nombre && (
                            <p className="input-error">
                                {errors.nombre}
                            </p>
                        )}

                    </label>


                    {/* APELLIDO */}
                    <label className="complaint-label">

                        <span className="label-text">
                            Apellido
                            <span className="span-required">*</span>
                        </span>

                        <input
                            className="inputt"
                            name="apellido"
                            type="text"
                            value={formData.apellido}
                            onChange={handleChange}
                        />

                        {errors.apellido && (
                            <p className="input-error">
                                {errors.apellido}
                            </p>
                        )}

                    </label>


                    {/* DIRECCIÓN */}
                    <label className="complaint-label">

                        <span className="label-text">
                            Dirección
                            <span className="span-required">*</span>
                        </span>

                        <input
                            className="inputt"
                            name="direccion"
                            type="text"
                            value={formData.direccion}
                            onChange={handleChange}
                        />

                        {errors.direccion && (
                            <p className="input-error">
                                {errors.direccion}
                            </p>
                        )}

                    </label>


                    {/* LOTE */}
                    <label className="complaint-label">

                        <span className="label-text">
                            Número de lote
                            <span className="span-required">*</span>
                        </span>

                        <input
                            className="inputt field-compact"
                            name="lote"
                            type="text"
                            value={formData.lote}
                            onChange={handleChange}
                        />

                        {errors.lote && (
                            <p className="input-error">
                                {errors.lote}
                            </p>
                        )}

                    </label>


                    {/* DESCRIPCIÓN */}
                    <label className="complaint-label">

                        <span className="label-text">
                            Descripción
                            <span className="span-required">*</span>
                        </span>

                        <textarea
                            className="inputt field-compact"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                        />

                        {errors.descripcion && (
                            <p className="input-error">
                                {errors.descripcion}
                            </p>
                        )}

                    </label>

                </section>


                {/* BOTONES */}
                <div className="complaint-actions">

                    <button
                        className="cancelar"
                        type="button"
                    >
                        Cancelar
                    </button>

                    <button
                        className="enviar"
                        type="submit"
                    >
                        Enviar reclamo
                    </button>

                </div>

            </form>

        </div>
    );
}

export default ComplaintForm;