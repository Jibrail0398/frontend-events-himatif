import { useEffect, useRef, useState, useCallback } from "react";
import { formatCurrency } from "../../helpers/currencyHelper";
import CardInfo from "../../components/CardInfo";
import { Spinner } from "react-bootstrap";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import useUangMasuk from "../../hooks/useUangMasuk";
import useUangKeluar from "../../hooks/useUangKeluar";

const DashboardPage = () => {
  const { uangMasuk, getAll: getAllUangMasuk } = useUangMasuk();
  const { uangKeluar, getAll: getAllUangKeluar } = useUangKeluar();

  const [isRealtime, setIsRealtime] = useState(false);
  const intervalRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // 🧮 Data State
  const [stats, setStats] = useState({
    totalUangMasuk: 0,
    totalUangKeluar: 0,
    saldoBersih: 0,
  });

  const [chartData, setChartData] = useState([]);

  // ✅ Ambil data dari API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([getAllUangMasuk(), getAllUangKeluar()]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getAllUangMasuk, getAllUangKeluar]);

  // 🧾 Hitung total setiap kali data berubah
  useEffect(() => {
    if (uangMasuk.length || uangKeluar.length) {
      const totalMasuk = uangMasuk.reduce(
        (acc, cur) => acc + Number(cur.jumlah_uang_masuk || 0),
        0
      );
      const totalKeluar = uangKeluar.reduce(
        (acc, cur) => acc + Number(cur.jumlah_pengeluaran || 0),
        0
      );
      const saldoBersih = totalMasuk - totalKeluar;

      setStats({
        totalUangMasuk: totalMasuk,
        totalUangKeluar: totalKeluar,
        saldoBersih,
      });

      // Tambahkan data grafik
      setChartData((prev) => [
        ...prev.slice(-9),
        {
          waktu: new Date().toLocaleTimeString(),
          pemasukan: totalMasuk,
          pengeluaran: totalKeluar,
        },
      ]);
    }
  }, [uangMasuk, uangKeluar]);

  // ♻️ Realtime handler
  useEffect(() => {
    if (isRealtime) {
      intervalRef.current = setInterval(fetchData, 5000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRealtime, fetchData]);

  // 🔄 Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {/* 🧭 Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Dashboard Keuangan</h1>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="data-realtime"
            checked={isRealtime}
            onChange={(e) => setIsRealtime(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="data-realtime">
            Data Realtime
          </label>
        </div>
      </div>

      {/* 🔢 Card Info */}
      <div className="row">
        <CardInfo
          type="warning"
          title="Total Uang Masuk"
          value={formatCurrency(stats.totalUangMasuk)}
          icon="fa-arrow-down"
        />
        <CardInfo
          type="danger"
          title="Total Uang Keluar"
          value={formatCurrency(stats.totalUangKeluar)}
          icon="fa-arrow-up"
        />
        <CardInfo
          type="info"
          title="Saldo Bersih"
          value={formatCurrency(stats.saldoBersih)}
          icon="fa-wallet"
        />
      </div>

      {/* 📊 Grafik Tren */}
      <div className="card mt-4 shadow">
        <div className="card-header fw-bold">Tren Keuangan (Realtime)</div>
        <div className="card-body" style={{ height: 300 }}>
          {loading && chartData.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="waktu" />
                <YAxis />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pemasukan"
                  stroke="#28a745"
                  name="Uang Masuk"
                />
                <Line
                  type="monotone"
                  dataKey="pengeluaran"
                  stroke="#dc3545"
                  name="Uang Keluar"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
