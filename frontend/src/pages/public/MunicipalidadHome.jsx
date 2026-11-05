import { Link } from "react-router-dom";
import muniImage from "../../assets/muni.png";
import "./MunicipalidadHome.css";

const redes = [
  { label: "X (Twitter)", icon: "bi-twitter-x" },
  { label: "Instagram", icon: "bi-instagram" },
  { label: "Facebook", icon: "bi-facebook" },
  { label: "YouTube", icon: "bi-youtube" },
];

const secciones = ["Turismo", "Tasas", "Tierras", "Policía", "Zoonosis", "Congreso", "Emprende", "Trámites"];

function MunicipalidadHome() {
  return (
    <div className="municipal-home">
      <header className="municipal-header">
        <div className="municipal-header-inner">
          <div className="municipal-socials" aria-label="Redes sociales">
            {redes.map(({ label, icon }) => (
              <a key={label} href="#" aria-label={label} title={label}>
                <i className={`bi ${icon}`} aria-hidden="true" />
              </a>
            ))}
          </div>
          <div className="municipal-nav-row">
            <Link className="municipal-brand" to="/" aria-label="Municipalidad de San Vicente, inicio">
              <img src={muniImage} alt="Municipalidad de San Vicente" />
            </Link>
            <nav className="municipal-nav" aria-label="Navegación principal">
              <a href="#municipio">Municipio</a>
              <a href="#areas">Áreas de gestión</a>
              <a href="#tramites">Trámites</a>
              <a href="#agenda">Agenda</a>
              <a href="#turismo">Turismo</a>
              <a href="#gobierno-abierto">Gobierno abierto</a>
              <Link className="municipal-claims-button" to="/welcome">Reclamos</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="municipal-main">
        <section className="municipal-hero" aria-labelledby="municipal-hero-title">
          <div className="municipal-hero-decoration municipal-circle-one" />
          <div className="municipal-hero-decoration municipal-circle-two" />
          <div className="municipal-hero-decoration municipal-circle-three" />
          <div className="municipal-hero-content">
            <div className="municipal-hero-copy">
              <span className="municipal-eyebrow">Instituto de Formación Policial</span>
              <h1 id="municipal-hero-title">Sumate a la Policía de San Vicente</h1>
              <p>Inscripciones abiertas para la Diplomatura en Prevención y Seguridad Ciudadana del Instituto de Formación Policial San Vicente.</p>
            </div>
            <div className="municipal-hero-cards">
              <article className="municipal-program-card">
                <span className="municipal-badge">Inscripciones abiertas 2027</span>
                <h2>Instituto de Formación Policial San Vicente</h2>
                <p>Descargá la planilla o completá la preinscripción online con validación por correo electrónico.</p>
              </article>
              <article className="municipal-float-card municipal-requirements">
                <span className="municipal-badge">Requisitos</span>
                <p>18 a 32 años y secundario completo</p>
              </article>
              <article className="municipal-float-card municipal-info">
                <span className="municipal-badge">Ver info</span>
                <p>Conocé el programa y cómo inscribirte</p>
              </article>
            </div>
          </div>
          <nav className="municipal-subnav" aria-label="Accesos municipales">
            {secciones.map((seccion) => (
              <a key={seccion} className={seccion === "Policía" ? "active" : ""} href="#">
                {seccion}
              </a>
            ))}
          </nav>
        </section>
      </main>

      <footer className="municipal-footer">
        <p>© 2026 Municipalidad de San Vicente. Todos los derechos reservados.</p>
        <nav aria-label="Información legal">
          <a href="#contacto">Contacto</a>
          <a href="#terminos">Términos y Condiciones</a>
          <a href="#privacidad">Privacidad</a>
        </nav>
      </footer>
    </div>
  );
}

export default MunicipalidadHome;
