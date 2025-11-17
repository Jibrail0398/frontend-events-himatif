import { useLocation, useNavigate } from "react-router";
import { useLocalStorage } from "react-use";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import { useCallback, useEffect, useState } from "react";

const TopbarAdmin = ({ handleSidebarToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [tema, setTema] = useState("bg-primary");

    // Fungsi untuk mendapatkan tema acak
    const randomTheme = useCallback(() => {
        const colors = ["bg-primary", "bg-secondary", "bg-success", "bg-danger", "bg-warning", "bg-info", "bg-dark"];
        return colors[Math.floor(Math.random() * colors.length)];
    }, []);

    const handleLogout = async () => {
        const response = await Swal.fire({
            title: "Logout",
            text: "Apakah anda yakin ingin logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Logout",
            cancelButtonText: "Batal",
        });

        const confirm = response.isConfirmed;

        if (!confirm) return;

        logout();
        
    };

    useEffect(() => {
        setTema(randomTheme());
    }, [location.pathname]);

    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            {/* Sidebar Toggle (Topbar) */}
            <button id="sidebarToggleTop" className="btn btn-link rounded-circle mr-3" onClick={handleSidebarToggle}>
                <i className="fa fa-bars" />
            </button>

            {/* Topbar Navbar */}
            <ul className="navbar-nav ml-auto">
                {/* Nav Item - Alerts */}
                <li className="nav-item dropdown no-arrow mx-1">
                    <a className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-bell fa-fw" />
                        {/* Counter - Alerts */}
                        <span className="badge badge-danger badge-counter">3+</span>
                    </a>
                    {/* Dropdown - Alerts */}
                    <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="alertsDropdown">
                        <h6 className="dropdown-header">Alerts Center</h6>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                            <div className="mr-3">
                                <div className="icon-circle bg-primary">
                                    <i className="fas fa-file-alt text-white" />
                                </div>
                            </div>
                            <div>
                                <div className="small text-gray-500">December 12, 2019</div>
                                <span className="font-weight-bold">A new monthly report is ready to download!</span>
                            </div>
                        </a>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                            <div className="mr-3">
                                <div className="icon-circle bg-success">
                                    <i className="fas fa-donate text-white" />
                                </div>
                            </div>
                            <div>
                                <div className="small text-gray-500">December 7, 2019</div>
                                $290.29 has been deposited into your account!
                            </div>
                        </a>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                            <div className="mr-3">
                                <div className="icon-circle bg-warning">
                                    <i className="fas fa-exclamation-triangle text-white" />
                                </div>
                            </div>
                            <div>
                                <div className="small text-gray-500">December 2, 2019</div>
                                Spending Alert: We've noticed unusually high spending for your account.
                            </div>
                        </a>
                        <a className="dropdown-item text-center small text-gray-500" href="#">
                            Show All Alerts
                        </a>
                    </div>
                </li>

                <div className="topbar-divider d-none d-sm-block" />
                {/* Nav Item - User Information */}
                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">{user?.name}</span>

                        {/* Inisial */}
                        <div className={`rounded-circle ${tema} text-white d-flex justify-content-center align-items-center`} style={{ width: "35px", height: "35px" }}>
                            {user?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </div>
                    </a>
                    {/* Dropdown - User Information */}
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                        <a className="dropdown-item" href="#">
                            <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" />
                            Profile
                        </a>
                        <a className="dropdown-item" href="#">
                            <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400" />
                            Settings
                        </a>
                        <a className="dropdown-item" href="#">
                            <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400" />
                            Activity Log
                        </a>
                        <div className="dropdown-divider" />
                        <a className="dropdown-item" data-toggle="modal" data-target="#logoutModal" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                            Logout
                        </a>
                    </div>
                </li>
            </ul>
        </nav>
    );
};

export default TopbarAdmin;
