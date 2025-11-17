import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import useFormPresensiStore from "../stores/useFormPresensiStore";
import "../style/FormPresensi.css";
import { scanPresensi } from "../services/presensiService";

const FormPresensi = () => {
  const { kodeEvent } = useParams();

  const [attendanceType, setAttendanceType] = useState("datang");
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scannerRef = useRef(null);
  const { checkIn, checkOut, getTodayStats } = useFormPresensiStore();

  const FIXED_EVENT_CODE = kodeEvent || "INAU2025";
  const FIXED_EVENT_NAME = "Inaugurasi Mahasiswa Fakultas Ilmu Komputer";

  const { totalCheckedIn, totalCheckedOut } = getTodayStats();

  const handleScanResult = useCallback(
    (decodedText) => {
      console.log("QR Code detected:", decodedText);
      setScanResult(decodedText);
      setScanStatus("scanning");
      setScanMessage("Memproses QR code...");

      processAttendance(decodedText);
    },
    [attendanceType, FIXED_EVENT_CODE]
  );

  const processAttendance = async (scannedData) => {
    if (!scannedData.trim()) {
      setScanMessage("QR Code tidak valid!");
      setScanStatus("error");
      return;
    }

    setIsLoading(true);
    setScanStatus("scanning");
    setScanMessage("Mengirim data ke server...");

    try {
      let requestData;
      try {
        const parsedData = JSON.parse(scannedData);
        requestData = {
          kode_event: parsedData.kode_event || FIXED_EVENT_CODE,
          role: parsedData.role || "peserta", // Default ke 'peserta'
          type: attendanceType,
          id: parsedData.id || null,
          kode: parsedData.kode || parsedData.nim || scannedData.trim(), // Support
        };
      } catch (error) {
        requestData = {
          kode_event: FIXED_EVENT_CODE,
          role: "peserta",
          type: attendanceType,
          id: null,
          kode: scannedData.trim(),
        };
      }

      console.log("Sending data to API:", requestData);

      const result = await scanPresensi(requestData);
      console.log("API Response:", result);

      if (response.ok && result.success) {
        setScanMessage(result.message);
        setScanStatus("success");

        const attendanceRecord = {
          nim: requestData.kode,
          eventCode: requestData.kode_event,
          eventName: FIXED_EVENT_NAME,
          timestamp: new Date().toLocaleString("id-ID"),
          type: attendanceType,
          method: "qr",
          role: requestData.role,
        };

        if (attendanceType === "datang") {
          checkIn(attendanceRecord);
        } else {
          checkOut(attendanceRecord);
        }

        setTimeout(() => {
          setScanResult(null);
          setScanStatus("");
          setScanMessage("");

          if (isScanning) {
            restartScanner();
          }
        }, 3000);
      } else {
        throw new Error(result.message || `Presensi ${attendanceType} gagal`);
      }
    } catch (err) {
      console.error("Error processing attendance:", err);
      setScanMessage(
        err.message || "Terjadi kesalahan saat memproses presensi"
      );
      setScanStatus("error");

      // ✅ DIPERBAIKI: Fallback ke local storage dengan format yang benar
      try {
        const fallbackData = {
          nim: scannedData.trim(),
          eventCode: FIXED_EVENT_CODE,
          eventName: FIXED_EVENT_NAME,
          timestamp: new Date().toLocaleString("id-ID"),
          type: attendanceType,
          method: "qr",
          role: "peserta",
        };

        let success = false;
        if (attendanceType === "datang") {
          success = checkIn(fallbackData);
        } else {
          success = checkOut(fallbackData);
        }

        if (success) {
          setScanMessage(
            `Presensi ${attendanceType} berhasil untuk: ${scannedData} (Data tersimpan lokal)`
          );
          setScanStatus("success");

          setTimeout(() => {
            setScanResult(null);
            setScanStatus("");
            setScanMessage("");
            if (isScanning) restartScanner();
          }, 3000);
        } else {
          throw new Error("Presensi gagal! Mungkin sudah melakukan presensi.");
        }
      } catch (fallbackError) {
        setScanMessage(fallbackError.message);
        setScanStatus("error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ DIPERBAIKI: Function untuk restart scanner
  const restartScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .clear()
        .then(() => {
          initializeScanner();
        })
        .catch((err) => {
          console.error("Error clearing scanner:", err);
          initializeScanner();
        });
    } else {
      initializeScanner();
    }
  };

  // ✅ DIPERBAIKI: Initialize QR Scanner dengan error handling
  const initializeScanner = useCallback(() => {
    if (!scannerRef.current) {
      try {
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [],
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          rememberLastUsedCamera: true,
        };

        scannerRef.current = new Html5QrcodeScanner(
          "qr-reader",
          config, // ✅ PAKAI CONFIG BARU
          false
        );

        scannerRef.current.render(
          (decodedText) => {
            handleScanResult(decodedText);
          },
          (error) => {
            console.warn("QR Scan error:", error);
          }
        );
      } catch (error) {
        console.error("Error initializing scanner:", error);
        setScanMessage("Gagal memulai scanner. Pastikan kamera tersedia.");
        setScanStatus("error");
        setIsScanning(false);
      }
    }
  }, [handleScanResult]);

  // ✅ DIPERBAIKI: useEffect dengan dependency yang benar
  useEffect(() => {
    if (isScanning) {
      initializeScanner();
    }

    return () => {
      // Cleanup scanner
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Error clearing scanner on unmount:", error);
        });
        scannerRef.current = null;
      }
    };
  }, [isScanning, initializeScanner]);

  const startScanning = () => {
    setIsScanning(true);
    setScanResult(null);
    setScanStatus("");
    setScanMessage("");
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (scannerRef.current) {
      scannerRef.current.clear().catch((error) => {
        console.error("Error clearing scanner:", error);
      });
      scannerRef.current = null;
    }
  };

  // ✅ DIPERBAIKI: Handle toggle attendance type
  const handleToggleAttendance = (type) => {
    setAttendanceType(type);
    stopScanning();
    setScanStatus("");
    setScanResult(null);
    setScanMessage("");
  };

  return (
    <div className="pendaftaran-page">
      <div className="attendance-container">
        <div className="attendance-header">
          <h1>📱 Presensi QR Code</h1>
          <p>
            Scan QR code untuk presensi{" "}
            {attendanceType === "datang" ? "datang" : "pulang"}
          </p>
          <p className="event-info">
            Event: <strong>{FIXED_EVENT_NAME}</strong>
          </p>{" "}
          {/* ✅ DITAMBAH: Info event */}
        </div>

        {/* Toggle Button */}
        <div className="attendance-toggle">
          <button
            className={attendanceType === "datang" ? "active" : ""}
            onClick={() => handleToggleAttendance("datang")}
            disabled={isLoading}
          >
            📍 Presensi Datang
          </button>
          <button
            className={attendanceType === "pulang" ? "active" : ""}
            onClick={() => handleToggleAttendance("pulang")}
            disabled={isLoading}
          >
            🏠 Presensi Pulang
          </button>
        </div>

        {/* QR Scanner Section */}
        <div className="scanner-section">
          <h3>🔍 Scan QR Code</h3>

          {!isScanning ? (
            <div className="scanner-placeholder">
              <div className="scanner-icon">📷</div>
              <p>Klik tombol di bawah untuk mulai scan</p>
              <button
                onClick={startScanning}
                className="scan-button"
                disabled={isLoading}
              >
                {isLoading ? "⏳ Memproses..." : "🎥 Mulai Scan QR Code"}
              </button>
            </div>
          ) : (
            <div className="scanner-active">
              <div id="qr-reader" className="qr-scanner"></div>
              <button
                onClick={stopScanning}
                className="stop-scan-button"
                disabled={isLoading}
              >
                ⏹️ Stop Scan
              </button>
            </div>
          )}

          {/* ✅ DIPERBAIKI: Status Feedback dengan pesan detail */}
          {scanStatus === "scanning" && (
            <div className="scan-status scanning">
              <p>⏳ {scanMessage || "Memproses QR code..."}</p>
            </div>
          )}

          {scanStatus === "success" && (
            <div className="scan-status success">
              <p>✅ {scanMessage || "Presensi berhasil!"}</p>
            </div>
          )}

          {scanStatus === "error" && (
            <div className="scan-status error">
              <p>❌ {scanMessage || "Presensi gagal"}</p>
            </div>
          )}

          {scanResult && (
            <div className="scan-result">
              <p>
                📋 Terdeteksi: <strong>{scanResult}</strong>
              </p>
            </div>
          )}

          {isLoading && (
            <div className="loading-overlay">
              <p>🔄 {scanMessage || "Mengirim data ke server..."}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormPresensi;
