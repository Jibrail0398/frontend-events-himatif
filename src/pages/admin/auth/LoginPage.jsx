import { useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import "../../../style/LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // input
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const rememberMe = false;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nim || !password) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Data",
        text: "Please fill in all fields",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await login({ nim, password }, rememberMe);

      // Redirect berdasarkan role
      // Mentor -> Landing Page dengan fitur presensi
      // Admin & Panitia -> Dashboard Admin
      if (response?.role === "mentor") {
        navigate("/");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-login-container">
      {/* Left Side - Welcome Section */}
      <div className="login-left-section">
        <div className="welcome-content">
          <div className="welcome-illustration">
            <div className="illustration-circle circle-1"></div>
            <div className="illustration-circle circle-2"></div>
            <div className="illustration-circle circle-3"></div>

            <div className="illustration-laptop">
              <i className="fas fa-laptop-code"></i>
            </div>

            <div className="illustration-icons">
              <div className="floating-icon icon-1">
                <i className="fas fa-users"></i>
              </div>
              <div className="floating-icon icon-2">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="floating-icon icon-3">
                <i className="fas fa-certificate"></i>
              </div>
            </div>
          </div>

          <div className="welcome-text">
            <h1 className="welcome-title">WELCOME</h1>
            <p className="welcome-subtitle">
              Sistem Manajemen Event Inaugurasi FIK
            </p>
            <div className="welcome-features">
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Kelola Event dengan Mudah</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Dashboard Interaktif & Modern</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Sertifikat Digital Otomatis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right-section">
        <div className="login-form-wrapper">
          <div className="login-header-split">
            <h2 className="login-title-split">USER LOGIN</h2>
            <p className="login-subtitle-split">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form-split">
            <div className="form-group-split">
              <div className="input-with-icon">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  className="form-input-split"
                  placeholder="Username / NIM"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group-split">
              <div className="input-with-icon">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input-split"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-split"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            <div className="form-options-split">
              <Link
                to="/admin/auth/forgot-password"
                className="forgot-link-split"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-login-split"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>

            <div className="login-footer-split">
              <p>
                Don't have an account?{" "}
                <Link to="/" className="create-account-link">
                  Contact Admin
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
