// components/QrScanner.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { FaArrowLeft, FaLightbulb } from "react-icons/fa";

const QrScanner = ({ onClose, onScan }) => {
  const [scanStatus, setScanStatus] = useState("idle");
  const [torchOn, setTorchOn] = useState(false);
  const [activeCamera, setActiveCamera] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const qrScannerRef = useRef(null);

  // Setup QR Scanner
  useEffect(() => {
    setScanStatus("loading");

    const setupScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices.length) {
          setAvailableCameras(devices);
          setActiveCamera(devices[0].id);
        }

        const scanner = new Html5Qrcode("qr-reader");
        qrScannerRef.current = scanner;

        await scanner.start(
          devices[0].id,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            experimentalFeatures: { useBarCodeDetectorIfSupported: true },
          },
          (decodedText) => {
            onScan(decodedText);
            scanner.stop().then(() => {
              onClose();
              scanner.clear();
            });
          },
          (error) => {
            // Ignore scan fail
          }
        );

        setScanStatus("active");
      } catch (err) {
        console.error("QR Scanner error:", err);
        setScanStatus("error");
      }
    };

    setupScanner();

    return () => {
      qrScannerRef.current?.stop().then(() => qrScannerRef.current.clear());
    };
  }, [onClose, onScan]);

  const switchCamera = async (deviceId) => {
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.stop();
        await qrScannerRef.current.start(
          deviceId,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            onScan(decodedText);
            qrScannerRef.current.stop().then(() => {
              onClose();
              qrScannerRef.current.clear();
            });
          }
        );
        setActiveCamera(deviceId);
      } catch (err) {
        console.error("Camera switch error", err);
      }
    }
  };

  return (
    <div className="fixed h-screen inset-0 bg-black z-50 flex flex-col">
      {/* Loader Full Screen */}
      {scanStatus === "loading" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <svg className="animate-spin h-16 w-16 text-blue-500" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
            <path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-9.63-9.63A1.5,1.5,0,0,0,12,2.5h0A1.5,1.5,0,0,0,12,4Z"/>
          </svg>
        </div>
      )}

      {/* Header */}
      <div className="bg-black bg-opacity-80 text-white p-4 flex justify-between items-center">
        <button onClick={onClose} className="p-2 hover:bg-blue-700 hover:bg-opacity-10 rounded-full">
          <FaArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">Scan QR Code</h2>
        <div className="w-8" />
      </div>

      {/* QR View - Responsive Container */}
      <div className="flex-1 flex items-center justify-center relative bg-black overflow-hidden">
        <div 
          id="qr-reader" 
          className="w-full h-full max-w-md mx-auto relative"
          style={{
            aspectRatio: '1/1',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-2 border-blue-500 rounded-lg w-4/5 h-4/5 relative">
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-blue-500"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-blue-500"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-blue-500"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Camera & Torch Controls */}
      <div className="bg-black bg-opacity-90 p-4 flex justify-center gap-4">
        {availableCameras.length > 1 && (
          <select
            value={activeCamera}
            onChange={(e) => switchCamera(e.target.value)}
            className="bg-gray-800 text-white border px-2 py-1 rounded text-sm md:text-base"
          >
            {availableCameras.map((cam) => (
              <option key={cam.id} value={cam.id}>
                {cam.label || `Camera ${cam.id}`}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={() => {
            if (qrScannerRef.current) {
              qrScannerRef.current.applyVideoConstraints({
                advanced: [{ torch: !torchOn }],
              });
              setTorchOn((prev) => !prev);
            }
          }}
          className={`px-4 py-2 rounded-full ${torchOn ? "bg-yellow-400 text-black" : "bg-white text-black"}`}
        >
          <FaLightbulb />
        </button>
      </div>
    </div>
  );
};

export default QrScanner;