import "./Empleados.css";
import DataTable from "../../components/common/DataTable";
import SearchBar from "../../components/common/SearchBar";
import EmpleadoModal from "../../components/empleado-panel/EmpleadoModal";
import * as empleadoService from "../../services/empleado.service.js";
import { useState } from "react";

function Empleados() {
  const [isEmpleadoModalOpen, setIsEmpleadoModalOpen] = useState(false);

  function handleOpenEmpleadoModal() {
    setIsEmpleadoModalOpen(true);
  }

  function handleCloseEmpleadoModal() {
    setIsEmpleadoModalOpen(false);
  }

  async function handleCrearEmpleado(datosEmpleado) {
    const empleadoCreado = await empleadoService.crearEmpleado(datosEmpleado);

    // Devolver el resultado para que el componente padre
    // pueda actualizar la tabla.
    return empleadoCreado;
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
          onSave={handleCrearEmpleado}
        />
      )}
    </section>
  );
}

export default Empleados;
