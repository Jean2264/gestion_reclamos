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
                        Complete los siguientes datos para registrar su reclamo. Los campos indicados con (*) son obligatorios.
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
                </section>

                <div className="complaint-actions">

                </div>
            </form>
        </div>
    )
}


export default ComplaintForm;