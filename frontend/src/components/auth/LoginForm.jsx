import { useState } from "react";
import "./LoginForm.css";


function LoginForm({onRegister}){

    const [showPassword, setShowPassword]= useState(false);
        const [error, setError] = useState("");
     const [formData, setFormData] = useState({
            email:"",
            contasenia:""
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
    return(

        <div className="login-form">
            <span className="ciu">ACCESO CIUDADANO</span>
            <div className="login-header">
             <h1>Ingresar a Mi San Vicente</h1>
                <p>Entra con el correo que validaste y la contrasena que creaste para empezar a usar tu cuenta ciudadana.</p>
            </div>
            <form className="admin-form">
            <label className="login-label">
               <span>
                Correo electronico
               </span>

               <input className="login-input"
               name="email"
               type="email"
               autoComplete="off"
               value={formData.email}
               onChange={handleChange}
               />
            </label>

            <label className="login-label">
               <span>
                Contraseña
               </span>

              <div className="div-input">
                 <input className="input  "
               name="contrasenia"
                type={showPassword ? "text" : "password"}
               autoComplete="off"
               value={formData.contrasenia}
               onChange={handleChange}
               />

               <button
               type="text"
               className="ojo"
               onClick={()=> setShowPassword(!showPassword)}>
                <i
                             className={
                                 showPassword
                                 ? "bi bi-eye-slash"
                                 : "bi bi-eye"
                             }
                         />
               </button>

              </div>
              
            </label>
            {error && <span role="alert">{error}</span>}
            

                             

            <button className="btn-login" type="submit">Ingresar</button>
            <a className="pass" href="#">¿Olvidaste tu contraseña?</a>
            </form>

            <div className="login-actions">
                <p>No tienes cuenta?<span
                className="link-button" onClick={onRegister}>
                    registrarse
                    </span></p>
            </div>
        </div>
    )
}

export default LoginForm;