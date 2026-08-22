import ComplaintForm from "../../components/citizen/ComplaintForm";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import "./Home.css";

function Home(){
    return(
        <div className="home">
            {/**Aca va a ir el header */}
            <Header/>
            
            <section className="home-description">
                <h1>
                    Registro de reclamo de ciudadano
                </h1>
                <p>Completá la información solicitada para registrar tu reclamo. Una vez enviado, recibirás un número de reclamo que podrás utilizar para consultar su estado y realizar el seguimiento.</p>
                   
                    <p>Los reclamos realizados por la comunidad nos permiten conocer las necesidades de los vecinos y orientar las acciones del Municipio para mejorar los servicios y la atención brindada.</p>
            </section>
            <section className="home-container">
            {/**Si es necesario vamos a usar section */}
            
            <ComplaintForm/>
            </section>

           <section className="home-footer">
             {/**Aca va a ir el footer */}
            <Footer/>
           </section>
        </div>
    )
}

export default Home;