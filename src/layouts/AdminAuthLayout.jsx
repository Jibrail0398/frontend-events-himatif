import { Outlet } from "react-router";
import "../style/LoginPage.css";

const AdminAuthLayout = () => {
  return (
    <div className="auth-layout-split">
      <Outlet />
    </div>
  );
};

export default AdminAuthLayout;
