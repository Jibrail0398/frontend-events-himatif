import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPublicEvents } from "../services/eventService";
import useAuth from "../hooks/useAuth";
import "../style/PresensiRolePage.css";

const PresensiRolePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Redirect jika bukan admin atau panitia/mentor
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/auth/login");
      return;
    }

    if (
      user?.role &&
      user.role !== "admin" &&
      user.role !== "panitia" &&
      user.role !== "mentor"
    ) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch events dari API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getPublicEvents();
        const allEvents = response.data || [];
        setEvents(allEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleProceedToPresensi = () => {
    if (selectedEvent) {
      navigate(`/presensi/${selectedEvent.kode_event}`);
    }
  };

  if (
    !isAuthenticated ||
    (user?.role &&
      user.role !== "admin" &&
      user.role !== "panitia" &&
      user.role !== "mentor")
  ) {
    return null;
  }

  return (
    <div className="presensi-role-page">
      {/* Navbar */}
      <nav className="presensi-navbar">
        <div className="container">
          <div className="navbar-content">
            <Link to="/" className="navbar-brand">
              <i className="fas fa-graduation-cap me-2"></i>
              <span>Inaugurasi FIK</span>
            </Link>
            <div className="navbar-menu">
              <Link to="/" className="nav-link">
                <i className="fas fa-home me-1"></i>
                Home
              </Link>
              <Link to="/admin" className="nav-link">
                <i className="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="presensi-container">
        <div className="container">
          <div className="presensi-header">
            <div className="header-icon">
              <i className="fas fa-clipboard-check"></i>
            </div>
            <h1 className="presensi-title">Form Presensi</h1>
            <p className="presensi-subtitle">
              Pilih event untuk melakukan presensi peserta atau panitia
            </p>
            <div className="user-info">
              <i className="fas fa-user-circle me-2"></i>
              <span>{user?.nama || "User"}</span>
              <span className="role-badge">{user?.role || "Role"}</span>
            </div>
          </div>

          {/* Events Grid */}
          <div className="events-section">
            <h2 className="section-title">Pilih Event</h2>

            {loadingEvents ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Memuat event...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-calendar-times"></i>
                <p>Belum ada event tersedia</p>
              </div>
            ) : (
              <div className="events-grid">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`event-card ${
                      selectedEvent?.id === event.id ? "selected" : ""
                    }`}
                    onClick={() => handleEventSelect(event)}
                  >
                    <div className="event-card-header">
                      <div className="event-icon">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div
                        className={`status-badge ${
                          event.status_pendaftaran_peserta === "open"
                            ? "open"
                            : "closed"
                        }`}
                      >
                        {event.status_pendaftaran_peserta === "open"
                          ? "Buka"
                          : "Tutup"}
                      </div>
                    </div>
                    <h3 className="event-title">{event.nama_event}</h3>
                    <div className="event-info">
                      <div className="info-item">
                        <i className="fas fa-code"></i>
                        <span>{event.kode_event}</span>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{event.tempat || "TBA"}</span>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-calendar"></i>
                        <span>
                          {event.tanggal_mulai
                            ? new Date(event.tanggal_mulai).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "TBA"}
                        </span>
                      </div>
                    </div>
                    {selectedEvent?.id === event.id && (
                      <div className="selected-indicator">
                        <i className="fas fa-check-circle"></i>
                        <span>Terpilih</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Button */}
          {selectedEvent && (
            <div className="action-section">
              <button className="btn-proceed" onClick={handleProceedToPresensi}>
                <i className="fas fa-arrow-right me-2"></i>
                Lanjut ke Form Presensi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresensiRolePage;
