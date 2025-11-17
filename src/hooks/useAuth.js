import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "react-use";
import * as authService from "../services/authService";

/**
 * ============================================
 * 🔐 CUSTOM HOOK: useAuth
 * ============================================
 * Hook untuk mengelola authentication & authorization
 *
 * Features:
 * - Login/Logout user
 * - Auto-fetch user data dari token
 * - Persist token di localStorage
 * - Validasi token expired
 * ============================================
 */

const useAuth = () => {
  // ========== State Management ==========
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useLocalStorage("token"); // 🔑 Token disimpan di localStorage

  // ========== Login Function ==========
  /**
   * 🔓 Login user dan simpan token
   * @param {object} credentials - { nim, password }
   * @returns {Promise<object>} User data
   */
  const login = useCallback(
    async (credentials) => {
      const response = await authService.login(credentials);

      if (!response.success) {
        throw new Error(response.message);
      }

      // Simpan token & user data
      setToken(response.token);
      setUser(response.user);

      return response.user;
    },
    [setToken]
  );

  // ========== Logout Function ==========
  /**
   * 🔒 Logout user dan redirect ke landing page
   * ⚠️ PENTING: Redirect ke "/" (landing page) bukan login page
   */
  const logout = useCallback(async () => {
    // Hapus token di backend jika ada
    if (token) {
      try {
        await authService.logout(token);
      } catch (error) {
        console.warn("Logout gagal:", error.message);
      }
    }

    // Clear user & token
    setUser(null);
    setToken(null);

    // ⚠️ REDIRECT ke landing page setelah logout
    window.location.href = "/";
  }, [token, setToken]);

  // ========== Auto Fetch User ==========
  /**
   * 🔄 Auto-fetch user data saat token berubah
   * Validasi token dan ambil data user dari backend
   */
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.user(token);
        setUser(response.user);
      } catch (error) {
        // Token invalid/expired, clear data
        console.warn("Token invalid atau expired:", error.message);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, setToken]);

  // ========== Return Values ==========
  return {
    user, // 👤 Data user
    loading, // ⏳ Loading state
    login, // 🔓 Function login
    logout, // 🔒 Function logout
    isAuthenticated: !!user, // ✅ Status autentikasi
    token, // 🔑 Token JWT
  };
};

export default useAuth;
