import React, { useState, useEffect } from "react";
import { FaEye, FaSort, FaFileExcel } from "react-icons/fa";
import { createPortal } from "react-dom";
import * as XLSX from "xlsx";
import * as panitiaService from "../../services/panitiaService";
import Swal from "sweetalert2";

export default function DaftarPanitia() {
  const [panitia, setPanitia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [filterDivisi, setFilterDivisi] = useState("");
  const [filterAngkatan, setFilterAngkatan] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Ambil data panitia + penerimaan
  const fetchPanitia = async () => {
    try {
      setLoading(true);
      const data = await panitiaService.getAllWithPenerimaan();
      setPanitia(data);
    } catch (err) {
      console.error("Gagal memuat data:", err);
      setError("Gagal memuat data panitia. Cek console/network untuk rincian.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPanitia();
  }, []);

  
  // --- HANDLE VERIFIKASI ---
  const handleVerifikasi = async (penerimaanId, status) => {
    if (!penerimaanId) {
      Swal.fire({
        icon: "warning",
        title: "Data Tidak Tersedia",
        text: "Data penerimaan panitia belum tersedia. Hubungi admin.",
        confirmButtonColor: "#667eea",
      });
      return;
    }

    const confirmText =
      status === "diterima"
        ? "Yakin ingin menyetujui panitia ini?"
        : "Yakin ingin menolak panitia ini?";

    const result = await Swal.fire({
      
      icon: "question",
      title: "Konfirmasi",
      text: confirmText,
      showCancelButton: true,
      confirmButtonColor: "#667eea",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await panitiaService.verifyPanitiaById(penerimaanId, status);
      setSelectedRow(null);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: res?.message || "Status berhasil diperbarui",
        confirmButtonColor: "#667eea",
      });
      
      fetchPanitia();
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        JSON.stringify(err?.response?.data) ||
        err.message;
      Swal.fire({
        icon: "error",
        title: "Verifikasi Gagal",
        text: serverMsg,
        confirmButtonColor: "#667eea",
      });
    }
  };

  // --- HANDLE HAPUS PANITIA ---
  const handleHapusPanitia = async (id) => {
    if (!id) {
      Swal.fire({
        icon: "warning",
        title: "ID Tidak Ditemukan",
        text: "ID panitia tidak ditemukan.",
        confirmButtonColor: "#667eea",
      });
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Hapus Panitia?",
      text: "Yakin ingin menghapus panitia ini? Data akan hilang permanen.",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#667eea",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await panitiaService.deletePanitiaById(id);
      Swal.fire({
        icon: "success",
        title: "Berhasil Dihapus!",
        text: res?.message || "Panitia berhasil dihapus",
        confirmButtonColor: "#667eea",
      });
      setSelectedRow(null);
      fetchPanitia();
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        JSON.stringify(err?.response?.data) ||
        err.message;
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus",
        text: serverMsg,
        confirmButtonColor: "#667eea",
      });
    }
  };

  // --- FILTER DATA ---
  const filteredData = panitia.filter(
    (p) =>
      (p.nama?.toLowerCase().includes(filterText.toLowerCase()) ||
        p.NIM?.toString().includes(filterText)) &&
      (filterDivisi === "" || p.divisi === filterDivisi) &&
      (filterAngkatan === "" || p.angkatan?.toString() === filterAngkatan)
  );

  // --- EXPORT KE EXCEL ---
  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Tidak Ada Data",
        text: "Tidak ada data untuk diekspor!",
        confirmButtonColor: "#667eea",
      });
      return;
    }

    const exportData = filteredData.map((p, index) => ({
      No: index + 1,
      Nama: p.nama || "-",
      NIM: p.NIM || "-",
      Angkatan: p.angkatan || "-",
      Kelas: p.kelas || "-",
      Divisi: p.divisi || "-",
      Status:
        p.status_penerimaan === "diterima"
          ? "Diterima"
          : p.status_penerimaan === "ditolak"
          ? "Ditolak"
          : "Menunggu",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Panitia");
    // Nama file sesuai pola: Data_Panitia_Inaugurasi.xlsx
    XLSX.writeFile(workbook, "Data_Panitia_Inaugurasi.xlsx");
  };

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <p>Loading data panitia...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Daftar Panitia</h1>
      <p className="mb-4">
        Berikut adalah daftar panitia inaugurasi yang sudah terdaftar.
      </p>

      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowFilterModal(true)}
            >
              <FaSort /> Filter
            </button>

            <button
              className="btn btn-success btn-sm"
              onClick={handleExportExcel}
            >
              <FaFileExcel /> Export Excel
            </button>
          </div>

          <input
            type="text"
            placeholder="Cari nama atau NIM..."
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setCurrentPage(1);
            }}
            className="form-control form-control-sm w-25"
          />
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped w-100">
              <thead className="thead-light">
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>NIM</th>
                  <th>Angkatan</th>
                  <th>Kelas</th>
                  <th>Divisi</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((row, index) => (
                    <tr key={row.id || index}>
                      <td>{indexOfFirst + index + 1}</td>
                      <td>{row.nama}</td>
                      <td>{row.NIM}</td>
                      <td>{row.angkatan}</td>
                      <td>{row.kelas}</td>
                      <td>{row.divisi}</td>
                      <td>
                        <span
                          className={`badge ${
                            row.status_penerimaan === "diterima"
                              ? "badge-success"
                              : row.status_penerimaan === "ditolak"
                              ? "badge-danger"
                              : "badge-warning"
                          }`}
                        >
                          {row.status_penerimaan || "Menunggu"}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => setSelectedRow(row)}
                        >
                          <FaEye /> Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination (style seperti peserta) */}
          {filteredData.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
              {/* Jumlah data per halaman */}
              <div className="d-flex align-items-center">
                <label
                  htmlFor="rowsPerPage"
                  className="me-2 mb-0 text-sm text-gray-700"
                >
                  Tampilkan
                </label>
                <select
                  id="rowsPerPage"
                  className="form-select form-select-sm w-auto"
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="ms-2 text-sm text-gray-700">
                  data per halaman
                </span>
              </div>

              {/* Info jumlah data */}
              <p className="mb-0 text-sm text-gray-600">
                Menampilkan {currentData.length} dari {filteredData.length} data
              </p>

              {/* Tombol pagination */}
              <nav>
                <ul className="pagination mb-0">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal &&
        createPortal(
          <div
            className="modal-overlay"
            onClick={() => setShowFilterModal(false)}
          >
            <div
              className="modal-content animate-bounceIn"
              onClick={(e) => e.stopPropagation()}
            >
              <span
                className="modal-close"
                onClick={() => setShowFilterModal(false)}
              >
                ✖
              </span>
              <h5 className="modal-header">Filter Panitia</h5>
              <div className="modal-details">
                <div className="mb-2">
                  <label>Divisi:</label>
                  <select
                    value={filterDivisi}
                    onChange={(e) => setFilterDivisi(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Semua Divisi</option>
                    {[...new Set(panitia.map((p) => p.divisi))].map((d) => (
                      <option key={d || "null-divisi"} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-2">
                  <label>Angkatan:</label>
                  <select
                    value={filterAngkatan}
                    onChange={(e) => setFilterAngkatan(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Semua Angkatan</option>
                    {[...new Set(panitia.map((p) => p.angkatan))].map((a) => (
                      <option key={String(a)} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowFilterModal(false)}
                >
                  Tutup
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowFilterModal(false)}
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Detail Modal */}
      {selectedRow &&
        createPortal(
          <div className="modal-overlay" onClick={() => setSelectedRow(null)}>
            <div
              className="modal-content animate-bounceIn"
              onClick={(e) => e.stopPropagation()}
            >
              <span
                className="modal-close"
                onClick={() => setSelectedRow(null)}
              >
                ✖
              </span>
              <h5 className="modal-header">Detail Panitia</h5>
              <div className="modal-details">
                <p>
                  <b>Nama:</b> {selectedRow.nama}
                </p>
                <p>
                  <b>NIM:</b> {selectedRow.NIM}
                </p>
                <p>
                  <b>Email:</b> {selectedRow.email}
                </p>
                <p>
                  <b>No WhatsApp:</b> {selectedRow.nomor_whatapp}
                </p>
                <p>
                  <b>Kelas:</b> {selectedRow.kelas}
                </p>
                <p>
                  <b>Angkatan:</b> {selectedRow.angkatan}
                </p>
                <p>
                  <b>Divisi:</b> {selectedRow.divisi}
                </p>
                <p>
                  <b>Status:</b>{" "}
                  <span
                    className={`badge ${
                      selectedRow.status_penerimaan === "diterima"
                        ? "badge-success"
                        : selectedRow.status_penerimaan === "ditolak"
                        ? "badge-danger"
                        : "badge-warning"
                    }`}
                  >
                    {selectedRow.status_penerimaan || "Menunggu"}
                  </span>
                </p>
              </div>

              <div className="mt-4 d-flex justify-content-center gap-3">
                <button
                  className="btn btn-success"
                  onClick={() =>
                    handleVerifikasi(selectedRow.penerimaan_id, "diterima")
                  }
                  disabled={selectedRow.status_penerimaan === "diterima"}
                >
                  ✅ Setujui
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleHapusPanitia(selectedRow.id)}
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
