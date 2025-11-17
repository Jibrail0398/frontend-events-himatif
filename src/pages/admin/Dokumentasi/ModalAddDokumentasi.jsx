import React from 'react'
import { createPortal } from 'react-dom'

const ModalAddDokumentasi = (
    {showModal,
    onClose,
    title,
    formData,
    events,
    onSubmit,
    onChange,}

) => {
if (!showModal) return null;    
return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-content animate-bounceIn"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="modal-close"
          onClick={onClose}
        >
          ✖
        </span>

        <h5 className="modal-header">{title}</h5>

        <form onSubmit={onSubmit} className="modal-details">
          <div className="mb-2">
            <label>Nama Dokumentasi:</label>
            <input
              type="text"
              name="nama_dokumentasi"
              value={formData.nama_dokumentasi || ''}
              onChange={onChange}
              className="form-control"
              placeholder="Contoh: Dokumentasi Inaugurasi 2025"
              required
            />
          </div>

          <div className="mb-2">
            <label>Judul</label>
            <input
              type="text"
              name="judul"
              value={formData.judul || ''}
              onChange={onChange}
              className="form-control"
              placeholder="Contoh: Pembukaan Acara"
              required
            />
          </div>

          <div className="mb-2">
            <label>Deskripsi</label>
            <input
              type="text"
              name="deskripsi"
              value={formData.deskripsi || ''}
              onChange={onChange}
              className="form-control"
              placeholder="Contoh: Dokumentasi Saat Pembukaan Acara"
              
            />
          </div>

          <div className="mb-2">
            <label>Pilih Event:</label>
            <select
              name="event_id"
              value={formData.event_id || ''}
              onChange={onChange}
              className="form-control"
              required
            >
              <option value="">Pilih Kode event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.nama_event}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label>Link Drive:</label>
            <input
              type="url"
              name="link_drive"
              value={formData.link_drive || ''}
              onChange={onChange}
              className="form-control"
              placeholder="Masukkan link Google Drive"
              required
            />
          </div>

          <div className="mt-3 d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default ModalAddDokumentasi