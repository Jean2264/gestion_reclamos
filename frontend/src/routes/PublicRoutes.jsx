import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default PublicRoutes;
