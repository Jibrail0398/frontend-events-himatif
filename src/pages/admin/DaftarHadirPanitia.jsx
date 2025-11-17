import React, { useEffect, useState } from "react";
import { FaEye, FaSort, FaFileExcel } from "react-icons/fa";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import {
    getDaftarHadirPanitia,
    updatePresensiPanitia,
} from "../../services/presensiService";

export default function DaftarKehadiran() {
    const [selectedRow, setSelectedRow] = useState(null);
    const [showFilterModal, setShowFilterModal] = useState(false);

    const [filterText, setFilterText] = useState("");
    const [filterDivisi, setFilterDivisi] = useState("");
    const [filterAngkatan, setFilterAngkatan] = useState("");
    const [filterKehadiran, setFilterKehadiran] = useState("");

    const [panitia, setPanitia] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("❌ Token tidak ditemukan di localStorage!");
                    setLoading(false);
                    return;
                }

                const response = await getDaftarHadirPanitia(token);
                console.log("✅ Data panitia diterima (API):", response);

                const data = Array.isArray(response)
                    ? response
                    : response?.data ?? [];

                const formatted = data.map((item, index) => {
                    const penerimaan = item.penerimaan_panitia || {};
                    const p = penerimaan.pendaftar_panitia || {};
                    return {
                        id: item.id ?? index + 1,
                        nama: p.nama ?? "-",
                        nim: p.NIM ?? p.nim ?? "-",
                        divisi: p.divisi ?? "-",
                        angkatan: p.angkatan ?? "-",
                        kelas: p.kelas ?? "-",
                        email: p.email ?? "-",
                        event: p.event?.nama_event ?? "-",
                        kehadiran: item.presensi_datang
                            ? item.presensi_datang === "hadir"
                                ? "Hadir"
                                : "Tidak Hadir"
                            : "Belum Absen",
                        waktu_presensi:
                            item.waktu_presensi_datang ?? item.created_at ?? null,
                    };
                });

                setPanitia(formatted);
            } catch (err) {
                console.error("⚠️ Gagal memuat data panitia:", err);
                setPanitia([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // ✅ Update presensi panitia ke backend
    const handleKehadiranChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                Swal.fire("Error", "Token tidak ditemukan di localStorage!", "error");
                return;
            }

            const response = await updatePresensiPanitia(
                token,
                id,
                newStatus.toLowerCase()
            );
            console.log("✅ Presensi panitia berhasil diperbarui:", response);

            setPanitia((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, kehadiran: newStatus } : p
                )
            );
            setSelectedRow((prev) => ({ ...prev, kehadiran: newStatus }));

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: `Status kehadiran diubah menjadi ${newStatus}.`,
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error("❌ Gagal memperbarui presensi panitia:", err);
            Swal.fire("Error", "Gagal memperbarui presensi panitia!", "error");
        }
    };

    // 🔹 Filter pencarian
    const filteredData = panitia.filter((p) => {
        const matchText =
            p.nama.toLowerCase().includes(filterText.toLowerCase()) ||
            String(p.nim).includes(filterText);
        const matchDivisi = filterDivisi === "" || p.divisi === filterDivisi;
        const matchAngkatan =
            filterAngkatan === "" ||
            String(p.angkatan) === String(filterAngkatan);
        const matchKehadiran =
            filterKehadiran === "" || p.kehadiran === filterKehadiran;
        return matchText && matchDivisi && matchAngkatan && matchKehadiran;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentData = filteredData.slice(indexOfFirst, indexOfLast);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    // ✅ Export ke Excel
    const handleExportExcel = () => {
        if (filteredData.length === 0) {
            Swal.fire("⚠️", "Tidak ada data untuk diekspor!", "warning");
            return;
        }

        const exportData = filteredData.map((p, index) => ({
            No: index + 1,
            Nama: p.nama,
            NIM: p.nim,
            Divisi: p.divisi,
            Angkatan: p.angkatan,
            Kelas: p.kelas,
            Email: p.email,
            Event: p.event,
            Kehadiran: p.kehadiran,
            "Waktu Presensi": p.waktu_presensi
                ? new Date(p.waktu_presensi).toLocaleString("id-ID")
                : "-",
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Kehadiran Panitia");

        // Auto-width kolom
        const colWidths = Object.keys(exportData[0]).map((key) => ({
            wch: Math.max(
                key.length,
                ...exportData.map((row) => String(row[key] || "").length)
            ) + 2,
        }));
        worksheet["!cols"] = colWidths;

        const fileName = `Daftar_Kehadiran_Panitia_${new Date()
            .toLocaleDateString("id-ID")
            .replace(/\//g, "-")}.xlsx`;

        XLSX.writeFile(workbook, fileName);

        Swal.fire("✅", "Data berhasil diekspor ke Excel!", "success");
    };

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">Daftar Kehadiran Panitia</h1>
            <p className="mb-4">Berikut adalah daftar kehadiran panitia inaugurasi.</p>

            {/* Card Table */}
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex justify-content-between align-items-center">
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
                        onChange={(e) => setFilterText(e.target.value)}
                        className="form-control form-control-sm w-25"
                    />
                </div>

                <div className="card-body">
                    {loading ? (
                        <p className="text-center">Memuat data...</p>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped w-100 mb-0">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>No</th>
                                            <th>Nama</th>
                                            <th>Divisi</th>
                                            <th>Angkatan</th>
                                            <th>NIM</th>
                                            <th>Kelas</th>
                                            <th>Kehadiran</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.length > 0 ? (
                                            currentData.map((row, index) => (
                                                <tr key={row.id}>
                                                    <td>
                                                        {(currentPage - 1) * rowsPerPage + index + 1}
                                                    </td>
                                                    <td>{row.nama}</td>
                                                    <td>{row.divisi}</td>
                                                    <td>{row.angkatan}</td>
                                                    <td>{row.nim}</td>
                                                    <td>{row.kelas}</td>
                                                    <td>
                                                        <span
                                                            className={`badge ${
                                                                row.kehadiran === "Hadir"
                                                                    ? "bg-success"
                                                                    : row.kehadiran === "Tidak Hadir"
                                                                    ? "bg-danger"
                                                                    : "bg-warning text-dark"
                                                            }`}
                                                        >
                                                            {row.kehadiran}
                                                        </span>
                                                    </td>
                                                    <td>
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
                                                    Tidak ada data ditemukan
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination + Rows per page */}
                            {filteredData.length > 0 && (
                                <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
                                    <div className="d-flex align-items-center mb-2 mb-md-0">
                                        <label htmlFor="rowsPerPage" className="me-2 mb-0">
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
                                        <span className="ms-2">data per halaman</span>
                                    </div>

                                    <p className="mb-2 mb-md-0">
                                        Menampilkan {currentData.length} dari {filteredData.length} data
                                    </p>

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
                        </>
                    )}
                </div>
            </div>

            {/* Filter Modal */}
            {showFilterModal &&
                createPortal(
                    <div className="modal-overlay" onClick={() => setShowFilterModal(false)}>
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

                            <h5 className="modal-header">Filter Kehadiran Panitia</h5>
                            <div className="modal-details">
                                <div className="mb-2">
                                    <label>Divisi:</label>
                                    <select
                                        value={filterDivisi}
                                        onChange={(e) => setFilterDivisi(e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="">Semua Divisi</option>
                                        <option value="Konsumsi">Konsumsi</option>
                                        <option value="Perlengkapan">Perlengkapan</option>
                                        <option value="Acara">Acara</option>
                                        <option value="Keamanan">Keamanan</option>
                                        <option value="Medis">Medis</option>
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
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                    </select>
                                </div>

                                <div className="mb-2">
                                    <label>Status Kehadiran:</label>
                                    <select
                                        value={filterKehadiran}
                                        onChange={(e) => setFilterKehadiran(e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="">Semua</option>
                                        <option value="Hadir">Hadir</option>
                                        <option value="Tidak Hadir">Tidak Hadir</option>
                                        <option value="Belum Absen">Belum Absen</option>
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

                            <h5 className="modal-header">Detail Kehadiran Panitia</h5>

                            <div className="modal-details">
                                <p><b>Nama:</b> {selectedRow.nama}</p>
                                <p><b>Divisi:</b> {selectedRow.divisi}</p>
                                <p><b>Angkatan:</b> {selectedRow.angkatan}</p>
                                <p><b>NIM:</b> {selectedRow.nim}</p>
                                <p><b>Kelas:</b> {selectedRow.kelas}</p>
                                <p><b>Email:</b> {selectedRow.email}</p>
                                <p><b>Event:</b> {selectedRow.event}</p>
                                <p>
                                    <b>Status Kehadiran:</b>{" "}
                                    <span
                                        className={
                                            selectedRow.kehadiran === "Hadir"
                                                ? "text-success fw-bold"
                                                : selectedRow.kehadiran === "Tidak Hadir"
                                                ? "text-danger fw-bold"
                                                : "text-warning fw-bold"
                                        }
                                    >
                                        {selectedRow.kehadiran}
                                    </span>
                                </p>
                            </div>

                            <div className="mt-4 d-flex justify-content-center gap-2">
                                <button
                                    className="btn btn-success"
                                    onClick={() =>
                                        handleKehadiranChange(selectedRow.id, "Hadir")
                                    }
                                >
                                    Tandai Hadir
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                        handleKehadiranChange(selectedRow.id, "Tidak Hadir")
                                    }
                                >
                                    Tandai Tidak Hadir
                                </button>
                            </div>

                            <div className="mt-3 text-center">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedRow(null)}
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}