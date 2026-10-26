import { createContext, useState, useEffect } from "react";
import * as usuarioService from "../services/usuario.service.js";

const ADMIN_SESSION_KEY = "admin_session_active";
const ADMIN_ROLE = "Administrador";
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

  async function iniciarSesionAdmin(dni, contrasenia) {
    const data = await usuarioService.iniciarSesionAdmin(dni, contrasenia);

    if (data.data?.usuario?.nombre_rol !== ADMIN_ROLE) {
      await usuarioService.cerrarSesion();

      throw new Error("No tenés permisos para acceder al panel.");
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
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
      const usuarioActual = respuesta.data;

      const rol = usuarioActual?.usuario?.nombre_rol;

      if (rol === ADMIN_ROLE) {
        const sesionAdministrativaActiva =
          sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";

        if (!sesionAdministrativaActiva) {
          await usuarioService.cerrarSesion();
          setUsuario(null);
          return null;
        }
      }

      setUsuario(usuarioActual);
      return usuarioActual;
    } catch (error) {
      setUsuario(null);
      throw error;
    } finally {
      setCargando(false);
    }
  }

  async function cerrarSesion() {
    try {
      await usuarioService.cerrarSesion();
    } finally {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      setUsuario(null);
    }
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
        iniciarSesionAdmin,
        registrarUsuario,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
