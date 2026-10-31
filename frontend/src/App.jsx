import { useLocation } from "react-router-dom";

import AuthModal from "./components/auth/AuthModal";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";

import "./styles/global.css";

function App() {
  const location = useLocation();

  const esRutaAdmin =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login-admin";

  return (
    <>
      {esRutaAdmin ? <AdminRoutes /> : <PublicRoutes />}

      <AuthModal />
    </>
  );
}

export default App;
