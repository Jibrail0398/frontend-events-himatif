import React, { useEffect, useState } from "react";
import { FaEye, FaPlus } from "react-icons/fa";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import { toast, ToastContainer } from 'react-toastify';
import useDokumentasi from "../../../hooks/useDokumentasi";
import TableDokumentasi from "./TableDokumentasi";
import { Spinner } from "react-bootstrap";
import ModalAddDokumentasi from "./ModalAddDokumentasi";
import useEvent from "../../../hooks/useEvent";

export default function Dokumentasi() {
    const [showAddModal, setshowAddModal] = useState(false);
    
    const {loading, getAll, dokumentasiData, create,update,deletedata} = useDokumentasi()
    const { events } = useEvent();

    
    
    // State form input
    const [formData, setFormData] = useState({
        nama_dokumentasi: "",
        judul: "",
        deskripsi: "",
        link_drive: "",
        event_id: "",
    });

    const handleFormChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const handleCloseModal = () => {
        setshowAddModal(false);
        resetForm();
    };

    const handleFormSubmit = async(e) => {
        e.preventDefault();

        if (
            !formData.nama_dokumentasi ||
            !formData.judul ||
            !formData.link_drive ||
            !formData.event_id
        ) {
            toast.error('Harap isi semua field!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        try {
            await create(formData);
            Swal.fire("Berhasil!", "Link Sertifikat berhasil ditambahkan", "success");
            
            
            resetForm();
            
            
            getAll();
            
        } catch (error) {
            console.error("Error creating sertifikat:", error);
            toast.error('Gagal menambahkan sertifikat!', {
                position: "top-right",
                autoClose: 3000,
            });
        }
        setshowAddModal(false);
    };

    const resetForm = ()=>{
        setFormData({
            nama_dokumentasi: "",
            judul: "",
            deskripsi: "",
            link_drive: "",
            event_id: "",
        });
    }
    const handleAddNew = ()=>{
        resetForm();
        setshowAddModal(true);
    }
    
    useEffect(()=>{
        getAll();
        
    },[])

    return (
        <div className="container-fluid">
            <ToastContainer 
                style={{
                    zIndex: 99999
                }}
                toastStyle={{
                    zIndex: 99999
                }}
            />
        <h1 className="h3 mb-2 text-gray-800">Dokumentasi Kegiatan</h1>
        <p className="mb-4">
            Berikut adalah daftar dokumentasi kegiatan.
        </p>

            {/* Card Table */}
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex justify-content-between">
                    
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={handleAddNew}
                        
                    >
                        <FaPlus /> Tambah Dokumentasi
                    </button>
                </div>
                
                {/* TabelDokumentasi  */}
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                   <TableDokumentasi 
                    Dokumentasi={dokumentasiData} 
                    loading={loading} 
                    onEdit={update}
                    onDelete={deletedata}
                    
                />
                )}
                
            </div>
            <ModalAddDokumentasi
                showModal={showAddModal}
                loading={loading} 
                title = "Tambah Dokumentasi"  
                onChange={handleFormChange}
                onSubmit={handleFormSubmit}
                formData={formData}
                events={events}
                onClose={handleCloseModal}
            />
        
        </div>
    );
}