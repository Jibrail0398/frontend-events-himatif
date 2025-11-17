import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import useSertifikat from "../../../hooks/useSertifikat";
import Swal from "sweetalert2";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useEvent from "../../../hooks/useEvent";
import TableSertifikat from "./TableSertifikat";
import { Spinner } from "react-bootstrap";
import ModalAddSertifikat from "./ModalAddSertifikat";


export default function FormSertifikat() {
    
    const [showAddModal, setshowAddModal] = useState(false);
    
    const { loading, getAll, certificateData, create,update,deletedata } = useSertifikat();
    const { events } = useEvent();


    const [formData, setFormData] = useState({
        nama_sertifikat: "",
        jenis_sertifikat: "",
        link_drive: "",
        event_id: "",
    });

    
    useEffect(() => {
        getAll();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.nama_sertifikat ||
            !formData.jenis_sertifikat ||
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

    
    const resetForm = () => {
        setFormData({
            nama_sertifikat: "",
            jenis_sertifikat: "",
            link_drive: "",
            event_id: "",
        });
        
        
    };

    
    const handleCloseModal = () => {
        setshowAddModal(false);
        resetForm();
    };


    
    const handleAddNew = () => {
        resetForm();
        setshowAddModal(true);
    };

    return (
        <div className="container-fluid">
            <div className="container-fluid">
                <ToastContainer 
                    style={{
                        zIndex: 99999
                    }}
                    toastStyle={{
                        zIndex: 99999
                    }}
                />
            </div>
            <h1 className="h3 mb-2 text-gray-800">Form Sertifikat</h1>
            <p className="mb-4">
                Berikut adalah daftar sertifikat kegiatan inaugurasi.
            </p>

            
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex justify-content-between">
                    
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={handleAddNew}
                    >
                        <FaPlus /> Tambah Sertifikat
                    </button>
                </div>
                
                {/* TabelSertifikat  */}
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                   <TableSertifikat 
                    Sertifikat={certificateData} 
                    loading={loading}   
                    onEdit={update}
                    onDelete={deletedata}
                    
                    
                />
                )}
                
            </div>

            {/* ModalAddSertifikat */}
            <ModalAddSertifikat
                showModal={showAddModal}
                onClose={handleCloseModal}
                title='Tambah Sertifikat'
                formData={formData}
                events={events}
                onSubmit={handleFormSubmit}
                onChange={handleFormChange}
                loading={loading} 
            />

            
            
            
        </div>
    );
}