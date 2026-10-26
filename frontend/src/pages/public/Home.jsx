import { useState } from "react";
import ComplaintForm from "../../components/citizen/ComplaintForm";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import "./Home.css";

function Home() {
  const [mostrarResultado, setMostrarResultado] = useState(false);

  return (
    <div className="home">
      {!mostrarResultado && (
        <>
          <Header />

          <section className="home-description">
            <h1>Registro de reclamo de ciudadano</h1>

            <p>
              Completá la información solicitada para registrar tu reclamo. Una
              vez enviado, recibirás un número de reclamo que podrás utilizar
              para consultar su estado y realizar el seguimiento.
            </p>

            <p>
              Los reclamos realizados por la comunidad nos permiten conocer las
              necesidades de los vecinos y orientar las acciones del Municipio
              para mejorar los servicios y la atención brindada.
            </p>
          </section>
        </>
      )}

      <section className="home-container">
        <ComplaintForm onMostrarResultado={setMostrarResultado} />
      </section>

      {!mostrarResultado && (
        <section className="home-footer">
          <Footer />
        </section>
      )}
    </div>
  );
}

export default Home;
