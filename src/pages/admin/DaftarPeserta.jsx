import React, { useState, useEffect,useCallback } from "react";
import { FaEye, FaSort, FaFileExcel } from "react-icons/fa";
import { createPortal } from "react-dom";
import * as pesertaService from "../../services/persertaService";
import * as XLSX from "xlsx";

export default function DaftarPeserta() {
    const [peserta, setPeserta] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filterText, setFilterText] = useState("");    
    const [filterAngkatan, setFilterAngkatan] = useState("");
    const [filterKelas, setFilterKelas] = useState("");
    const [filterVerifikasi, setFilterVerifikasi] = useState("");

    const [selectedRow, setSelectedRow] = useState(null);
    const [showFilterModal, setShowFilterModal] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // --- Ambil peserta
    const fetchPeserta = useCallback(async () => {
        try {
            setLoading(true);
            const response = await pesertaService.getAll();
            const data = response.data; 

            // Optimasi: Gunakan transformasi yang lebih efisien
            const pesertaWithStatus = data.map((p) => ({
                ...p,
                latestPenerimaan: p.penerimaan_peserta || null,
                penerimaan_id: p.penerimaan_peserta?.id || null,
                status_pembayaran: p.penerimaan_peserta?.status_pembayaran || "belum lunas",
            }));

            setPeserta(pesertaWithStatus);
        } catch (err) {
            console.error("Gagal memuat data:", err);
            setError("Gagal memuat data peserta");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPeserta();
    }, []);

    // --- Verifikasi peserta
    const handleVerifikasi = async (penerimaanId) => {
        if (!penerimaanId) return alert("⚠️ Data penerimaan peserta belum tersedia.");

        try {
            if (!window.confirm("Yakin ingin memverifikasi peserta ini?")) return;

            await pesertaService.verifyById(penerimaanId);
            alert("✅ Status peserta berhasil diperbarui");
            setSelectedRow(null);
            fetchPeserta();
        } catch (err) {
            console.error("❌ Terjadi kesalahan saat verifikasi:", err);
            alert("❌ Terjadi kesalahan saat verifikasi peserta");
        }
    };

    // --- Filter peserta
    const filteredData = peserta.filter((p) => {
        const status = p.status_pembayaran ?? "belum lunas";
        return (
            (p.nama?.toLowerCase().includes(filterText.toLowerCase()) ||
                p.NIM?.toString().includes(filterText)) &&
            (filterAngkatan === "" || p.angkatan?.toString() === filterAngkatan) &&
            (filterKelas === "" || p.kelas === filterKelas) &&
            (filterVerifikasi === "" ||
                (filterVerifikasi === "1" ? status === "lunas" : status !== "lunas"))
        );
    });

    // --- Pagination logic
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
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

    // --- Export ke Excel
    const handleExportExcel = () => {
        if (filteredData.length === 0) {
            alert("⚠️ Tidak ada data untuk diekspor!");
            return;
        }

        const exportData = filteredData.map((p, index) => ({
            No: index + 1,
            Nama: p.nama,
            NIM: p.NIM,
            Angkatan: p.angkatan,
            Kelas: p.kelas,
            
            Status: p.status_pembayaran === "lunas" ? "Terverifikasi" : "Belum Diverifikasi",
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Peserta");
        XLSX.writeFile(workbook, "Data_Peserta_Inaugurasi.xlsx");
    };

    if (loading) return <p>Loading data peserta...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">Daftar Peserta</h1>
            <p className="mb-4">Berikut adalah daftar peserta inaugurasi yang sudah terdaftar.</p>

            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setShowFilterModal(true)}
                        >
                            <FaSort /> Filter
                        </button>

                        <button className="btn btn-success btn-sm" onClick={handleExportExcel}>
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
                            <thead className="thead-light text-center">
                                <tr>
                                    <th style={{ width: "50px" }}>No</th>
                                    <th>Nama</th>
                                    <th>NIM</th>
                                    <th>Angkatan</th>
                                    <th>Kelas</th>
                                    
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="align-middle text-center">
                                {currentData.length > 0 ? (
                                    currentData.map((row, index) => (
                                        <tr key={row.id}>
                                            <td>{indexOfFirst + index + 1}</td>
                                            <td className="text-start">{row.nama}</td>
                                            <td>{row.NIM}</td>
                                            <td>{row.angkatan}</td>
                                            <td>{row.kelas}</td>
                                            
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        row.status_pembayaran === "lunas"
                                                            ? "badge-success"
                                                            : "badge-warning"
                                                    }`}
                                                >
                                                    {row.status_pembayaran === "lunas"
                                                        ? "Terverifikasi"
                                                        : "Belum Diverifikasi"}
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
                                            Tidak ada data
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination + Rows per page */}
                    {filteredData.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                            <div className="d-flex align-items-center">
                                <label htmlFor="rowsPerPage" className="me-2 mb-0 text-sm text-gray-700">
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
                                <span className="ms-2 text-sm text-gray-700">data per halaman</span>
                            </div>

                            <p className="mb-0 text-sm text-gray-600">
                                Menampilkan {currentData.length} dari {filteredData.length} data
                            </p>

                            <nav>
                                <ul className="pagination mb-0">
                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
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
                                            className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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
                    <div className="modal-overlay" onClick={() => setShowFilterModal(false)}>
                        <div
                            className="modal-content animate-bounceIn"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="modal-close" onClick={() => setShowFilterModal(false)}>
                                ✖
                            </span>
                            <h5 className="modal-header">Filter Peserta</h5>
                            <div className="modal-details">
                            
                                <div className="mb-2">
                                    <label>Angkatan:</label>
                                    <select
                                        value={filterAngkatan}
                                        onChange={(e) => setFilterAngkatan(e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="">Semua Angkatan</option>
                                        {[...new Set(peserta.map((p) => p.angkatan))].map((a) => (
                                            <option key={a} value={a}>
                                                {a}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-2">
                                    <label>Kelas:</label>
                                    <select
                                        value={filterKelas}
                                        onChange={(e) => setFilterKelas(e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="">Semua Kelas</option>
                                        {[...new Set(peserta.map((p) => p.kelas))].map((k) => (
                                            <option key={k} value={k}>
                                                {k}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-2">
                                    <label>Status:</label>
                                    <select
                                        value={filterVerifikasi}
                                        onChange={(e) => setFilterVerifikasi(e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="">Semua</option>
                                        <option value="1">Terverifikasi</option>
                                        <option value="0">Belum Diverifikasi</option>
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
                            <span className="modal-close" onClick={() => setSelectedRow(null)}>
                                ✖
                            </span>
                            <h5 className="modal-header">Detail Peserta</h5>
                            <div className="modal-details">
                                <p><b>Kode Peserta:</b> {selectedRow.kode_peserta}</p>
                                <p><b>Nama:</b> {selectedRow.nama}</p>
                                <p><b>NIM:</b> {selectedRow.NIM}</p>
                                <p><b>Email:</b> {selectedRow.email || "-"}</p>
                                <p><b>Nomor WhatsApp:</b> {selectedRow.nomor_whatapp}</p>
                                <p><b>Angkatan:</b> {selectedRow.angkatan}</p>
                                <p><b>Kelas:</b> {selectedRow.kelas}</p>
                                <p><b>Tanggal Lahir:</b> {selectedRow.tanggal_lahir}</p>
                                <p><b>Ukuran Kaos:</b> {selectedRow.ukuran_kaos}</p>
                                <p><b>Nomor Darurat:</b> {selectedRow.nomor_darurat}</p>
                                <p><b>Tipe Nomor Darurat:</b> {selectedRow.tipe_nomor_darurat}</p>
                                <p><b>Riwayat Penyakit:</b> {selectedRow.riwayat_penyakit}</p>
                                
                                <p>
                                    <b>Status:</b>{" "}
                                    <span
                                        className={`badge ${
                                            selectedRow.status_pembayaran === "lunas"
                                                ? "badge-success"
                                                : "badge-warning"
                                        }`}
                                    >
                                        {selectedRow.status_pembayaran === "lunas"
                                            ? "Terverifikasi"
                                            : "Belum Diverifikasi"}
                                    </span>
                                </p>

                                {selectedRow.bukti_pembayaran ? (
                                    <div className="mt-3 text-center">
                                        <p><b>Bukti Pembayaran:</b></p>
                                        <img
                                            src={selectedRow.bukti_pembayaran}
                                            alt="Bukti Pembayaran"
                                            className="img-fluid rounded shadow-sm"
                                            style={{ maxHeight: "300px", objectFit: "contain" }}
                                        />
                                    </div>
                                ) : (
                                    <p className="text-center text-muted">
                                        Tidak ada bukti pembayaran.
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 d-flex justify-content-center gap-3">
                                {selectedRow.status_pembayaran !== "lunas" && (
                                    <button
                                        className="btn btn-success"
                                        onClick={() =>
                                            handleVerifikasi(selectedRow.penerimaan_id)
                                        }
                                    >
                                        ✅ Verifikasi
                                    </button>
                                )}
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
