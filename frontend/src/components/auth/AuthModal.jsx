import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import LoginForm from "./LoginForm";
import BtnClose from "../common/BtnClose";
import RegisterForm from "./RegisterForm";
import "./AuthModal.css";

function AuthModal() {
  {
    /**"Quiero acceder a la información que AuthProvider está compartiendo." 
    // useContext permite acceder a los estados y funciones
// proporcionados por AuthProvider mediante AuthContext.
    */
  }
  const { isAuthModalOpen, setIsAuthModalOpen } = useContext(AuthContext);
  const [mode, setMode] = useState("login");

  //// Si el modal está cerrado, no renderizamos nada.
  if (!isAuthModalOpen) {
    return null;
  }

  function handleClose() {
    setMode("login");
    setIsAuthModalOpen(false);
  }
  return (
    <div className="auth-overlay">
      <div className={`auth-modal ${mode === "register" ? "fullscreen" : ""}`}>
        <BtnClose onClick={handleClose} />

        <div className="auth-modal-container">
          {mode === "login" && (
            <LoginForm onRegister={() => setMode("register")} />
          )}

          {mode === "register" && (
            <RegisterForm onLogin={() => setMode("login")} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
