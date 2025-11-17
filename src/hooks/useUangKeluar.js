import { useCallback, useEffect, useState } from "react";
import * as keuanganService from "../services/keuanganService";
import { useLocalStorage } from "react-use";

const useUangKeluar = () => {
    const [loading, setLoading] = useState(true);
    const [uangKeluar, setUangKeluar] = useState([]);
    const [token, _] = useLocalStorage("token");

    // 🔁 Ambil semua data uang keluar
    const getAll = useCallback(async () => {
        setLoading(true);
        try {
            const response = await keuanganService.getAllUangKeluar(token);
            setUangKeluar(response.data);
        } catch (error) {
            console.error("Gagal memuat data uang keluar:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // 🔍 Ambil data uang keluar berdasarkan ID
    const getById = useCallback(
        async (id) => {
            return uangKeluar.find((item) => item.id === id);
        },
        [uangKeluar]
    );

    // ➕ Tambah data baru
    const create = useCallback(
        async (data) => {
            try {
                const response = await keuanganService.createUangKeluar(data, token);
                getAll(); // Refresh data setelah tambah
                return response;
            } catch (error) {
                throw error;
            }
        },
        [token, getAll]
    );

    // ✏️ Update data
    const update = useCallback(
        async (id, data) => {
            try {
                const response = await keuanganService.updateUangKeluar(id, data, token);
                getAll(); // Refresh setelah update
                return response;
            } catch (error) {
                throw error;
            }
        },
        [token, getAll]
    );

    // ❌ Hapus data berdasarkan ID
    const deleteById = useCallback(
        async (id) => {
            try {
                const response = await keuanganService.deleteUangKeluar(id, token);
                getAll(); // Refresh setelah hapus
                return response;
            } catch (error) {
                throw error;
            }
        },
        [token, getAll]
    );

    // ⏳ Load otomatis saat hook dipakai
    useEffect(() => {
        getAll();
    }, [getAll]);

    return { loading, uangKeluar, getAll, getById, create, update, deleteById };
};

export default useUangKeluar;
