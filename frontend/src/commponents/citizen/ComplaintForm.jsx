import { useState,useEffect } from "react";
import "./ComplaintForm.css";

function ComplaintForm(){

const [formData, setFormData]= useState({
    dni:"",
    nombre:"",
    apellido:"",
    direccion:"",
    lote:"",
    descripcion:""
});

const [errors, setErrors]= useState({});

    return(
        <div className="complaint-form">
            <form>
                <section className="complaint-header">
                    <h2>Nuevo reclamo</h2>

                    <p className="desc">
                        Complete los siguientes datos para registrar su reclamo. Los campos indicados con (<span className="span-required">*</span>) son obligatorios.
                    </p>

                </section>

                <section className="complaint-info">

                    <label>
                        <span className="label-text">
                        DNI 
                        <span className="span-required">*</span>
                        <input className="inputt"
                        name="dni"
                        value={formData.dni}
                        />
                        {errors.dni && <p className="input-error">{errors.dni}</p>}
                        </span>
                    </label>

                    <label>
                        <span className="label-text">
                        Nombre
                        <span className="span-required">*</span>
                        <input className="inputt"
                        name="nombre"
                        value={formData.nombre}
                        />
                        {errors.nombre && <p className="input-error">{errors.nombre}</p>}
                        </span>
                    </label>

                    <label>
                        <span className="label-text">
                        Apellido
                        <span className="span-required">*</span>
                        <input className="inputt"
                        name="apellido"
                        value={formData.dni}
                        />
                        {errors.dni && <p className="input-error">{errors.dni}</p>}
                        </span>
                    </label>
                    <label>
                        <span className="label-text">
                        Direccion
                        <span className="span-required">*</span>
                        <input className="inputt"
                        name="direccion"
                        value={formData.direccion}
                        />
                        {errors.direccion && <p className="input-error">{errors.direccion}</p>}
                        </span>
                    </label>

                    <label>
                        <span className="label-text">
                        Numero de lote
                        <span className="span-required">*</span>
                        <input className="inputt"
                        name="lote"
                        value={formData.lote}
                        />
                        {errors.lote && <p className="input-error">{errors.lote}</p>}
                        </span>
                    </label>

                    <label>
                        <span className="label-text">
                        Descripcion
                        <span className="span-required">*</span>
                        <textarea className="inputt"
                        name=""
                        value={formData.descripcion}
                        />
                        {errors.descripcion && <p className="input-error">{errors.descripcion}</p>}
                        </span>
                    </label>
                </section>

                <div className="complaint-actions">
                    <button
                    className="cancelar"
                    type="button"
                    >
                        cancelar
                    </button>
                    <button
                    className="enviar"
                    type="button"
                    >
                       Enviar reclamo
                    </button>
                </div>
            </form>
        </div>
    )
}


export default ComplaintForm;