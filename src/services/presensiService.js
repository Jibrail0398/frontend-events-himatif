import axios from "axios";
const BASE_URL_API = import.meta.env.VITE_BASE_URL_API;
const token = localStorage.getItem("token");


/**
 * Content-Type: application/json
 * @typedef getDaftarHadirPanitia
 * @property {string} url
 * @property {string} token
 */

export const getDaftarHadirPanitia = async (url,token) => {
    try{

        const response = await axios.get(BASE_URL_API+url,{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        });


        return response.data;

    }catch(error){
        throw error;
    }
};



/**
 * Content-Type: application/json
 * @typedef getDaftarHadirPeserta
 * @property {string} url
 * @property {string} token
 */

export const getDaftarHadirPeserta = async(url,token) =>{


    try{

        const response = await axios.get(BASE_URL_API+url,{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;


    }catch(error){
        throw error;
    }

}

export const updatePresensiManual = async (token, id, status) => {
    try {
        const response = await axios.put(
            `${BASE_URL_API}/presensi/peserta/update/${id}`,
            {
                presensi_datang: status === "hadir" ? "hadir" : "tidak hadir",
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("✅ Presensi manual berhasil diperbarui:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Gagal memperbarui presensi manual:", error);
        throw error;
    }
};

export const updatePresensiPanitia = async (token, id, status) => {
    try {
        const response = await axios.put(
            `${BASE_URL_API}/presensi/panitia/update/${id}`,
            {
                presensi_datang: status === "hadir" ? "hadir" : "tidak hadir",
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("✅ Presensi panitia berhasil diperbarui:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Gagal memperbarui presensi panitia:", error);
        throw error;
    }
};

export async function scanPresensi(requestData, token) {
    try {
        const response = await fetch(`${BASE_URL_API}/presensi/scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestData),
        });

        // ✅ TAMBAHKAN: Handle HTTP error status
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || 
                `HTTP error! status: ${response.status}`
            );
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in scanPresensi:', error);
        throw error;
    }
}


