import { Button, Modal } from "react-bootstrap";

const BASE_URL_SERVER = import.meta.env.VITE_BASE_URL_SERVER;

const BuktiModal = ({ uangMasuk, show, setShow }) => {
    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Body>
                <img src={`${BASE_URL_SERVER}/storage/${uangMasuk?.bukti_pemasukan}`} style={{ width: "100%", height: "auto" }} alt="bukti" />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Batal
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BuktiModal;
