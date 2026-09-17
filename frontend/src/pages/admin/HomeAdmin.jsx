import { useState } from "react";

import ReclamoCard from "../../components/admin/ReclamoCard";
import DataTable from "../../components/common/DataTable";
import SearchBar from "../../components/common/SearchBar";
import ComplaintModal from "../../components/admin/ComplaintModal";

import "./HomeAdmin.css";

const reclamosIniciales = [
  {
    idreclamo: 1,
    codigo: "REC-001",
    asunto: "Luminaria apagada",
    ciudadano: "Juan Pérez",
    estado: "entrante",
  },
  {
    idreclamo: 2,
    codigo: "REC-002",
    asunto: "Calle en mal estado",
    ciudadano: "María Gómez",
    estado: "revision",
  },
  {
    idreclamo: 3,
    codigo: "REC-003",
    asunto: "Pérdida de agua",
    ciudadano: "Carlos López",
    estado: "proceso",
  },
  {
    idreclamo: 4,
    codigo: "REC-004",
    asunto: "Recolección de residuos",
    ciudadano: "Ana Martínez",
    estado: "finalizado",
  },
  {
    idreclamo: 5,
    codigo: "REC-005",
    asunto: "Animal abandonado",
    ciudadano: "Pedro Rodríguez",
    estado: "cancelado",
  },
];

function HomeAdmin() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [reclamos] = useState(reclamosIniciales);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  const reclamosFiltrados = reclamos.filter((reclamo) => {
    const coincideEstado = !selectedStatus || reclamo.estado === selectedStatus;

    const textoBusqueda = search.toLowerCase();

    const coincideBusqueda =
      reclamo.codigo.toLowerCase().includes(textoBusqueda) ||
      reclamo.asunto.toLowerCase().includes(textoBusqueda) ||
      reclamo.ciudadano.toLowerCase().includes(textoBusqueda);

    return coincideEstado && coincideBusqueda;
  });

  function handleViewDetails(status) {
    setSelectedStatus(status);
  }

  function handleShowAll() {
    setSelectedStatus("");
  }

  function handleInspectComplaint(reclamo) {
    setSelectedComplaint(reclamo);
    setIsComplaintModalOpen(true);
  }

  function handleCloseComplaintModal() {
    setSelectedComplaint(null);
    setIsComplaintModalOpen(false);
  }

  const reclamoColumns = [
    {
      header: "Código",
      accessor: "codigo",
    },
    {
      header: "Asunto",
      accessor: "asunto",
    },
    {
      header: "Ciudadano",
      accessor: "ciudadano",
    },
    {
      header: "Estado",
      accessor: "estado",
      render: (reclamo) => {
        const estados = {
          entrante: "Entrante",
          revision: "En revisión",
          proceso: "En proceso",
          finalizado: "Finalizado",
          cancelado: "Cancelado",
        };

        return estados[reclamo.estado] || reclamo.estado;
      },
    },
    {
      header: "Acciones",
      accessor: "acciones",
      render: (reclamo) => (
        <button type="button" onClick={() => handleInspectComplaint(reclamo)}>
          Inspeccionar
        </button>
      ),
    },
  ];

  return (
    <div className="home-admin">
      <section className="home-admin-cards">
        <ReclamoCard
          title="Reclamos entrantes"
          description="Nuevos reclamos que todavía no fueron revisados."
          count={12}
          icon="bi bi-inbox"
          onViewDetails={() => handleViewDetails("entrante")}
        />

        <ReclamoCard
          title="Reclamos en revisión"
          description="Reclamos que están siendo analizados por el municipio."
          count={8}
          icon="bi bi-search"
          onViewDetails={() => handleViewDetails("revision")}
        />

        <ReclamoCard
          title="Reclamos en proceso"
          description="Reclamos que ya fueron asignados y están siendo gestionados."
          count={5}
          icon="bi bi-hourglass-split"
          onViewDetails={() => handleViewDetails("proceso")}
        />
      </section>

      <section className="home-admin-search">
        <div className="home-admin-search-header">
          <h2>
            {selectedStatus ? `Reclamos ${selectedStatus}` : "Buscar reclamos"}
          </h2>

          {selectedStatus && (
            <button type="button" onClick={handleShowAll}>
              Mostrar todos
            </button>
          )}
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por código, asunto o ciudadano..."
        />
      </section>

      <DataTable
        columns={reclamoColumns}
        data={reclamosFiltrados}
        rowKey="idreclamo"
      />

      {isComplaintModalOpen && (
        <ComplaintModal
          reclamo={selectedComplaint}
          onClose={handleCloseComplaintModal}
        />
      )}
    </div>
  );
}

export default HomeAdmin;
