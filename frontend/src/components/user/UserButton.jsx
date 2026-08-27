import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import "./UserButton.css";

function UserButton(){
    const{
        setIsAuthModalOpen
    }= useContext(AuthContext);

    return(
        <button className="btn-user" onClick={()=> setIsAuthModalOpen(true)}>
            Acceder
        </button>
    );
}

export default UserButton;