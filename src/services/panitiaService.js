import axios from "axios";

const BASE_URL_API = import.meta.env.VITE_BASE_URL_API;

/**
 * Ambil token dari localStorage
 */
const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("❌ Token tidak ditemukan di LocalStorage");
    return token;
};

/**
 * Ambil semua data pendaftar panitia
 */
export const getAll = async () => {
    try {
        const token = getToken();
        const response = await axios.get(`${BASE_URL_API}/panitia/pendaftaran/index`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) return response.data;
        if (Array.isArray(response.data?.data)) return response.data.data;
        if (Array.isArray(response.data?.pendaftar)) return response.data.pendaftar;

        return [];
    } catch (error) {
        console.error("❌ Gagal mengambil data panitia:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Ambil seluruh data penerimaan panitia
 */
export const getAllPenerimaan = async () => {
    try {
        const token = getToken();
        const response = await axios.get(`${BASE_URL_API}/penerimaan-panitia/index`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) return response.data;
        if (Array.isArray(response.data?.data)) return response.data.data;
        return [];
    } catch (error) {
        console.error("❌ Gagal mengambil data penerimaan panitia:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Ambil panitia dan merge dengan penerimaan (jika ada)
 */
export const getAllWithPenerimaan = async () => {
    const panitia = await getAll();
    let penerimaan = [];
    try {
        penerimaan = await getAllPenerimaan();
    } catch (err) {
        console.warn("Tidak dapat mengambil penerimaan, mengembalikan hanya panitia:", err.message);
        return panitia.map((p) => ({
            ...p,
            penerimaan: null,
            penerimaan_id: null,
            status_penerimaan: p.status_penerimaan ?? null,
        }));
    }

    return panitia.map((p) => {
        const pr = penerimaan.find(
            (x) =>
                x.pendaftaran_panitia_id === p.id ||
                x.pendaftar_panitia_id === p.id ||
                (x.pendaftar_panitia && x.pendaftar_panitia.id === p.id) ||
                (x.pendaftarPanitia && x.pendaftarPanitia.id === p.id)
        );

        return {
            ...p,
            penerimaan: pr || null,
            penerimaan_id: pr?.id ?? null,
            status_penerimaan: pr?.status_penerimaan ?? p.status_penerimaan ?? null,
        };
    });
};

/**
 * Verifikasi panitia — menggunakan ID penerimaan panitia
 *
 * @param {number} penerimaanId - id tabel penerimaan_panitia
 * @param {'diterima'|'ditolak'} status - status yang diinginkan
 */
export const verifyPanitia = async (penerimaanId, status) => {
    if (!penerimaanId) throw new Error("⚠️ Penerimaan panitia belum tersedia.");

    const token = getToken();

    try {
        const updateRes = await axios.put(
            `${BASE_URL_API}/penerimaan-panitia/update/${penerimaanId}`,
            { status_penerimaan: status },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (updateRes.data?.success) {
            console.log("✅ Verifikasi panitia berhasil:", updateRes.data);
            return updateRes.data;
        } else {
            throw new Error(updateRes.data?.message || "Update gagal tanpa pesan");
        }
    } catch (error) {
        console.error(
            "❌ Terjadi kesalahan saat verifikasi panitia:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const registerPanitia = async(data,kodeEvent) =>{
    try{
        const response = await axios.post(`${BASE_URL_API}/pendaftaran-panitia/${kodeEvent}`,data);

        return response.data;
    }catch(e){
        
        throw error;
    }
}

// Alias supaya nama fungsi sama dengan yang dipanggil di komponen React
export const verifyPanitiaById = verifyPanitia;

/**
 * Hapus data panitia — menggunakan ID panitia (tabel pendaftar_panitia)
 *
 * @param {number} id - id dari tabel panitia
 */
export const deletePanitiaById = async (id) => {
    if (!id) throw new Error("⚠️ ID panitia tidak ditemukan.");

    const token = getToken();

    try {
        const response = await axios.delete(`${BASE_URL_API}/panitia/pendaftaran/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.success) {
            console.log("🗑️ Panitia berhasil dihapus:", response.data);
            return response.data;
        } else {
            throw new Error(response.data?.message || "Hapus gagal tanpa pesan");
        }
    } catch (error) {
        console.error("❌ Gagal menghapus panitia:", error.response?.data || error.message);
        throw error;
    }
};