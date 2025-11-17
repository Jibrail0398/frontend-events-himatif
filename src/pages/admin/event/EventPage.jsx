import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AddEventModal from "./AddEventModal";
import EditEventModal from "./EditEventModal";
import DetailEventModal from "./DetailEventModal";
import useEvent from "../../../hooks/useEvent";
import TableSearch from "../../../components/TableSearch";
import { formatDateID } from "../../../helpers/dateHelper";
import CardInfo from "../../../components/CardInfo";
import { Button } from "react-bootstrap";

const TableEvents = ({ events, handleDelete, handleEdit, handleDetail }) => {
    return (
        <>
            <TableSearch
                defaultOrder={{ column: 0, order: "desc" }}
                className="mt-4"
                header={["ID", "Nama Event", "Jenis", "Tema", "Tempat", "Status Pendaftaran Panitia", "Status Pendaftaran Peserta", "Created At", "Aksi"].map((item, index) => (
                    <th key={index}>{item}</th>
                ))}
                body={events.map((event, index) => (
                    <tr key={index}>
                        <td>{event.id}</td>
                        <td>{event.nama_event}</td>
                        <td>{event.jenis}</td>
                        <td>{event.tema}</td>
                        <td>{event.tempat}</td>
                        <td>
                            <div className={"badge " + (event.status_pendaftaran_panitia === "buka" ? "bg-success" : "bg-danger")}>{event.status_pendaftaran_panitia}</div>
                        </td>
                        <td>
                            <div className={"badge " + (event.status_pendaftaran_peserta === "buka" ? "bg-success" : "bg-danger")}>{event.status_pendaftaran_peserta}</div>
                        </td>
                        <td>{formatDateID(event.created_at)}</td>
                        <td>
                            <div className="d-flex gap-2">
                                <button className="btn btn-danger btn-circle btn-sm" onClick={() => handleDelete(event)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                                <button className="btn btn-primary btn-circle btn-sm" onClick={() => handleEdit(event)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <a href="#" className="btn btn-info btn-circle btn-sm" onClick={() => handleDetail(event)}>
                                    <i className="fas fa-info-circle"></i>
                                </a>
                            </div>
                        </td>
                    </tr>
                ))}
            />
        </>
    );
};

const EventPage = () => {
    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Hooks Event
    const { create, getAll, events, loading, destroyById, updateById } = useEvent();

    // Data
    const [event, setEvent] = useState({});

    const handleAdd = async (dataRequest) => {
        try {
            await create(dataRequest);
            Swal.fire({
                title: "Success",
                text: "Event berhasil ditambahkan",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error,
                icon: "error",
                confirmButtonText: "OK",
            });
        }

        fetchData();
    };

    const handleDelete = async (event) => {
        const response = await Swal.fire({
            title: "Delete Event",
            text: "Apakah anda yakin ingin menghapus event ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete",
            cancelButtonText: "Batal",
        });

        const shouldDelete = response.isConfirmed;

        if (!shouldDelete) return;

        destroyById(event.id);

        Swal.fire({
            title: "Deleted!",
            text: "Event berhasil dihapus.",
            icon: "success",
            confirmButtonText: "OK",
        });
    };

    const handleEdit = (event) => {
        setEvent(event);
        setShowEditModal(true);
    };

    const handleSubmitEdit = (dataRequest) => {
        try {
            updateById(event.id, dataRequest);
            fetchData();
            Swal.fire({
                title: "Success",
                text: "Event berhasil diubah",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error,
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleDetail = (event) => {
        setEvent(event);
        setShowDetailModal(true);
    };

    const fetchData = async () => {
        try {
            await getAll();
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Event</h1>
            </div>
            <div className="row">
                {/* Total Event */}
                <CardInfo type="primary" title="Total Event" value={events.length} icon="fa-list" />

                {/* Total Pendaftaran Panitia */}
                <CardInfo type="success" title="Pendaftaran Panitia Buka" value={events.filter((event) => event.status_pendaftaran_panitia === "buka").length} icon="fa-list" />
                <CardInfo type="danger" title="Pendaftaran Panitia Tutup" value={events.filter((event) => event.status_pendaftaran_panitia === "tutup").length} icon="fa-list" />

                {/* Total Pendaftaran Peserta */}
                <CardInfo type="success" title="Pendaftaran Peserta Buka" value={events.filter((event) => event.status_pendaftaran_peserta === "buka").length} icon="fa-list" />
                <CardInfo type="danger" title="Pendaftaran Peserta Tutup" value={events.filter((event) => event.status_pendaftaran_peserta === "tutup").length} icon="fa-list" />
            </div>

            <div className="card shadow mb-4 p-3">
                <div>
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        Tambah Event
                    </Button>
                </div>

                {loading && <div>Loading...</div>}
                {!loading && <TableEvents events={events} handleDelete={handleDelete} handleEdit={handleEdit} handleDetail={handleDetail} />}
            </div>
            <AddEventModal handleAdd={handleAdd} show={showAddModal} setShow={setShowAddModal} />
            <EditEventModal show={showEditModal} setShow={setShowEditModal} handleSubmitEdit={handleSubmitEdit} event={event} />
            <DetailEventModal show={showDetailModal} setShow={setShowDetailModal} event={event} />
        </>
    );
};

export default EventPage;
