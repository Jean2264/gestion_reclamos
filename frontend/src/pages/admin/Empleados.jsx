import "./Empleados.css";
import DataTable from "../../components/common/DataTable";
import SearchBar from "../../components/common/SearchBar";
import EmpleadoModal from "../../components/empleado-panel/EmpleadoModal";
import { useState } from "react";

function Empleados() {
  const [isEmpleadoModalOpen, setIsEmpleadoModalOpen] = useState(false);

  function handleOpenEmpleadoModal() {
    setIsEmpleadoModalOpen(true);
  }

  function handleCloseEmpleadoModal() {
    setIsEmpleadoModalOpen(false);
  }

  return (
    <section className="empleados">
      <div className="empleados-header">
        <SearchBar placeholder="Buscar empleados" />

        <button className="primary-button" onClick={handleOpenEmpleadoModal}>
          <i className="bi bi-plus-circle"></i>
          <span>Nuevo empleado</span>
        </button>
      </div>

      <DataTable />

      {isEmpleadoModalOpen && (
        <EmpleadoModal
          title="Nuevo empleado"
          onClose={handleCloseEmpleadoModal}
        />
      )}
    </section>
  );
}

export default Empleados;
