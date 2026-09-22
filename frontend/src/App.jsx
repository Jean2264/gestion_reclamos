import { useState } from "react";
import Home from "./pages/public/Home";
import AuthModal from "./components/auth/AuthModal";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import "./styles/global.css";

function App() {
  return (
    <>
      <PublicRoutes />
      <AdminRoutes />
      <AuthModal />
    </>
  );
}

export default App;
