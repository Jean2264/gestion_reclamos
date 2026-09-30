import { useState } from "react";
import { useLocation } from "react-router-dom";

import muniImage from "../../assets/escudo.png";
import CitizenPanel from "../citizen/citizenPanel";

import "./Header.css";

function Header() {
  const location = useLocation();

  const [isCitizenPanelOpen, setIsCitizenPanelOpen] = useState(false);

  const isHome = location.pathname !== "/" && "/admin";

  function handleOpenCitizenPanel() {
    setIsCitizenPanelOpen(true);
  }

  function handleCloseCitizenPanel() {
    setIsCitizenPanelOpen(false);
  }

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <img className="img" src={muniImage} alt="Logo del municipio" />
        </div>

        {isHome && (
          <div className="header-menu">
            <button
              type="button"
              className="menu-button"
              onClick={handleOpenCitizenPanel}
              aria-label="Abrir menú"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        )}
      </header>

      {isCitizenPanelOpen && (
        <CitizenPanel
          isOpen={isCitizenPanelOpen}
          onClose={handleCloseCitizenPanel}
        />
      )}
    </>
  );
}

export default Header;
