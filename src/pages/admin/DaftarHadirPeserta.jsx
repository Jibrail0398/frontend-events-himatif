import React, { useEffect, useState,useMemo } from "react";
import useDaftarHadir from "../../hooks/useDaftarHadir";
import { FaEye, FaSort, FaFileExcel } from "react-icons/fa";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import useEvent from "../../hooks/useEvent";
import * as XLSX from "xlsx";


export default function DaftarHadirPeserta() {
    const [selectedRow, setSelectedRow] = useState(null);
    const [showFilterModal, setShowFilterModal] = useState(false);

    const [filterText, setFilterText] = useState("");
    const [filterEvent, setFilterEvents] = useState("");
    

    // 🔹 Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    //Ambil store daftar hadir
    const {loading,peserta,getAll} = useDaftarHadir();

    //Ambil store event
    const {events,getPublicEvents} = useEvent();
    

    useEffect(()=>{
        getAll();
        getPublicEvents();

        
        
    },[]);

    const filteredData = useMemo(() => {
        if (!peserta) return [];

        return peserta.filter((p) => {
            const nama = p?.nama.toLowerCase()??"";
            const nim = p?.NIM??"";

            const matchText =
                nama.includes(filterText.toLowerCase()) ||
                nim.includes(filterText);

            
            const matchEvent = filterEvent === "" || 
                p.event_id?.toString() === filterEvent.toString();


            return matchText && matchEvent ;
        });
    }, [peserta, filterText, filterEvent]);
    

    

    // 🔹 Pagination logic
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

    // 🔹 Ganti halaman
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
            NIM: p.NIM,
            Email: p.email,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Hadir Peserta");

        // Auto width columns
        const colWidths = Object.keys(exportData[0]).map((key) => ({
            wch: Math.max(
                key.length,
                ...exportData.map((row) => String(row[key] || "").length)
            ) + 2,
        }));
        worksheet["!cols"] = colWidths;

        const fileName = `Daftar_Hadir_Peserta_${new Date()
            .toLocaleDateString("id-ID")
            .replace(/\//g, "-")}.xlsx`;

        XLSX.writeFile(workbook, fileName);

        Swal.fire("✅", "Data berhasil diekspor ke Excel!", "success");
    };

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">Daftar Kehadiran Peserta</h1>
            <p className="mb-4">Berikut adalah daftar kehadiran peserta inaugurasi.</p>

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
                                            <th>Email</th>
                                            <th>NIM</th>
                                            
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.length > 0 ? (
                                            currentData.map((row, index) => (
                                                <tr key={row.id}>
                                                    <td>{startIndex + index + 1}</td>
                                                    <td>{row.nama}</td>
                                                    <td>{row.email}</td>
                                                    <td>{row.NIM}</td>
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

                            {/* Pagination */}
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

                                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
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

            {/* Modal Filter dan Modal Detail tetap sama */}
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

                            <h5 className="modal-header">Filter Kehadiran</h5>
                            <div className="modal-details">
                                <div className="mb-2">
                                    <label>Events</label>
                                    <select
                                        value={filterEvent}
                                        onChange={(e) => setFilterEvents(e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="">Tampilkan Semua</option>
                                        {events.map((event)=>(
                                            <option key={event.id} value={event.id}>{event.nama_event}</option>
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

                            <h5 className="modal-header">Detail Kehadiran Peserta</h5>
                            <div className="modal-details">
                                <p><b>Nama:</b> {selectedRow.nama}</p>
                                <p><b>Prodi:</b> {selectedRow.program_studi}</p>
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
                                                ? "text-success font-weight-bold"
                                                : selectedRow.kehadiran === "Tidak Hadir"
                                                ? "text-danger font-weight-bold"
                                                : "text-warning font-weight-bold"
                                        }
                                    >
                                        {selectedRow.kehadiran}
                                    </span>
                                </p>
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