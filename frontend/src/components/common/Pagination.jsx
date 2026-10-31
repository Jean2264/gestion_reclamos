import "./Pagination.css";

function Pagination({ page, totalPages, onPageChange }) {
  // No mostrar paginación si no hay páginas suficientes.
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  // Generar los números de página visibles.
  function getPages() {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (page >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  }

  const pages = getPages();

  return (
    <nav className="pagination" aria-label="Paginación de empleados">
      {/* Página anterior */}
      <button
        type="button"
        className="pagination-arrow"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Página anterior"
        title="Página anterior"
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      {/* Números de página */}
      <div className="pagination-pages">
        {pages.map((item, index) => {
          if (item === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="pagination-dots"
                aria-hidden="true"
              >
                ···
              </span>
            );
          }

          const isActive = page === item;

          return (
            <button
              key={item}
              type="button"
              className={`pagination-page ${isActive ? "active" : ""}`}
              disabled={isActive}
              onClick={() => onPageChange(item)}
              aria-label={`Página ${item}`}
              aria-current={isActive ? "page" : undefined}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Página siguiente */}
      <button
        type="button"
        className="pagination-arrow"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Página siguiente"
        title="Página siguiente"
      >
        <i className="bi bi-chevron-right"></i>
      </button>
    </nav>
  );
}

export default Pagination;
