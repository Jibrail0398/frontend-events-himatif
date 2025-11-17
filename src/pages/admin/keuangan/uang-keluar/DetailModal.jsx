import { Button, Form, Modal } from "react-bootstrap";
import { formatDateID } from "../../../../helpers/dateHelper";

const DetailModal = ({ uangKeluar, show, setShow }) => {
    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Detail Uang Keluar</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    {/* 💵 Nominal Pengeluaran */}
                    <Form.Group className="mb-3">
                        <Form.Label>Nominal</Form.Label>
                        <Form.Control type="text" value={uangKeluar?.jumlah_pengeluaran || ""} readOnly />
                    </Form.Group>

                    {/* 🧾 Keperluan / Tujuan Pengeluaran */}
                    <Form.Group className="mb-3">
                        <Form.Label>Keperluan</Form.Label>
                        <Form.Control type="text" value={uangKeluar?.alasan_pengeluaran || ""} readOnly />
                    </Form.Group>

                    {/* 📅 Tanggal Pengeluaran */}
                    <Form.Group className="mb-3">
                        <Form.Label>Tanggal</Form.Label>
                        <Form.Control type="text" value={uangKeluar?.tanggal_pengeluaran ? formatDateID(uangKeluar.tanggal_pengeluaran) : ""} readOnly />
                    </Form.Group>

                    {/* 🕒 Created At */}
                    <Form.Group className="mb-3">
                        <Form.Label>Created At</Form.Label>
                        <Form.Control type="text" value={uangKeluar?.created_at ? formatDateID(uangKeluar.created_at) : ""} readOnly />
                    </Form.Group>

                    {/* 🔄 Updated At */}
                    <Form.Group className="mb-3">
                        <Form.Label>Updated At</Form.Label>
                        <Form.Control type="text" value={uangKeluar?.updated_at ? formatDateID(uangKeluar.updated_at) : ""} readOnly />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Tutup
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DetailModal;
