import { create } from 'zustand';

const useFormPanitiaStore = create((set, get) => ({
  // State
  formData: {
    name: '',
    nim: '',
    email: '',
    whatsapp: '',
    angkatan: '',
    kelas: '',
    tanggalLahir: '',
    ukuranKaos: '',
    divisi: '',
    komitmenAcara: false,
    komitmenDivisi: false,
    nomor_darurat: '',
    tipe_nomor_darurat: '',
    riwayatPenyakit: ''
  },


  resetForm: () =>
    set({
      formData: {
        name: '',
        nim: '',
        angkatan: '',
        kelas: '',
        tanggalLahir: '',
        whatsapp: '',
        email: '',
        ukuranKaos: '',
        divisi: '',
        komitmenAcara: false,
        komitmenDivisi: false,
        nomor_darurat: '',
        tipe_nomor_darurat: '',
        riwayatPenyakit: ''
      }
    }),

  // Validation
  validateForm: () => {
    const { formData } = get();
    const requiredFields = [
      formData.name,
      formData.nim,
      formData.angkatan,
      formData.kelas,
      formData.whatsapp,
      formData.email,
      formData.divisi,
      formData.komitmenAcara,
      formData.komitmenDivisi
      // formData.tanggalLahir,
      // formData.ukuranKaos,
      // formData.nomor_darurat,
      // formData.tipe_nomor_darurat,
      // formData.riwayatPenyakit
    ];

    // Cek semua field wajib terisi
    const allFieldsFilled = requiredFields.every(field => field && field.toString().trim() !== '');
    
    // Cek komitmen
    const komitmenValid = formData.komitmenAcara && formData.komitmenDivisi;

    return allFieldsFilled && komitmenValid;
  },

  setFormData: (field, value) => 
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value
      }
    })),

}));

export default useFormPanitiaStore;