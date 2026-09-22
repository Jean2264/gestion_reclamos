import Header from "../../components/common/Header";
import { useContext } from "react";

import { AuthContext } from "../../context/AuthProvider";

import "./Welcome.css";

function Welcome() {
  const { setIsAuthModalOpen, setAuthMode } = useContext(AuthContext);

  function handleLogin() {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  }

  function handleRegister() {
    setAuthMode("register");
    setIsAuthModalOpen(true);
  }
  return (
    <div className="welcome">
      <Header />

      <main className="welcome-content">
        <section className="welcome-introduction">
          <h1>Bienvenido al área de gestión de reclamos</h1>

          <p>
            Desde este espacio podrás registrar tus reclamos y realizar el
            seguimiento de su estado.
          </p>
        </section>

        <section className="complaint-areas">
          <h2>Áreas de reclamos disponibles</h2>

          <div className="complaint-areas-grid">
            <article className="complaint-area">
              <div className="complaint-area-icon">
                <i className="bi bi-lightbulb"></i>
              </div>

              <h3>Alumbrado público</h3>

              <p>
                Reportá luminarias apagadas, dañadas o con problemas de
                funcionamiento.
              </p>
            </article>

            <article className="complaint-area">
              <div className="complaint-area-icon">
                <i className="bi bi-cone-striped"></i>
              </div>

              <h3>Pavimentación</h3>

              <p>
                Informá sobre calles deterioradas, baches u otros problemas
                relacionados con la pavimentación.
              </p>
            </article>

            <article className="complaint-area">
              <div className="complaint-area-icon">
                <i className="bi bi-signpost"></i>
              </div>

              <h3>Zanjeo y abovedado</h3>

              <p>
                Reportá inconvenientes relacionados con zanjas, desagües y
                mantenimiento de calles.
              </p>
            </article>

            <article className="complaint-area">
              <div className="complaint-area-icon">
                <i className="bi bi-trash3"></i>
              </div>

              <h3>Recolección de residuos</h3>

              <p>
                Informá problemas relacionados con la recolección o acumulación
                de residuos.
              </p>
            </article>

            <article className="complaint-area">
              <div className="complaint-area-icon">
                <i className="bi bi-tree"></i>
              </div>
              <h3>Recolección de Ramas</h3>
              <p>
                Solicitá la recolección de ramas y restos de poda generados en
                la vía pública.
              </p>
            </article>

            <article className="complaint-area">
              <div className="complaint-area-icon">
                <i className="bi bi-flower1"></i>
              </div>
              <h3>Poda de Arbustos</h3>
              <p>
                Informá sobre arbustos que requieran poda o mantenimiento en
                espacios públicos.
              </p>
            </article>
          </div>
        </section>

        <section className="welcome-access">
          <div className="welcome-access-content">
            <h2>¿Contás con un ID ciudadano?</h2>

            <p>
              Para poder registrar un reclamo necesitás contar con un ID
              ciudadano.
            </p>

            <div className="welcome-actions">
              <button type="button" onClick={handleLogin}>
                Cuento con ID ciudadano
              </button>

              <button type="button" onClick={handleRegister}>
                Crear mi ID ciudadano
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Welcome;
