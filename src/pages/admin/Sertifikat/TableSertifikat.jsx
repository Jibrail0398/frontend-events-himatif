import TableSearch from "../../../components/TableSearch";
import { ButtonGroup, Button } from "react-bootstrap";
import { useState } from "react";
import ModalEditSertifikat from "./ModalEditSertifikat";
import Swal from "sweetalert2";


const TableSertifikat = ({
    Sertifikat,
    loading,
    onEdit,
    onDelete

})=>{


    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    

    const handleSelectedRow = (sertifikat) => {
        setSelectedRow({
            nama_sertifikat: sertifikat.nama_sertifikat,
            jenis_sertifikat: sertifikat.jenis_sertifikat,
            link_drive: sertifikat.link_drive,
            event_id: sertifikat.id
        });
        
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRow(null);
    };

    // Fungsi untuk handle delete
    const handleDelete = async (sertifikat) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Anda akan menghapus ${sertifikat.nama_sertifikat}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await onDelete(sertifikat.id);
                Swal.fire('Terhapus!', 'Sertifikat berhasil dihapus.', 'success');
            } catch (error) {
                let errorMessage = "Sertifikat Gagal dihapus";
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

    return(
        <>
        
        {/* Edit Modal */}
        <TableSearch
            defaultOrder={{ column: 0, order: "desc" }}
            className="mt-4"
            header={["ID", "Nama", "Jenis", "Link","Event", "Aksi"].map((text, i) => (
                <th key={i}>{text}</th>
            ))}
            body={Sertifikat.map((item)=>(
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.nama_sertifikat}</td>
                    <td>{item.jenis_sertifikat}</td>
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
                    <td>
                        <ButtonGroup size="sm">
                            <Button variant="danger" onClick={()=>handleDelete(item)}>
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
            <ModalEditSertifikat
                selectedRow={selectedRow}
                show = {showModal}
                onClose={handleCloseModal}
                loading={loading}
                onEdit={onEdit}
            />
        </>
        
    )
}

export default TableSertifikat;