import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Welcome from "../pages/public/Welcome";

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default PublicRoutes;
