import { useContext } from "react"
import LoginForm from "./LoginForm";
import "./AuthModal.css";

function AuthModal(){

    const {
        isAuthModalOpen,
        setIsAuthModalOpen
    }= useContext();

    if(!isAuthModalOpen){
        return null;
    }

    return(
        <div className="auth-overlay">
            <div className="auth-modal">
                    <LoginForm/>
            </div>
        </div>
    )
}

export default AuthModal;