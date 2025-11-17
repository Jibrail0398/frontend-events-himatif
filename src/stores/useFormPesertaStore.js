import { create } from 'zustand';

const useFormPesertaStore = create((set, get) => ({
  // State
  formData: {
    nama: '',
    NIM: '',
    email: '',
    nomor_whatapp: '',
    angkatan: '',
    kelas: '',
    tanggal_lahir: '',
    ukuran_kaos: '',
    nomor_darurat: '',
    tipe_nomor_darurat: '',
    riwayat_penyakit: '',
    bukti_pembayaran: null,
    buktiPembayaranName: '',
  },

  participants: [],

  // Actions
  setFormData: (field, value) => 
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value
      }
    })),

  setFileUpload: (file) =>
    set((state) => ({
      formData: {
        ...state.formData,
        bukti_pembayaran: file,
        buktiPembayaranName: file ? file.name : '' // ← Simpan nama file
      
      }
    })),


  resetForm: () =>
    set({
      formData: {
        nama: '',
        NIM: '',
        email: '',
        nomor_whatapp: '',
        angkatan: '',
        kelas: '',
        tanggal_lahir: '',
        ukuran_kaos: '',
        nomor_darurat: '',
        tipe_nomor_darurat: '',
        riwayat_penyakit: '',
        bukti_pembayaran: null,
        buktiPembayaranName: '', // ← Reset nama file juga
      }
    }),

  // Validation - Diperbaiki
  validateForm: () => {
    const { formData } = get();
    return (
      formData.nama && 
      formData.NIM && 
      formData.email && 
      formData.nomor_whatapp && 
      formData.kelas 
      // formData.angkatan && 
      // formData.tanggal_lahir && 
      // formData.ukuran_kaos &&
      // formData.nomor_darurat &&
      // formData.tipe_nomor_darurat &&
      // formData.riwayat_penyakit &&
      // formData.bukti_pembayaran  
    );
  },

 
}));

export default useFormPesertaStore;