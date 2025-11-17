// src/store/pesertaStore.js
import { create } from "zustand";

const usePesertaStore = create((set) => ({
    peserta: [],
    loading: false,
    error: null,

    fetchPeserta: async () => {
        set({ loading: true, error: null });
        try {
        // Dummy data untuk sementara
        const data = [
            { id: 1, nama: "Rina Putri", email: "rina@mail.com", status_pembayaran: "lunas" },
            { id: 2, nama: "Budi Santoso", email: "budi@mail.com", status_pembayaran: "belum" },
            { id: 3, nama: "Siti Aminah", email: "siti@mail.com", status_pembayaran: "lunas" },
        ];
        // Simulasi loading
        setTimeout(() => {
            set({ peserta: data, loading: false });
        }, 1000);
        } catch (err) {
        set({ error: "Gagal mengambil data peserta", loading: false });
        }
    },
}));

export default usePesertaStore;