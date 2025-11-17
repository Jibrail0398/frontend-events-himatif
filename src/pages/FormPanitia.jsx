import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import useFormPanitiaStore from "../stores/useFormPanitiaStore";
import { registerPanitia } from "../services/panitiaService";
import "../style/FormPeserta.css";
import Swal from "sweetalert2";

const FormPanitia = () => {
  const { kodeEvent } = useParams();
  const navigate = useNavigate();
  const tipeDaruratOptions = ["Ayah", "Ibu", "Saudara", "Lainnya"];
  const { formData, setFormData, validateForm, resetForm } =
    useFormPanitiaStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(name, type === "checkbox" ? checked : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "warning",
        title: "Data Tidak Lengkap",
        text: "Harap isi semua field yang wajib diisi!",
        confirmButtonColor: "#667eea",
      });
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        nama: formData.name,
        NIM: formData.nim,
        email: formData.email,
        nomor_whatapp: formData.whatsapp,
        angkatan: formData.angkatan,
        kelas: formData.kelas,
        tanggal_lahir: formData.tanggalLahir,
        ukuran_kaos: formData.ukuranKaos,
        divisi: formData.divisi,
        nomor_darurat: formData.nomor_darurat,
        tipe_nomor_darurat: formData.tipe_nomor_darurat,
        riwayat_penyakit: formData.riwayatPenyakit,
        komitmen1: formData.komitmenAcara ? "ya" : "tidak",
        komitmen2: formData.komitmenDivisi ? "ya" : "tidak",
      };
      await registerPanitia(submitData, kodeEvent);

      Swal.fire({
        icon: "success",
        title: "Pendaftaran Berhasil!",
        text: "Terima kasih telah mendaftar sebagai panitia. Data Anda telah kami terima.",
        confirmButtonColor: "#667eea",
        confirmButtonText: "OK",
      }).then(() => {
        resetForm();
        navigate("/");
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Terjadi kesalahan saat mendaftar";

      Swal.fire({
        icon: "error",
        title: "Pendaftaran Gagal",
        text: errorMessage,
        confirmButtonColor: "#667eea",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const ukuranKaosOptions = ["S", "M", "L", "XL", "XXL"];
  const divisiOptions = ["PDD", "Humas", "Konsumsi", "Logistik/Peralatan"];

  return (
    <div className="pendaftaran-page">
      <div className="form-container">
        {/* Form Header */}
        <header className="form-header">
          <h2 className="form-title">Pendaftaran Inaugurasi</h2>
          <h3 className="form-subtitle-main">Panitia Pelaksana</h3>
          <p className="form-description">
            Isi data diri dengan lengkap untuk mendaftar sebagai panitia
          </p>
        </header>

        <form className="add-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>
                Nama Lengkap <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Nama lengkap..."
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>
                NIM <span className="required">*</span>
              </label>
              <input
                type="text"
                name="nim"
                placeholder="Nomor Induk Mahasiswa..."
                value={formData.nim}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Angkatan <span className="required">*</span>
              </label>
              <input
                type="number"
                name="angkatan"
                placeholder="Tahun angkatan..."
                min="2000"
                max="2099"
                value={formData.angkatan}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>
                Kelas <span className="required">*</span>
              </label>
              <input
                type="text"
                name="kelas"
                placeholder="IF23B"
                value={formData.kelas}
                onChange={handleInputChange}
                maxLength="10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* <div className="form-row">
            <div className="form-group">
              <label>
                Tanggal Lahir <span className="required">*</span>
              </label>
              <input
                type="date"
                name="tanggalLahir"
                value={formData.tanggalLahir}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div> */}

          <div className="form-row">
            <div className="form-group">
              <label>
                Nomor WhatsApp <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="whatsapp"
                placeholder="08123456789"
                value={formData.whatsapp}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email aktif"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* <div className="form-group">
            <label>
              Ukuran Kaos <span className="required">*</span>
            </label>
            <div className="radio-group">
              {ukuranKaosOptions.map((ukuran) => (
                <label key={ukuran} className="radio-label">
                  <input
                    type="radio"
                    name="ukuranKaos"
                    value={ukuran}
                    checked={formData.ukuranKaos === ukuran}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <span>{ukuran}</span>
                </label>
              ))}
            </div>
          </div> */}

          {/* Divisi dan Komitmen */}
          <div className="form-section">
            <h4>Divisi dan Komitmen</h4>

            <div className="form-group">
              <label>
                Divisi <span className="required">*</span>
              </label>
              <div className="radio-group">
                {divisiOptions.map((divisi) => (
                  <label key={divisi} className="radio-label">
                    <input
                      type="radio"
                      name="divisi"
                      value={divisi}
                      checked={formData.divisi === divisi}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <span>{divisi}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>
                Komitmen <span className="required">*</span>
              </label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="komitmenAcara"
                    checked={formData.komitmenAcara}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                  <span className="ml-4" >
                    Bersedia Mengikuti dan Bertanggung Jawab Selama Acara
                    Berlangsung
                  </span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="komitmenDivisi"
                    checked={formData.komitmenDivisi}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                  <span className="ml-4" >Kesediaan Ditempatkan di Divisi Manapun</span>
                </label>
              </div>
            </div>
          </div>

          {/* <div className="form-row">
            <div className="form-group">
              <label>
                Nomor Darurat <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="nomor_darurat"
                placeholder="Nomor telepon darurat..."
                value={formData.nomor_darurat}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>
                Tipe Nomor Darurat <span className="required">*</span>
              </label>
              <select
                name="tipe_nomor_darurat"
                value={formData.tipe_nomor_darurat}
                onChange={handleInputChange}
                disabled={isLoading}
              >
                <option value="" disabled>
                  nomor darurat siapa?
                </option>
                {tipeDaruratOptions.map((tipe) => (
                  <option key={tipe} value={tipe}>
                    {tipe}
                  </option>
                ))}
              </select>
            </div>
          </div> */}

          {/* Informasi Kesehatan */}
          {/* <div className="form-section">
            <h4>Informasi Kesehatan</h4>

            <div className="form-group">
              <label>
                Riwayat Penyakit <span className="required">*</span>
              </label>
              <textarea
                name="riwayatPenyakit"
                placeholder="Jelaskan riwayat penyakit yang pernah diderita (jika tidak ada, tulis 'Tidak Ada')..."
                value={formData.riwayatPenyakit}
                onChange={handleInputChange}
                rows="3"
                required
                disabled={isLoading}
              />
            </div>
          </div> */}

          <button type="submit" className="form-button" disabled={isLoading}>
            {isLoading ? "Mendaftarkan..." : "Daftar sebagai Panitia"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPanitia;
