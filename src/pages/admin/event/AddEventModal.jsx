import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const AddEventModal = ({ handleAdd, show, setShow }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);

        handleAdd({
            kode_event: data.get("kode_event"),
            nama_event: data.get("nama_event"),
            jenis: data.get("jenis"),
            tema: data.get("tema"),
            tempat: data.get("tempat"),
            status_pendaftaran_panitia: data.get("status_pendaftaran_panitia"),
            status_pendaftaran_peserta: data.get("status_pendaftaran_peserta"),
        });

        setShow(false);
    };

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Tambah Event</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {/* Kode Event */}
                    <Form.Group className="mb-3">
                        <Form.Label>Kode Event</Form.Label>
                        <Form.Control type="text" name="kode_event" required />
                    </Form.Group>

                    {/* Nama Event */}
                    <Form.Group className="mb-3">
                        <Form.Label>Nama Event</Form.Label>
                        <Form.Control type="text" name="nama_event" required />
                    </Form.Group>

                    {/* Jenis */}
                    <Form.Group className="mb-3">
                        <Form.Label>Jenis</Form.Label>
                        <Form.Select name="jenis" required>
                            <option value="">Pilih Jenis</option>
                            <option value="inaugurasi">Inaugurasi</option>
                        </Form.Select>
                    </Form.Group>

                    {/* Tema */}
                    <Form.Group className="mb-3">
                        <Form.Label>Tema</Form.Label>
                        <Form.Control type="text" name="tema" required />
                    </Form.Group>

                    {/* Tempat */}
                    <Form.Group className="mb-3">
                        <Form.Label>Tempat</Form.Label>
                        <Form.Control type="text" name="tempat" required />
                    </Form.Group>

                    {/* Status Pendaftaran Panitia Select */}
                    <Form.Group className="mb-3">
                        <Form.Label>Status Pendaftaran Panitia</Form.Label>
                        <Form.Select name="status_pendaftaran_panitia" required>
                            <option value="buka">Buka</option>
                            <option value="tutup">Tutup</option>
                        </Form.Select>
                    </Form.Group>

                    {/* Status Pendaftaran Peserta Select */}
                    <Form.Group className="mb-3">
                        <Form.Label>Status Pendaftaran Peserta</Form.Label>
                        <Form.Select name="status_pendaftaran_peserta" required>
                            <option value="buka">Buka</option>
                            <option value="tutup">Tutup</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Batal
                    </Button>
                    <Button variant="primary" type="submit">
                        Simpan
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddEventModal;
