import React from 'react'
import TableSearch from "../../../components/TableSearch";
import { ButtonGroup, Button } from "react-bootstrap";
import { useState } from "react";
import ModalEditDokumentasi from './ModalEditDokumentasi';
import Swal from "sweetalert2";


const TableDokumentasi = (
    {
        Dokumentasi,
        loading,
        onEdit,
        onDelete
    }
) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});

    const handleSelectedRow = (dokumentasi) => {
        setSelectedRow(dokumentasi);
        
        setShowModal(true);
        

    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRow(null);
    };
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Anda akan menghapus dokumentasi ini?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await onDelete(id);
                Swal.fire('Terhapus!', 'Data dokumentasi berhasil dihapus.', 'success');
            } catch (error) {
                let errorMessage = "Data Dokumentasi Gagal dihapus";
                if(error.response){
                    let {data} = error.response;
                    if(data?.error){
                        errorMessage = data.error;
                    }
                }
                Swal.fire('Gagal Terhapus!', errorMessage, 'error');
            }
        }
    };
  return (
    <>
        <TableSearch
            defaultOrder={{ column: 0, order: "asc" }}
            className="mt-4"
            header={["ID", "Nama", "Judul","Link","Event","Deskripsi", "Aksi"].map((text, i) => (
                <th key={i}>{text}</th>
            ))}
            body={Dokumentasi.map((item)=>(
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.nama_dokumentasi}</td>
                    <td>{item.judul}</td>
                    
                    <td>
                        <a
                        href={item.link_drive}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Link Drive
                        </a>
                    </td>
                    <td>{item.event.nama_event}</td>
                    <td>{item.deskripsi}</td>
                    <td>
                        <ButtonGroup size="sm">
                            <Button variant="danger" onClick={()=>handleDelete(item.id)} >
                                <i className="fas fa-trash"></i>
                            </Button>
                            <Button variant="primary" onClick={()=>handleSelectedRow(item)} >
                                <i className="fas fa-edit"></i>
                            </Button>
                            
                        </ButtonGroup>
                    </td>
                    
                </tr>
            ))}
            
        >
            
        </TableSearch>
        <ModalEditDokumentasi
            onEdit={onEdit}
            loading={loading}
            show={showModal}
            onClose={handleCloseModal}
            selectedRow={selectedRow}
        />
    </>
  )
}

export default TableDokumentasi