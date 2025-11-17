import { Button, Form, Modal } from "react-bootstrap";

const DetailEventModal = ({ event, show, setShow }) => {
    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Detail Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nama Event</Form.Label>
                        <Form.Control type="text" name="nama_event" value={event?.nama_event} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Jenis</Form.Label>
                        <Form.Control type="text" name="jenis" value={event?.jenis} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tema</Form.Label>
                        <Form.Control type="text" name="tema" value={event?.tema} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tempat</Form.Label>
                        <Form.Control type="text" name="tempat" value={event?.tempat} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status Pendaftaran Panitia</Form.Label>
                        <Form.Control type="text" name="status_pendaftaran_panitia" value={event?.status_pendaftaran_panitia} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status Pendaftaran Peserta</Form.Label>
                        <Form.Control type="text" name="status_pendaftaran_peserta" value={event?.status_pendaftaran_peserta} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Created At</Form.Label>
                        <Form.Control type="text" name="created_at" value={event?.created_at} readOnly />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Batal
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DetailEventModal;
