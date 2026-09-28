import { useContext } from "react";

import { AuthContext } from "../../context/AuthProvider";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

import BtnClose from "../common/BtnClose";

import "./AuthModal.css";

function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode } =
    useContext(AuthContext);

  if (!isAuthModalOpen) {
    return null;
  }

  function handleClose() {
    setAuthMode("login");
    setIsAuthModalOpen(false);
  }

  return (
    <div className="auth-overlay">
      <div className={`auth-modal ${authMode}`}>
        <BtnClose onClick={handleClose} />

        {authMode === "login" && (
          <LoginForm onRegister={() => setAuthMode("register")} />
        )}

        {authMode === "register" && (
          <RegisterForm onLogin={() => setAuthMode("login")} />
        )}
      </div>
    </div>
  );
}

export default AuthModal;
