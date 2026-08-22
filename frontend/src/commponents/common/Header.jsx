import muniImage from '../../assets/escudo.png'
import "./Header.css";
function Header()
{
    return(
        <header className="header">

        <img className="img" src={muniImage} alt="Logo del municipio" />
        {/*<h1 className="header-titulo">
            Libro de quejas
        </h1> */}

       
        </header>       
        
    )
}

export default Header
