/**
 * @typedef Keuangan
 * @property {string} id
 */

/**
 * Content-Type: multipart/form-data
 * @typedef CreateUangMasukRequest
 * @property {number} jumlah_uang_masuk
 * @property {string} asal_pemasukan
 * @property {*} bukti_pemasukan
 * @property {number} keuangan_id
 * @property {string} tanggal_pemasukan
 */

/**
 * Content-Type: multipart/form-data
 * @typedef CreateUangKeluarRequest
 * @property {number} jumlah_pengeluaran
 * @property {string} asal_pengeluaran
 * @property {*} bukti_pengeluaran
 * @property {number} keuangan_id
 * @property {string} tanggal_pengeluaran
 */

/**
 * Update Uang Masuk
 * @typedef UpdateUangMasukRequest
 * @property {number} jumlah_uang_masuk
 * @property {string} asal_pemasukan
 * @property {string} tanggal_pemasukan
 * @property {number} keuangan_id
 */

/**
 * Update Uang Keluar
 * @typedef UpdateUangKeluarRequest
 * @property {number} jumlah_pengeluaran
 * @property {string} asal_pengeluaran
 * @property {string} tanggal_pengeluaran
 * @property {number} keuangan_id
 */

import axios from "axios";

const BASE_URL_API = import.meta.env.VITE_BASE_URL_API;

/**
 * Get all Keuangan
 * @param {string} token
 * @returns {Promise<Object>}
 */
export const getKeuangan = async (token) => {
    const response = await axios.get(`${BASE_URL_API}/keuangan`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

/**
 * Get all uang masuk
 * @param {string} token
 * @returns {Promise<Object>}
 */
export const getAllUangMasuk = async (token) => {
    const response = await axios.get(`${BASE_URL_API}/uang-masuk/index`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

/**
 * Get all uang keluar
 * @param {string} token
 * @returns {Promise<Object>}
 */
export const getAllUangKeluar = async (token) => {
    const response = await axios.get(`${BASE_URL_API}/uang-keluar/index`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

/**
 * Create uang masuk
 * @param {CreateUangMasukRequest} data
 * @param {string} token
 * @returns {Promise<Object | never>}
 */
export const createUangMasuk = async (data, token) => {
    const response = await axios.post(`${BASE_URL_API}/uang-masuk/add`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

/**
 * Create uang keluar
 * @param {CreateUangKeluarRequest} data
 * @param {string} token
 * @returns {Promise<Object | never>}
 */
export const createUangKeluar = async (data, token) => {
    const response = await axios.post(`${BASE_URL_API}/uang-keluar/add`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

/**
 * Update uang masuk
 * @param {number} id ID uang masuk
 * @param {UpdateUangMasukRequest} data Request data uang masuk
 * @param {string} token Auth token
 * @returns {Promise<Object | never>}
 */
export const updateUangMasuk = async (id, data, token) => {
    const response = await axios.put(`${BASE_URL_API}/uang-masuk/update/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

/**
 *
 * @param {number} id ID Uang Keluar
 * @param {UpdateUangKeluarRequest} data
 * @param {string} token Auth token
 * @returns {Promise<Object | never>}
 */
export const updateUangKeluar = async (id, data, token) => {
    const response = await axios.put(`${BASE_URL_API}/uang-keluar/update/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

/**
 * Hapus Uang Masuk
 * @param {number} id ID Uang Masuk
 * @param {string} token Auth token
 * @returns {Promise<Object | never>}
 */
export const deleteUangMasuk = (id, token) => {
    const response = axios.delete(`${BASE_URL_API}/uang-masuk/delete/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

/**
 * Hapus Uang Keluar
 * @param {number} id ID Uang Keluar
 * @param {string} token Auth token
 */
export const deleteUangKeluar = async (id, token) => {
    const response = await axios.delete(`${BASE_URL_API}/uang-keluar/delete/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
