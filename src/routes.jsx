/**
 * ============================================
 * 🗺️ ROUTER CONFIGURATION
 * ============================================
 * Konfigurasi routing untuk aplikasi
 *
 * Route Structure:
 * - "/" : Landing Page (Public)
 * - "/admin/auth/*" : Auth Pages (Login, etc)
 * - "/admin/*" : Admin Dashboard (Protected)
 * - "/pendaftaran*" : Form Pendaftaran
 * - "/presensi*" : Presensi
 * - "*" : 404 Not Found
 * ============================================
 */

import { createBrowserRouter } from "react-router";

// ========== Pages ==========
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/admin/auth/LoginPage.jsx";
import DashboardPage from "./pages/admin/DashboardPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ComingSoonPage from "./pages/ComingSoonPage.jsx";
import TestPage from "./pages/TestPage.jsx";

// Admin Pages
import EventPage from "./pages/admin/event/EventPage.jsx";
import DaftarPanitia from "./pages/admin/DaftarPanitia.jsx";
import DaftarPeserta from "./pages/admin/DaftarPeserta.jsx";
import DaftarHadirPeserta from "./pages/admin/DaftarHadirPeserta.jsx";
import DaftarHadirPanitia from "./pages/admin/DaftarHadirPanitia.jsx";
import FormSertifikat from "./pages/admin/Sertifikat/SertifikatPage.jsx";
import UangMasukPage from "./pages/admin/keuangan/uang-masuk/UangMasukPage.jsx";
import UangKeluarPage from "./pages/admin/keuangan/uang-keluar/UangKeluarPage.jsx";
import LaporanKeuanganPage from "./pages/admin/keuangan/laporan/LaporanKeuanganPage.jsx";
import Dokumentasi from "./pages/admin/Dokumentasi/Dokumentasi.jsx";

// Public Pages
import FormPeserta from "./pages/FormPeserta";
import FormPanitia from "./pages/FormPanitia";
import FormPresensi from "./pages/FormPresensi";
import PresensiRolePage from "./pages/PresensiRolePage.jsx";

// ========== Layouts ==========
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminAuthLayout from "./layouts/AdminAuthLayout.jsx";

// ========== Middlewares ==========
import NotLoginMiddleware from "./components/middlewares/NotLoginMiddleware.jsx";
import IsLoginMiddleware from "./components/middlewares/IsLoginMiddleware.jsx";
import CheckEventCode from "./components/middlewares/CheckEventCode";

// ========== Router Configuration ==========
const router = createBrowserRouter([
  // ========== 🏠 PUBLIC ROUTES ==========
  {
    path: "/",
    element: <LandingPage />,
  },

  // ========== 🔐 AUTH ROUTES (Not Logged In Only) ==========
  {
    path: "/admin/auth",
    element: (
      <NotLoginMiddleware>
        <AdminAuthLayout />
      </NotLoginMiddleware>
    ),
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },

  // ========== 🎛️ ADMIN ROUTES (Protected) ==========
  {
    path: "/admin",
    element: (
      <IsLoginMiddleware>
        <AdminLayout />
      </IsLoginMiddleware>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "users",
        element: <ComingSoonPage />,
      },
      {
        path: "events",
        element: <EventPage />,
      },
      // Keuangan Routes
      {
        path: "keuangan",
        children: [
          {
            path: "uang-masuk",
            element: <UangMasukPage />,
          },
          {
            path: "uang-keluar",
            element: <UangKeluarPage />,
          },
          {
            path: "laporan",
            element: <LaporanKeuanganPage />,
          },
        ],
      },
      // Data Management Routes
      {
        path: "listpeserta",
        element: <DaftarPeserta />,
      },
      {
        path: "listpanitia",
        element: <DaftarPanitia />,
      },
      {
        path: "presensipeserta",
        element: <DaftarHadirPeserta />,
      },
      {
        path: "presensipanitia",
        element: <DaftarHadirPanitia />,
      },
      {
        path: "dokumentasi",
        element: <Dokumentasi />,
      },
      {
        path: "sertifikat",
        element: <FormSertifikat />,
      },
    ],
  },

  // ========== 📝 PENDAFTARAN ROUTES (Public with Event Code) ==========
  {
    path: "/pendaftaranPeserta/:kodeEvent",
    loader: CheckEventCode, // ⚠️ Validate event code
    errorElement: <NotFoundPage />,
    element: <FormPeserta />,
  },
  {
    path: "/pendaftaranPanitia/:kodeEvent",
    loader: CheckEventCode, // ⚠️ Validate event code
    errorElement: <NotFoundPage />,
    element: <FormPanitia />,
  },

  // ========== ✅ PRESENSI ROUTES (Public) ==========
  {
    path: "/presensi-role",
    element: <PresensiRolePage />,
  },
  {
    path: "/presensi",
    element: <FormPresensi />,
  },
  {
    path: "/presensi/:kodeEvent",
    element: <FormPresensi />,
  },

  // ========== 🧪 DEVELOPMENT ROUTES ==========
  {
    path: "/test",
    element: <TestPage />,
  },
  {
    path: "/comingsoon",
    element: <ComingSoonPage />,
  },

  // ========== ❌ 404 NOT FOUND (Catch All) ==========
  // ⚠️ PENTING: Harus di paling bawah untuk catch semua route yang tidak ditemukan
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
