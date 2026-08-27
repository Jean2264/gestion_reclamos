import "./Footer.css";
import muniImage from '../../assets/escudo.png'

function Footer(){
return(
    <div className="footer">
        <div className="footer-brand">
        <div className="footer-mark">
            <img src={muniImage} alt="Escudo del Municipio de San Vicente"></img>
        </div>
        <div class="footer-brand-copy">
        <strong>Municipio de San Vicente</strong>
        <span>San Vicente · Alejandro Korn · Domselaar</span>
      </div>
        </div>
        <div className="footer-contact">
        <span>Av. Sarmiento 39, San Vicente, Buenos Aires</span>

        <span>C.P. 1865</span>

        <a href="tel:02225481101">02225 48-1101</a>

        <a href="mailto:contacto@sanvicente.gob.ar">contacto@sanvicente.gob.ar</a>
        </div>

        <div className="footermeta">
            <span>
                © Municipio de San Vicente. Todos los derechos reservados
            </span>
        </div>
    </div>
)
}

export default Footer;