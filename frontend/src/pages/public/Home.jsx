import ComplaintForm from "../../components/citizen/ComplaintForm";
import Header from "../../components/common/Header";
import "./Home.css";

function Home(){
    return(
        <div className="home">
            {/**Aca va a ir el header */}
            <Header/>
            <main className="home-container">
            {/**Si es necesario vamos a usar section */}
            <section className="home-description">
            <h1>
                Registro de reclamos de ciudadano
            </h1>
            </section>
            <ComplaintForm/>
            </main>
p
            {/**Aca va a ir el footer */}
        </div>
    )
}

export default Home;