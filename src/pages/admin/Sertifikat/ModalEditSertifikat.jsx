import React from "react";
import Swal from "sweetalert2";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

const ModalEditSertifikat = ({ selectedRow, onClose, show, onEdit }) => {
  const [formData, setFormData] = useState({
    nama_sertifikat: "",
    jenis_sertifikat: "",
    link_drive: "",
    event_id: "",
  });

  useEffect(() => {
    if (selectedRow) {
      setFormData({
        nama_sertifikat: selectedRow.nama_sertifikat || "",
        jenis_sertifikat: selectedRow.jenis_sertifikat || "",
        link_drive: selectedRow.link_drive || "",
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
    if (
      !formData.nama_sertifikat ||
      !formData.jenis_sertifikat ||
      !formData.link_drive
    ) {
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
        text: "Data sertifikat berhasil diubah",
        confirmButtonColor: "#667eea",
      });
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
                <b>ID Sertifikat:</b>
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
                <b>Nama Sertifikat:</b>
              </label>
              <input
                type="text"
                className="form-control"
                name="nama_sertifikat"
                value={formData.nama_sertifikat}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                <b>Jenis Sertifikat:</b>
              </label>
              <select
                className="form-control"
                name="jenis_sertifikat"
                value={formData.jenis_sertifikat}
                onChange={handleChange}
                required
              >
                <option value="peserta">Peserta</option>
                <option value="panitia">Panitia</option>
              </select>
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

export default ModalEditSertifikat;
