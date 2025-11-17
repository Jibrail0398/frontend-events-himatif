import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFormPesertaStore from "../stores/useFormPesertaStore";
import "../style/FormPesertaSplit.css";
import { create } from "../services/persertaService";
import Swal from "sweetalert2";

const FormPeserta = () => {
  const { kodeEvent } = useParams();
  const navigate = useNavigate();

  const { formData, setFormData, setFileUpload, validateForm, resetForm } =
    useFormPesertaStore();

  const [isLoading, setIsLoading] = useState(false);

  const ukuranKaosOptions = ["S", "M", "L", "XL", "XXL"];
  const tipeDaruratOptions = ["Ayah", "Ibu", "Saudara", "Lainnya"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File Terlalu Besar",
          text: "Ukuran file maksimal 5MB",
          confirmButtonColor: "#667eea",
        });
        e.target.value = ""; // Reset input file
        return;
      }
      setFileUpload(file);
    }
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
      const formDataToSend = new FormData();
      formDataToSend.append("nama", formData.nama);
      formDataToSend.append("NIM", formData.NIM);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("nomor_whatapp", formData.nomor_whatapp);
      formDataToSend.append("angkatan", formData.angkatan);
      formDataToSend.append("kelas", formData.kelas);
      formDataToSend.append("tanggal_lahir", formData.tanggal_lahir);
      formDataToSend.append("ukuran_kaos", formData.ukuran_kaos);
      formDataToSend.append("nomor_darurat", formData.nomor_darurat || "");
      formDataToSend.append(
        "tipe_nomor_darurat",
        formData.tipe_nomor_darurat || ""
      );
      formDataToSend.append("riwayat_penyakit", formData.riwayat_penyakit);

      if (formData.bukti_pembayaran) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(formData.bukti_pembayaran.type)) {
          Swal.fire({
            icon: "error",
            title: "Format File Salah",
            text: "File harus berformat JPG, JPEG, atau PNG",
            confirmButtonColor: "#667eea",
          });
          setIsLoading(false);
          return;
        }
        formDataToSend.append("bukti_pembayaran", formData.bukti_pembayaran);
      }

      await create(kodeEvent, formDataToSend);

      Swal.fire({
        icon: "success",
        title: "Pendaftaran Berhasil!",
        text: "Terima kasih telah mendaftar. Data Anda telah kami terima.",
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

  return (
    <div className="pendaftaran-page-split">
      <div className="split-container">
        {/* Center Form */}
        <div className="split-right center-form">
          <div className="form-wrapper">
            {/* Form Header */}
            <div className="form-header-split">
              <h2 className="form-title-split">Pendaftaran Inaugurasi</h2>
              <p className="form-subtitle-split">
                Silakan isi formulir pendaftaran event dengan lengkap dan benar
              </p>
            </div>

            <form className="form-split" onSubmit={handleSubmit}>
              <div className="form-row-split">
                <div className="form-col">
                  <label>
                    Nama Lengkap <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    placeholder="Nama lengkap..."
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="form-col">
                  <label>
                    NIM <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    name="NIM"
                    placeholder="202xxxxxxx"
                    value={formData.NIM}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-row-split">
                <div className="form-col">
                  <label>
                    Email <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="form-col">
                  <label>
                    WhatsApp <span className="req">*</span>
                  </label>
                  <input
                    type="tel"
                    name="nomor_whatapp"
                    placeholder="08xxxxxxxxxx"
                    value={formData.nomor_whatapp}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-row-split">
                <div className="form-col">
                  <label>
                    Kelas <span className="req">*</span>
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
                
                {/* <div className="form-col">
                  <label>
                    Angkatan <span className="req">*</span>
                  </label>
                  <input
                    type="number"
                    name="angkatan"
                    placeholder="2024"
                    min="2000"
                    max="2099"
                    value={formData.angkatan}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div> */}

              </div>

              {/* <div className="form-row-split">
                <div className="form-col">
                  <label>
                    Tanggal Lahir <span className="req">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggal_lahir"
                    value={formData.tanggal_lahir}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="form-col">
                  <label>
                    Ukuran Kaos <span className="req">*</span>
                  </label>
                  <div className="size-options">
                    {ukuranKaosOptions.map((ukuran) => (
                      <label key={ukuran} className="size-option">
                        <input
                          type="radio"
                          name="ukuran_kaos"
                          value={ukuran}
                          checked={formData.ukuran_kaos === ukuran}
                          onChange={handleInputChange}
                          required
                          disabled={isLoading}
                        />
                        <span>{ukuran}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div> */}

              {/* <div className="form-row-split">
                <div className="form-col">
                  <label>
                    Kontak Darurat <span className="req">*</span>
                  </label>
                  <input
                    type="tel"
                    name="nomor_darurat"
                    placeholder="08xxxxxxxxxx"
                    value={formData.nomor_darurat}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-col">
                  <label>
                    Hubungan <span className="req">*</span>
                  </label>
                  <select
                    name="tipe_nomor_darurat"
                    value={formData.tipe_nomor_darurat}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  >
                    <option value="" disabled>
                      Pilih...
                    </option>
                    {tipeDaruratOptions.map((tipe) => (
                      <option key={tipe} value={tipe}>
                        {tipe}
                      </option>
                    ))}
                  </select>
                </div>
              </div> */}

              {/* <div className="form-row-full">
                <div className="form-col">
                  <label>
                    Riwayat Penyakit <span className="req">*</span>
                  </label>
                  <textarea
                    name="riwayat_penyakit"
                    placeholder="Jelaskan riwayat penyakit atau tulis 'Tidak Ada'"
                    value={formData.riwayat_penyakit}
                    onChange={handleInputChange}
                    rows="3"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div> */}

              {/* <div className="divider-section">
                <span>Pembayaran</span>
              </div> */}

              {/* <div className="payment-info-compact">
                <div className="payment-row">
                  <span>Nomor Rekening</span>
                  <strong>1234567890</strong>
                </div>
                <div className="payment-row">
                  <span>Bank BCA a.n.</span>
                  <strong>Panitia Inaugurasi FIK</strong>
                </div>
                <div className="payment-row">
                  <span>Nominal Transfer</span>
                  <strong className="amount">Rp 150.000</strong>
                </div>
              </div> */}

              {/* <div className="form-row-full">
                <div className="form-col">
                  <label>
                    Upload Bukti Transfer <span className="req">*</span>
                  </label>
                  <label className="upload-compact">
                    <input
                      type="file"
                      name="bukti_pembayaran"
                      accept=".jpeg,.jpg,.png"
                      onChange={handleFileChange}
                      required
                      disabled={isLoading}
                      style={{ display: "none" }}
                    />
                    <div className="upload-inner">
                      {formData.bukti_pembayaran ? (
                        <>
                          <i className="fas fa-check-circle"></i>
                          <span>File terpilih</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-upload"></i>
                          <span>Pilih file</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>

              </div> */}

              <button
                type="submit"
                className="btn-submit-split"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-mini"></span>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Sekarang</span>
                    <i className="fas fa-arrow-right"></i>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPeserta;
