/**
 * ============================================
 * 🔐 AUTH SERVICE
 * ============================================
 * Service untuk handle API authentication
 * - Login
 * - Logout
 * - Get User Profile
 * ============================================
 */

import axios from "axios";

// ========== Environment Variables ==========
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT;
const BASE_URL_API = import.meta.env.VITE_BASE_URL_API;

/**
 * @typedef CredentialsRequest
 * @property {string} nim - NIM user
 * @property {string} password - Password user
 */

// ========== LOGIN ==========
/**
 * 🔓 Login user
 * @param {CredentialsRequest} data - Credentials { nim, password }
 * @returns {Promise<Object>} Response { success, token, user, message }
 */
export const login = async (data) => {
  const response = await axios.post(`${BASE_URL_API}/login`, data);
  return response.data;
};

// ========== LOGOUT ==========
/**
 * 🔒 Logout user (hapus token di backend)
 * @param {string} token - JWT token
 * @returns {Promise<boolean>} Success status
 */
export const logout = async (token) => {
  const response = await axios.post(
    `${BASE_URL_API}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data?.success ?? false;
};

// ========== GET USER PROFILE ==========
/**
 * 👤 Get current user profile
 * @param {string} token - JWT token
 * @returns {Promise<Object>} User data
 */
export const user = async (token) => {
  const response = await axios.get(`${BASE_URL_API}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
