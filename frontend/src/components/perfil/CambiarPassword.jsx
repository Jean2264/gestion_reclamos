import { useState } from "react";

import "./CambiarPassword.css";

function CambiarPassword({ onClose }) {
  const [paso, setPaso] = useState("verificar");
  const [codigo, setCodigo] = useState("");

  const handleVerificarCodigo = (e) => {
    e.preventDefaut();

    console.log("Codigo ingresado: ", codigo);

    return (
      <div className="password-modal-verlay">
        <section
          className="password-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="password-modal-title"
        >
          <button type="button" className="password-modal-close"></button>
        </section>
      </div>
    );
  };
}
