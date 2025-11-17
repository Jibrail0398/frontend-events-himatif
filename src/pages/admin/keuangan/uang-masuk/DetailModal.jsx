import { Button, Form, Modal } from "react-bootstrap";
import { formatDateID } from "../../../../helpers/dateHelper";

const DetailModal = ({ uangMasuk, show, setShow }) => {
    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Detail Uang Masuk</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nominal</Form.Label>
                        <Form.Control type="text" name="nama_event" value={uangMasuk?.jumlah_uang_masuk} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Asal Pemasukan</Form.Label>
                        <Form.Control type="text" name="jenis" value={uangMasuk?.asal_pemasukan} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tanggal</Form.Label>
                        <Form.Control type="text" name="tema" value={formatDateID(uangMasuk?.tanggal_pemasukan)} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Created At</Form.Label>
                        <Form.Control type="text" name="created_at" value={uangMasuk?.created_at} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Updated At</Form.Label>
                        <Form.Control type="text" name="updated_at" value={formatDateID(uangMasuk?.updated_at)} readOnly />
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

export default DetailModal;
