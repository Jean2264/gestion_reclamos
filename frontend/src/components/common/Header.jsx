import muniImage from '../../assets/escudo.png'
import "./Header.css";
import Menu from './Menu';
function Header()
{
    return(
        <header className="header">
            <div className="header-logo">
                <img className="img" src={muniImage} alt="Logo del municipio" />
            </div>

                <div className="header-menu">
                    <Menu/>
                </div>
        </header>       
        
    )
}

export default Header
