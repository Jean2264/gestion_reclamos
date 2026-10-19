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

    // Recuperamos el usuario de la sesión recién iniciada.
    await verificarSesion();

    return data;
  }

  async function verificarSesion() {
    try {
      const respuesta = await usuarioService.obtenerUsuarioActual();

      setUsuario(respuesta.data);
      return respuesta.data;
    } catch (error) {
      setUsuario(null);
      throw error;
    } finally {
      setCargando(false);
    }
  }

  async function cerrarSesion() {
    await usuarioService.cerrarSesion();
    setUsuario(null);
  }

  useEffect(() => {
    verificarSesion().catch(() => {
      // La sesión puede no existir al abrir la aplicación.
    });
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
