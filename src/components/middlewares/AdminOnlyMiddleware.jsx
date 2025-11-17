import { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";

const AdminOnlyMiddleware = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin/auth/login");
    }
  }, [user]);

  return <>{children}</>;
};

export default AdminOnlyMiddleware;
