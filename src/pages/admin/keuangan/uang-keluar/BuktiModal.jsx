import { Button, Modal } from "react-bootstrap";

const BASE_URL_SERVER = import.meta.env.VITE_BASE_URL_SERVER;

const BuktiModal = ({ uangKeluar, show, setShow }) => {
    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Body>
                <img src={`${BASE_URL_SERVER}/storage/${uangKeluar?.bukti_pengeluaran}`} style={{ width: "100%", height: "auto" }} alt="Bukti Pengeluaran" />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Tutup
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BuktiModal;
