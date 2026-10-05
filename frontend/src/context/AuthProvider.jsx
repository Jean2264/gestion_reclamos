import { createContext, useState, useEffect } from "react";
import * as usuarioService from "../services/usuario.service.js";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  // Estado del modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  // Estado de autenticación
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function iniciarSesion(email, contrasenia) {
    const data = await usuarioService.iniciarSesion(email, contrasenia);

    setUsuario(data.data);

    return data;
  }
  async function registrarUsuario(datosRegistro) {
    const data = await usuarioService.registrarUsuario(datosRegistro);

    setUsuario(data.data);

    return data;
  }

  async function verificarSesion() {
    try {
      const data = await usuarioService.obtenerUsuarioActual();
      console.log("DATOS DEL USUARIO:", data);
      setUsuario(data.data);
    } catch (error) {
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }

  async function cerrarSesion() {
    await usuarioService.cerrarSesion();

    setUsuario(null);
  }

  useEffect(() => {
    verificarSesion();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        // Modal
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,

        // Autenticación
        usuario,
        cargando,
        iniciarSesion,
        registrarUsuario,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
