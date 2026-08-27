import { createContext, useState } from "react";

export const AuthContext= createContext();
{/**
    // AuthProvider:
// Envuelve los componentes de la aplicación y les proporciona
// acceso a los estados y funciones relacionados con la autenticación.
// children representa todo lo que está dentro del Provider.
// value contiene la información y funciones que queremos compartir.
AuthContext = canal
AuthProvider = quien entrega la información
value = lo que entrega
children = a quién se lo entrega 

*/}
function AuthProvider({children}){
    {/**¿El modal de autenticación está abierto? 
        // isAuthModalOpen → indica si el modal de autenticación está abierto.
// setIsAuthModalOpen → permite abrirlo o cerrarlo.
// Ambos se comparten mediante AuthContext.Provider.
        */}
    const [isAuthModalOpen, setIsAuthModalOpen]= useState(false);
    return(
        <AuthContext.Provider
        value={{
            isAuthModalOpen,
            setIsAuthModalOpen
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;