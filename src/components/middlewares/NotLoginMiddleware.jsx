import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";

const NotLoginMiddleware = ({ children }) => {
    const { user, token, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (user || token) {
                navigate("/admin");
            }
        }
    }, [loading, user, token]);
    return <>{children}</>;
};

export default NotLoginMiddleware;
