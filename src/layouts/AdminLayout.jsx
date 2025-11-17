import { Outlet } from "react-router";
import { useExternalScripts } from "../hooks/useExternalScripts";
import SidebarAdmin from "../components/SidebarAdmin";
import TopbarAdmin from "../components/TopbarAdmin";
import FooterAdmin from "../components/FooterAdmin";
import { useState } from "react";

const AdminLayout = ({ children }) => {
    useExternalScripts(["/vendor/chart.js/Chart.min.js", "/js/demo/chart-area-demo.js", "/js/demo/chart-pie-demo.js"], "body");

    const [showSidebar, setShowSidebar] = useState(true);

    const handleSidebarToggle = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <div id="page-top">
            {/* Page Wrapper */}
            <div id="wrapper">
                <SidebarAdmin show={showSidebar} />

                {/* Content Wrapper */}
                <div id="content-wrapper" className="d-flex flex-column">
                    {/* Main Content */}
                    <div id="content">
                        <TopbarAdmin handleSidebarToggle={handleSidebarToggle} />

                        <div className="container-fluid">
                            <Outlet />
                            {children}
                        </div>

                        <FooterAdmin />
                    </div>
                    {/* End of Main Content */}
                </div>
                {/* End of Content Wrapper */}
            </div>
            {/* End of Page Wrapper */}
        </div>
    );
};

export default AdminLayout;
