import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const EditEventModal = ({ event, show, setShow, handleSubmitEdit }) => {
    const [namaEvent, setNamaEvent] = useState("");
    const [jenis, setJenis] = useState("");
    const [tema, setTema] = useState("");
    const [tempat, setTempat] = useState("");
    const [statusPendaftaranPanitia, setStatusPendaftaranPanitia] = useState("");
    const [statusPendaftaranPeserta, setStatusPendaftaranPeserta] = useState("");

    useEffect(() => {
        setNamaEvent(event.nama_event);
        setJenis(event.jenis);
        setTema(event.tema);
        setTempat(event.tempat);
        setStatusPendaftaranPanitia(event.status_pendaftaran_panitia);
        setStatusPendaftaranPeserta(event.status_pendaftaran_peserta);
    }, [event]);

    const handleSubmit = (e) => {
        e.preventDefault();

        handleSubmitEdit({
            id: event.id,
            nama_event: namaEvent,
            jenis,
            tema,
            tempat,
            status_pendaftaran_panitia: statusPendaftaranPanitia,
            status_pendaftaran_peserta: statusPendaftaranPeserta,
        });

        setShow(false);
    };

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Nama Event</Form.Label>
                        <Form.Control type="text" name="nama_event" value={namaEvent} onChange={(e) => setNamaEvent(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Jenis</Form.Label>
                        <Form.Select name="jenis" value={jenis} onChange={(e) => setJenis(e.target.value)}>
                            <option value="">Pilih Jenis</option>
                            <option value="inaugurasi" selected={jenis === "inaugurasi"}>
                                Inaugurasi
                            </option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tema</Form.Label>
                        <Form.Control type="text" name="tema" value={tema} onChange={(e) => setTema(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tempat</Form.Label>
                        <Form.Control type="text" name="tempat" value={tempat} onChange={(e) => setTempat(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status Pendaftaran Panitia</Form.Label>
                        <Form.Control as="select" name="status_pendaftaran_panitia" value={statusPendaftaranPanitia} onChange={(e) => setStatusPendaftaranPanitia(e.target.value)}>
                            <option value="buka">Buka</option>
                            <option value="tutup">Tutup</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status Pendaftaran Peserta</Form.Label>
                        <Form.Control as="select" name="status_pendaftaran_peserta" value={statusPendaftaranPeserta} onChange={(e) => setStatusPendaftaranPeserta(e.target.value)}>
                            <option value="buka">Buka</option>
                            <option value="tutup">Tutup</option>
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit">
                        Simpan
                    </Button>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Batal
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditEventModal;
