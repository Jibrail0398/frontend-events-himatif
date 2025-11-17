import { useState, useRef, useEffect } from "react";
import { FaSearch, FaBell, FaEnvelope, FaBars } from "react-icons/fa";

export default function AdminHeader({ onToggleSidebar }) {
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const dropdownRef = useRef(null);

    // Tutup kalau klik di luar
    useEffect(() => {
        function handleClickOutside(e) {
        if (
            showMobileSearch &&
            dropdownRef.current &&
            !dropdownRef.current.contains(e.target)
        ) {
            setShowMobileSearch(false);
        }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMobileSearch]);

    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
        {/* Hamburger (mobile only) */}
        <button
            className="btn btn-link d-md-none rounded-circle mr-3"
            onClick={onToggleSidebar}
        >
            <FaBars />
        </button>

        {/* Search (desktop only) */}
        <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 navbar-search">
            <div className="input-group">
            <input
                type="text"
                className="form-control bg-light border-0 small"
                placeholder="Search for..."
            />
            <div className="input-group-append">
                <button className="btn btn-primary" type="button">
                <FaSearch />
                </button>
            </div>
            </div>
        </form>

        {/* Search (mobile only - icon + dropdown) */}
        <ul className="navbar-nav d-sm-none" ref={dropdownRef}>
            <li className="nav-item">
            <button
                className="nav-link btn btn-link p-0"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
                <FaSearch />
            </button>

            {showMobileSearch && (
                <div
                className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in show"
                style={{ position: "absolute", top: "60px", right: "10px", minWidth: "200px" }}
                >
                <form className="form-inline mr-auto w-100 navbar-search">
                    <div className="input-group">
                    <input
                        type="text"
                        className="form-control bg-light border-0 small"
                        placeholder="Search..."
                    />
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="button">
                        <FaSearch />
                        </button>
                    </div>
                    </div>
                </form>
                </div>
            )}
            </li>
        </ul>

        {/* Navbar Right */}
        <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown no-arrow mx-1">
            <a className="nav-link dropdown-toggle" href="#">
                <FaBell />
                <span className="badge badge-danger badge-counter">3+</span>
            </a>
            </li>

            <li className="nav-item dropdown no-arrow mx-1">
            <a className="nav-link dropdown-toggle" href="#">
                <FaEnvelope />
                <span className="badge badge-danger badge-counter">7</span>
            </a>
            </li>

            <div className="topbar-divider d-none d-sm-block"></div>

            <li className="nav-item dropdown no-arrow">
            <a className="nav-link dropdown-toggle" href="#">
                <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                Halo, Admin 👋
                </span>
                <img
                className="img-profile rounded-circle"
                src="https://i.pravatar.cc/40"
                alt="User"
                />
            </a>
            </li>
        </ul>
        </nav>
    );
}