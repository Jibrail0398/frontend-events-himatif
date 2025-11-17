import { useEffect, useState } from "react";
import { Table, Card, Row, Col, Spinner, Form, Button } from "react-bootstrap";
import { formatCurrency } from "../../../../helpers/currencyHelper";
import { formatDateID } from "../../../../helpers/dateHelper";
import useUangMasuk from "../../../../hooks/useUangMasuk";
import useUangKeluar from "../../../../hooks/useUangKeluar";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, XAxis, YAxis, ResponsiveContainer } from "recharts";
import useEvent from "../../../../hooks/useEvent";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const LaporanKeuanganPage = () => {
    const { uangMasuk, loading: loadingMasuk, getAll: getAllMasuk } = useUangMasuk();
    const { uangKeluar, loading: loadingKeluar, getAll: getAllKeluar } = useUangKeluar();
    const { events } = useEvent();

    const [totalMasuk, setTotalMasuk] = useState(0);
    const [totalKeluar, setTotalKeluar] = useState(0);
    const [saldo, setSaldo] = useState(0);
    const [selectedKeuanganId, setSelectedKeuanganId] = useState("");

    useEffect(() => {
        getAllMasuk();
        getAllKeluar();
    }, []);

    // Filter data berdasarkan keuangan_id
    const filteredMasuk = selectedKeuanganId ? uangMasuk.filter((item) => parseInt(item.keuangan_id) === parseInt(selectedKeuanganId)) : uangMasuk;
    const filteredKeluar = selectedKeuanganId ? uangKeluar.filter((item) => parseInt(item.keuangan_id) === parseInt(selectedKeuanganId)) : uangKeluar;

    useEffect(() => {
        const masuk = filteredMasuk.reduce((acc, cur) => acc + Number(cur.jumlah_uang_masuk || 0), 0);
        const keluar = filteredKeluar.reduce((acc, cur) => acc + Number(cur.jumlah_pengeluaran || 0), 0);
        setTotalMasuk(masuk);
        setTotalKeluar(keluar);
        setSaldo(masuk - keluar);
    }, [filteredMasuk, filteredKeluar]);

    if (loadingMasuk || loadingKeluar) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
                <p>Memuat data laporan...</p>
            </div>
        );
    }

    // Data chart
    const pieData = [
        { name: "Pemasukan", value: totalMasuk },
        { name: "Pengeluaran", value: totalKeluar },
    ];

    const barData = [
        { name: "Pemasukan", nominal: totalMasuk },
        { name: "Pengeluaran", nominal: totalKeluar },
        { name: "Saldo", nominal: saldo },
    ];

    const COLORS = ["#28a745", "#dc3545", "#007bff"];

    // 📦 Fungsi ekspor Excel
    const handleExportExcel = () => {
        const allData = [
            ...filteredMasuk.map((item) => ({
                Tanggal: formatDateID(item.tanggal_pemasukan),
                Jenis: "Pemasukan",
                Keterangan: item.asal_pemasukan,
                Nominal: item.jumlah_uang_masuk,
                "Keuangan ID": item.keuangan_id,
            })),
            ...filteredKeluar.map((item) => ({
                Tanggal: formatDateID(item.tanggal_pengeluaran),
                Jenis: "Pengeluaran",
                Keterangan: item.alasan_pengeluaran,
                Nominal: item.jumlah_pengeluaran,
                "Keuangan ID": item.keuangan_id,
            })),
        ];

        const ws = XLSX.utils.json_to_sheet(allData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Laporan Keuangan");

        // Tambahkan sheet ringkasan
        const summary = [
            { Keterangan: "Total Pemasukan", Nominal: totalMasuk },
            { Keterangan: "Total Pengeluaran", Nominal: totalKeluar },
            { Keterangan: "Saldo Akhir", Nominal: saldo },
        ];
        const wsSummary = XLSX.utils.json_to_sheet(summary);
        XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        const fileName = selectedKeuanganId ? `Laporan_Keuangan_Event_${selectedKeuanganId}.xlsx` : "Laporan_Keuangan_Semua.xlsx";

        saveAs(fileData, fileName);
    };

    return (
        <div>
            <h3 className="mb-4">📊 Laporan Keuangan</h3>

            {/* Filter */}
            <Card className="p-3 shadow-sm mb-4">
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Filter berdasarkan Keuangan ID</Form.Label>
                                <Form.Select value={selectedKeuanganId} onChange={(e) => setSelectedKeuanganId(e.target.value)}>
                                    <option value="">Semua</option>
                                    {events.map((event) => (
                                        <option key={event.id} value={event.id}>
                                            {event.nama_event}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6} className="d-flex align-items-end justify-content-end">
                            <Button variant="success" onClick={handleExportExcel}>
                                📤 Ekspor ke Excel
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            {/* Ringkasan */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="p-3 shadow-sm">
                        <h6>Total Pemasukan</h6>
                        <h4 className="text-success">{formatCurrency(totalMasuk)}</h4>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="p-3 shadow-sm">
                        <h6>Total Pengeluaran</h6>
                        <h4 className="text-danger">{formatCurrency(totalKeluar)}</h4>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="p-3 shadow-sm">
                        <h6>Saldo Akhir</h6>
                        <h4 className={saldo >= 0 ? "text-success" : "text-danger"}>{formatCurrency(saldo)}</h4>
                    </Card>
                </Col>
            </Row>

            {/* Chart */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="p-3 shadow-sm">
                        <h6 className="text-center mb-3">Perbandingan Pemasukan vs Pengeluaran</h6>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(val) => formatCurrency(val)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="p-3 shadow-sm">
                        <h6 className="text-center mb-3">Grafik Total Keuangan</h6>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={barData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(val) => formatCurrency(val)} />
                                <Legend />
                                <Bar dataKey="nominal">
                                    {barData.map((entry, index) => (
                                        <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Detail Tabel */}
            <Card className="p-3 shadow-sm">
                <h5>🧾 Detail Transaksi</h5>
                <Table striped bordered hover responsive className="mt-3">
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Jenis</th>
                            <th>Keterangan</th>
                            <th>Nominal</th>
                            <th>Keuangan ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMasuk.map((item) => (
                            <tr key={`masuk-${item.id}`}>
                                <td>{formatDateID(item.tanggal_pemasukan)}</td>
                                <td className="text-success">Pemasukan</td>
                                <td>{item.asal_pemasukan}</td>
                                <td className="text-success">{formatCurrency(item.jumlah_uang_masuk)}</td>
                                <td>{item.keuangan_id}</td>
                            </tr>
                        ))}
                        {filteredKeluar.map((item) => (
                            <tr key={`keluar-${item.id}`}>
                                <td>{formatDateID(item.tanggal_pengeluaran)}</td>
                                <td className="text-danger">Pengeluaran</td>
                                <td>{item.alasan_pengeluaran}</td>
                                <td className="text-danger">{formatCurrency(item.jumlah_pengeluaran)}</td>
                                <td>{item.keuangan_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};

export default LaporanKeuanganPage;
