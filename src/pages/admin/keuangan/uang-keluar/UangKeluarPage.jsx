import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

import useUangKeluar from "../../../../hooks/useUangKeluar";
import CardInfo from "../../../../components/CardInfo";
import TableUangKeluar from "./TableUangKeluar";
import AddModal from "./AddModalPengeluaran";
import DetailModal from "./DetailModal";
import BuktiModal from "./BuktiModal";
import EditModal from "./EditModal";
import { formatCurrency } from "../../../../helpers/currencyHelper";
import { formatDateID } from "../../../../helpers/dateHelper";
import AddModalPengeluaran from "./AddModalPengeluaran";

const UangKeluarPage = () => {
    const { loading, uangKeluar, create, deleteById, getAll, update } = useUangKeluar();

    // State modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showBuktiModal, setShowBuktiModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // State data tunggal
    const [selectedUangKeluar, setSelectedUangKeluar] = useState(null);

    /** 📦 Tambah Data */
    const handleAdd = async (dataRequest) => {
        try {
            await create(dataRequest);
            Swal.fire("Berhasil!", "Uang keluar berhasil ditambahkan", "success");
        } catch (err) {
            console.error(err);
            Swal.fire("Gagal!", "Terjadi kesalahan saat menambahkan data", "error");
            throw err; // biar error-nya tetap dikirim ke modal (untuk validasi form)
        }
    };

    /** 🗑️ Hapus Data */
    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: "Hapus Uang Keluar?",
            text: `Apakah Anda yakin ingin menghapus data #${item.id}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
        });

        if (!result.isConfirmed) return;

        try {
            await deleteById(item.id);
            getAll();
            Swal.fire("Dihapus!", "Data uang keluar berhasil dihapus", "success");
        } catch (err) {
            Swal.fire("Gagal!", "Tidak dapat menghapus data", "error");
        }
    };

    /** ✏️ Edit */
    const handleEdit = (item) => {
        setSelectedUangKeluar(item);
        setShowEditModal(true);
    };

    const handleUpdate = async (id, data) => {
        try {
            return await update(id, data);
        } catch (err) {
            throw err;
        } finally {
            getAll();
        }
    };

    /** 🔍 Detail */
    const handleDetail = (item) => {
        setSelectedUangKeluar(item);
        setShowDetailModal(true);
    };

    /** 🖼️ Lihat Bukti */
    const handleShowBukti = (item) => {
        setSelectedUangKeluar(item);
        setShowBuktiModal(true);
    };

    const totalUangKeluar = uangKeluar.reduce((acc, curr) => acc + curr.jumlah_pengeluaran, 0);

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Uang Keluar</h1>
            </div>

            <div className="row mb-4">
                <CardInfo type="danger" title="Total Uang Keluar" value={formatCurrency(totalUangKeluar)} icon="fa-arrow-up" />
                <CardInfo type="info" title="Jumlah Data" value={uangKeluar.length} icon="fa-database" />
            </div>

            <div className="card shadow p-3">
                <div className="mb-3 text-end">
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        Tambah Uang Keluar
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <TableUangKeluar uangKeluar={uangKeluar} handleDelete={handleDelete} handleEdit={handleEdit} handleDetail={handleDetail} handleShowBukti={handleShowBukti} formatDateID={formatDateID} />
                )}
            </div>

            {/* 🔹 Modal Section */}
            <AddModalPengeluaran show={showAddModal} setShow={setShowAddModal} handleAdd={handleAdd} />
            <DetailModal show={showDetailModal} setShow={setShowDetailModal} uangKeluar={selectedUangKeluar} />
            <BuktiModal show={showBuktiModal} setShow={setShowBuktiModal} uangKeluar={selectedUangKeluar} />
            <EditModal show={showEditModal} setShow={setShowEditModal} selectedData={selectedUangKeluar} handleUpdate={handleUpdate} />
        </>
    );
};

export default UangKeluarPage;
