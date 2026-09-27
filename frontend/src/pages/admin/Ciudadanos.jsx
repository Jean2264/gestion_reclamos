import "./Ciudadanos.css";
import DataTable from "../../components/common/DataTable";
import SearchBar from "../../components/common/SearchBar";
import { useState } from "react";
import CiudadanoModal from "../../components/ciudadano-panel/CiudadanoModal";

function Ciudadanos() {
  const [isCiudadanoModalOpen, setIsCiudadanoModalOpen] = useState(false);

  function handleOpenCiudadanoModal() {
    setIsCiudadanoModalOpen(true);
  }

  function handleCloseCiudadanoModal() {
    setIsCiudadanoModalOpen(false);
  }

  return (
    <section className="ciudadanos">
      <div className="empleados-header">
        <SearchBar placeholder="Buscar ciudadanos" />
        <button className="primary-button" onClick={handleOpenCiudadanoModal}>
          <i className="bi bi-plus-circle"></i>
          <span>Nuevo ciudadano</span>
        </button>
      </div>

      <DataTable />

      {isCiudadanoModalOpen && (
        <CiudadanoModal onClose={handleCloseCiudadanoModal} />
      )}
    </section>
  );
}

export default Ciudadanos;
