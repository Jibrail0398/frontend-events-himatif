import React from "react";
import Swal from "sweetalert2";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

const ModalEditDokumentasi = ({ selectedRow, onClose, show, onEdit }) => {
  const [formData, setFormData] = useState({
    nama_dokumentasi: "",
    judul: "",
    deskripsi: "",
    link_drive: "",
    event_id: "",
  });

  useEffect(() => {
    if (selectedRow) {
      setFormData({
        nama_dokumentasi: selectedRow.nama_dokumentasi || "",
        judul: selectedRow.judul || "",
        deskripsi: selectedRow.deskripsi || "",
        link_drive: selectedRow.link_drive || "",
        event_id: selectedRow.event_id,
      });
    }
  }, [selectedRow]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama_dokumentasi || !formData.judul || !formData.link_drive) {
      Swal.fire({
        icon: "warning",
        title: "Data Tidak Lengkap",
        text: "Harap isi semua field",
        confirmButtonColor: "#667eea",
      });
      return;
    }

    try {
      await onEdit(formData, selectedRow.event_id);
      await Swal.fire({
        icon: "success",
        title: "Berhasil Update",
        text: "Data dokumentasi berhasil diubah",
        confirmButtonColor: "#667eea",
      });
      console.log("Isi form data yang sudah dikirim:", formData);
    } catch (error) {
      let errorMessage = "Terjadi kesalahan saat mengupdate sertifikat";
      if (error.response) {
        const { data, status } = error.response;
        if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        } else if (status === 401) {
          errorMessage === "Anda tidak memiliki akses";
        }
        Swal.fire("Gagal Update", errorMessage, "error");
      }
    }
  };

  if (!show || !selectedRow) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-bounceIn"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="modal-close" onClick={onClose}>
          ✖
        </span>

        <h5 className="modal-header">Edit Sertifikat</h5>
        <form onSubmit={handleSubmit}>
          <div className="modal-details">
            <div className="mb-3">
              <label className="form-label">
                <b>ID Dokumentasi:</b>
              </label>
              <input
                type="text"
                className="form-control"
                value={selectedRow.event_id}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                <b>Nama:</b>
              </label>
              <input
                type="text"
                className="form-control"
                name="nama_dokumentasi"
                value={formData.nama_dokumentasi}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                <b>Judul:</b>
              </label>
              <input
                type="text"
                className="form-control"
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                <b>Deskripsi:</b>
              </label>
              <input
                type="text"
                className="form-control"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                <b>Link Drive:</b>
              </label>
              <input
                type="url"
                className="form-control"
                name="link_drive"
                value={formData.link_drive}
                onChange={handleChange}
                required
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>

          <div className="mt-3 text-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={onClose}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ModalEditDokumentasi;
