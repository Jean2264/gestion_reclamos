import { useContext } from "react";

import { AuthContext } from "../../context/AuthProvider";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

import BtnClose from "../common/BtnClose";

import "./AuthModal.css";

function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode } =
    useContext(AuthContext);

  // Si el modal esta cerrado no renderizamos nada
  if (!isAuthModalOpen) {
    return null;
  }

  function handleClose() {
    setAuthMode("login");
    setIsAuthModalOpen(false);
  }

  return (
    <div className="auth-overlay">
      <div
        className={`auth-modal ${authMode === "register" ? "fullscreen" : ""}`}
      >
        <BtnClose onClick={handleClose} />

        <div className="auth-modal-container">
          {authMode === "login" && (
            <LoginForm onRegister={() => setAuthMode("register")} />
          )}

          {authMode === "register" && (
            <RegisterForm onLogin={() => setAuthMode("login")} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
