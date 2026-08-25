import "./RegisterForm.css";

function RegisterForm({onLogin}){
    return(
        <div className="register-form">
            <div className="register-header">
                <h1>Registrarse a Mi San Vicente</h1>
            </div>
            <form className="admin-form">
            <label className="label-text">
                <span>
                    DNI <span className="span-required">*</span>                   
                </span>
                <input
                    className="inputt field-compact"
                            name="dni"
                            type="text"
                            autoComplete="off"
                            inputMode="numeric"
                    />
            </label>       

            <label className="label-text">
                <span>
                    Nombre <span className="span-required">*</span>                   
                </span>
            <input
                    className="inputt"
                            name="nombre"
                            type="text"
                    />
            </label>
            <label>
                <span>
                    Apellido <span className="span-required">*</span>                   
                </span>

                <input
                className="inputt"
                name="apellido"
                type="text"/>

            </label>
            </form>
        </div>
    )
}

export default RegisterForm;