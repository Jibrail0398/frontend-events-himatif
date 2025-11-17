import { useState, useEffect } from "react";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import useEvent from "../../../../hooks/useEvent";

const EditModal = ({ show, setShow, handleUpdate, selectedData }) => {
    const { events } = useEvent();
    const [loading, setLoading] = useState(false);

    // 🧾 State form
    const [form, setForm] = useState({
        jumlah_pengeluaran: "",
        alasan_pengeluaran: "",
        tanggal_pengeluaran: "",
        keuangan_id: "",
    });

    // ⚠️ State error validasi
    const [errors, setErrors] = useState({});

    // 🧠 Update form saat modal dibuka atau data berubah
    useEffect(() => {
        if (selectedData) {
            setForm({
                jumlah_pengeluaran: selectedData.jumlah_pengeluaran || "",
                alasan_pengeluaran: selectedData.alasan_pengeluaran || "",
                tanggal_pengeluaran: selectedData.tanggal_pengeluaran || "",
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
                text: "Data Uang Keluar berhasil diperbarui.",
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
                <Modal.Title>Edit Uang Keluar</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {/* Global Error */}
                    {errors.global && <Alert variant="danger">{errors.global[0]}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label>Nominal</Form.Label>
                        <Form.Control type="number" name="jumlah_pengeluaran" min="1" value={form.jumlah_pengeluaran} onChange={handleChange} isInvalid={!!errors.jumlah_pengeluaran} />
                        <Form.Control.Feedback type="invalid">{errors.jumlah_pengeluaran?.[0]}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>alasan_pengeluaran</Form.Label>
                        <Form.Control type="text" name="alasan_pengeluaran" value={form.alasan_pengeluaran} onChange={handleChange} isInvalid={!!errors.alasan_pengeluaran} />
                        <Form.Control.Feedback type="invalid">{errors.alasan_pengeluaran?.[0]}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tanggal</Form.Label>
                        <Form.Control type="date" name="tanggal_pengeluaran" value={form.tanggal_pengeluaran} onChange={handleChange} isInvalid={!!errors.tanggal_pengeluaran} />
                        <Form.Control.Feedback type="invalid">{errors.tanggal_pengeluaran?.[0]}</Form.Control.Feedback>
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
