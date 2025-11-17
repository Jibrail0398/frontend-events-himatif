import { useState } from "react";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import useEvent from "../../../../hooks/useEvent";
import Swal from "sweetalert2";

const AddModalPengeluaran = ({ handleAdd, show, setShow }) => {
    const { events } = useEvent();
    const [loading, setLoading] = useState(false);

    // 🧾 State form
    const [form, setForm] = useState({
        jumlah_pengeluaran: "",
        alasan_pengeluaran: "",
        tanggal_pengeluaran: "",
        bukti_pengeluaran: null,
        keuangan_id: "",
    });

    // ⚠️ State error validasi dari backend
    const [errors, setErrors] = useState({});

    // 🧠 Helper ubah input
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({
            ...form,
            [name]: files ? files[0] : value,
        });
    };

    // 🚀 Submit form
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        const data = new FormData();
        Object.entries(form).forEach(([key, val]) => data.append(key, val));

        try {
            await handleAdd(data);

            // Reset form & tutup modal
            setForm({
                jumlah_pengeluaran: "",
                alasan_pengeluaran: "",
                tanggal_pengeluaran: "",
                bukti_pengeluaran: null,
                keuangan_id: "",
            });
            setErrors({});
            setShow(false);

            Swal.fire({
                title: "Success",
                text: "Uang Keluar berhasil ditambahkan",
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
                <Modal.Title>Tambah Uang Keluar</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {/* ⚠️ Alert global error */}
                    {errors.global && <Alert variant="danger">{errors.global[0]}</Alert>}

                    {/* Nominal */}
                    <Form.Group className="mb-3">
                        <Form.Label>Nominal</Form.Label>
                        <Form.Control type="number" min="1" name="jumlah_pengeluaran" value={form.jumlah_pengeluaran} onChange={handleChange} isInvalid={!!errors.jumlah_pengeluaran} />
                        <Form.Control.Feedback type="invalid">{errors.jumlah_pengeluaran?.[0]}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Tujuan Pengeluaran */}
                    <Form.Group className="mb-3">
                        <Form.Label>Tujuan Pengeluaran</Form.Label>
                        <Form.Control type="text" name="alasan_pengeluaran" value={form.alasan_pengeluaran} onChange={handleChange} isInvalid={!!errors.alasan_pengeluaran} />
                        <Form.Control.Feedback type="invalid">{errors.alasan_pengeluaran?.[0]}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Tanggal */}
                    <Form.Group className="mb-3">
                        <Form.Label>Tanggal</Form.Label>
                        <Form.Control type="date" name="tanggal_pengeluaran" value={form.tanggal_pengeluaran} onChange={handleChange} isInvalid={!!errors.tanggal_pengeluaran} />
                        <Form.Control.Feedback type="invalid">{errors.tanggal_pengeluaran?.[0]}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Bukti */}
                    <Form.Group className="mb-3">
                        <Form.Label>Bukti</Form.Label>
                        <Form.Control type="file" name="bukti_pengeluaran" onChange={handleChange} isInvalid={!!errors.bukti_pengeluaran} />
                        <Form.Control.Feedback type="invalid">{errors.bukti_pengeluaran?.[0]}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Event */}
                    <Form.Group className="mb-3">
                        <Form.Label>Event</Form.Label>
                        <Form.Select name="keuangan_id" value={form.keuangan_id} onChange={handleChange} isInvalid={!!errors.keuangan_id}>
                            <option value="">Pilih Event</option>
                            {events.map((event) => (
                                <option value={event.id} key={event.id}>
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
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <span>Simpan</span>}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddModalPengeluaran;
