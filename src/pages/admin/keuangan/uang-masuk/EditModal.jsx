import { useState, useEffect } from "react";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import useEvent from "../../../../hooks/useEvent";

const EditModal = ({ show, setShow, handleUpdate, selectedData }) => {
    const { events } = useEvent();
    const [loading, setLoading] = useState(false);

    // 🧾 State form
    const [form, setForm] = useState({
        jumlah_uang_masuk: "",
        asal_pemasukan: "",
        tanggal_pemasukan: "",
        keuangan_id: "",
    });

    // ⚠️ State error validasi
    const [errors, setErrors] = useState({});

    // 🧠 Update form saat modal dibuka atau data berubah
    useEffect(() => {
        if (selectedData) {
            setForm({
                jumlah_uang_masuk: selectedData.jumlah_uang_masuk || "",
                asal_pemasukan: selectedData.asal_pemasukan || "",
                tanggal_pemasukan: selectedData.tanggal_pemasukan || "",
                keuangan_id: selectedData.keuangan_id || "",
            });
        }
    }, [selectedData, show]);

    // 🧩 Handle input
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    // 🚀 Submit update
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            await handleUpdate(selectedData.id, form);

            setErrors({});
            setShow(false);

            Swal.fire({
                title: "Berhasil!",
                text: "Data Uang Masuk berhasil diperbarui.",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (err) {
            setErrors(err.response?.data?.errors || {});
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Uang Masuk</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {/* Global Error */}
                    {errors.global && <Alert variant="danger">{errors.global[0]}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label>Nominal</Form.Label>
                        <Form.Control type="number" name="jumlah_uang_masuk" min="1" value={form.jumlah_uang_masuk} onChange={handleChange} isInvalid={!!errors.jumlah_uang_masuk} />
                        <Form.Control.Feedback type="invalid">{errors.jumlah_uang_masuk?.[0]}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Asal Pemasukan</Form.Label>
                        <Form.Control type="text" name="asal_pemasukan" value={form.asal_pemasukan} onChange={handleChange} isInvalid={!!errors.asal_pemasukan} />
                        <Form.Control.Feedback type="invalid">{errors.asal_pemasukan?.[0]}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tanggal</Form.Label>
                        <Form.Control type="date" name="tanggal_pemasukan" value={form.tanggal_pemasukan} onChange={handleChange} isInvalid={!!errors.tanggal_pemasukan} />
                        <Form.Control.Feedback type="invalid">{errors.tanggal_pemasukan?.[0]}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Event</Form.Label>
                        <Form.Select name="keuangan_id" value={form.keuangan_id} onChange={handleChange} isInvalid={!!errors.keuangan_id}>
                            <option value="">Pilih Event</option>
                            {events.map((event) => (
                                <option key={event.id} value={event.id}>
                                    {event.nama_event}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.keuangan_id?.[0]}</Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Batal
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        Simpan
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditModal;
