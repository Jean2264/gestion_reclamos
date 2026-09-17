import { Outlet } from "react-router-dom";
import "./PanelLayout.css";
import AdminSidebar from "../admin/AdminSidebar";

function PanelLayout() {
  return (
    <div className="panel-layout">
      <AdminSidebar />

      <main className="panel-layout-main">
        <div className="panel-layout-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default PanelLayout;
