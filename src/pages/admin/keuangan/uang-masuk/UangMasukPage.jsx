import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

import useUangMasuk from "../../../../hooks/useUangMasuk";
import CardInfo from "../../../../components/CardInfo";
import TableUangMasuk from "./TableUangMasuk";
import AddModal from "./AddModal";
import DetailModal from "./DetailModal";
import BuktiModal from "./BuktiModal";
import { formatCurrency } from "../../../../helpers/currencyHelper";
import { formatDateID } from "../../../../helpers/dateHelper";
import EditModal from "./EditModal";

const UangMasukPage = () => {
    const { loading, uangMasuk, create, deleteById, getAll, update } = useUangMasuk();

    // State modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showBuktiModal, setShowBuktiModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // State data tunggal
    const [selectedUangMasuk, setSelectedUangMasuk] = useState(null);

    /** 📦 Tambah Data */
    const handleAdd = async (dataRequest) => {
        try {
            await create(dataRequest);
            Swal.fire("Berhasil!", "Uang masuk berhasil ditambahkan", "success");
        } catch (err) {
            console.error(err);
            Swal.fire("Gagal!", "Terjadi kesalahan saat menambahkan data", "error");
            throw err; // biar error-nya tetap dikirim ke modal (untuk validasi form)
        }
    };

    /** 🗑️ Hapus Data */
    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: "Hapus Uang Masuk?",
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
            Swal.fire("Dihapus!", "Data uang masuk berhasil dihapus", "success");
        } catch (err) {
            Swal.fire("Gagal!", "Tidak dapat menghapus data", "error");
        }
    };

    /** ✏️ Edit */
    const handleEdit = (item) => {
        setSelectedUangMasuk(item);
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
        setSelectedUangMasuk(item);
        setShowDetailModal(true);
    };

    /** 🖼️ Lihat Bukti */
    const handleShowBukti = (item) => {
        setSelectedUangMasuk(item);
        setShowBuktiModal(true);
    };

    const totalUangMasuk = uangMasuk.reduce((acc, curr) => acc + curr.jumlah_uang_masuk, 0);

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Uang Masuk</h1>
            </div>

            <div className="row mb-4">
                <CardInfo type="success" title="Total Uang Masuk" value={formatCurrency(totalUangMasuk)} icon="fa-dollar-sign" />
                <CardInfo type="info" title="Jumlah Data" value={uangMasuk.length} icon="fa-database" />
            </div>

            <div className="card shadow p-3">
                <div className="mb-3 text-end">
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        Tambah Uang Masuk
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <TableUangMasuk uangMasuk={uangMasuk} handleDelete={handleDelete} handleEdit={handleEdit} handleDetail={handleDetail} handleShowBukti={handleShowBukti} formatDateID={formatDateID} />
                )}
            </div>

            {/* 🔹 Modal Section */}
            <AddModal show={showAddModal} setShow={setShowAddModal} handleAdd={handleAdd} />
            <DetailModal show={showDetailModal} setShow={setShowDetailModal} uangMasuk={selectedUangMasuk} />
            <BuktiModal show={showBuktiModal} setShow={setShowBuktiModal} uangMasuk={selectedUangMasuk} />
            <EditModal show={showEditModal} setShow={setShowEditModal} selectedData={selectedUangMasuk} handleUpdate={handleUpdate} />
        </>
    );
};

export default UangMasukPage;
