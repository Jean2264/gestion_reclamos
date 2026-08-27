import muniImage from '../../assets/escudo.png'
import "./Header.css";
import Menu from './Menu';
import UserButton from '../user/UserButton';
function Header()
{
    return(
        <header className="header">
            <div className="header-logo">
                <img className="img" src={muniImage} alt="Logo dl municipio" />
            </div>

                <div className="header-menu">
                    <UserButton/>
                </div>
        </header>       
        
    )
}

export default Header
