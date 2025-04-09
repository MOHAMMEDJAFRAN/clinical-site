"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FaBars,
  FaQrcode,
  FaTimes,
  FaLightbulb,
  FaArrowLeft,
} from "react-icons/fa";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import { assets } from "../../public/assets/assets";
import MobileNavbar from "./Mobilenavbar";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [scanStatus, setScanStatus] = useState("idle");
  const [torchOn, setTorchOn] = useState(false);
  const [activeCamera, setActiveCamera] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const profileMenuRef = useRef(null);
  const qrScannerRef = useRef(null);

  const toggleQrScanner = () => {
    if (showQrScanner) {
      setShowQrScanner(false);
      setScanStatus("idle");
      setTorchOn(false);
    } else {
      setShowQrScanner(true);
    }
  };

  // Setup QR Scanner
  useEffect(() => {
    if (!showQrScanner) return;

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
            handleScanResult(decodedText);
            scanner.stop().then(() => {
              setShowQrScanner(false);
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
  }, [showQrScanner]);

  const switchCamera = async (deviceId) => {
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.stop();
        await qrScannerRef.current.start(
          deviceId,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            handleScanResult(decodedText);
            qrScannerRef.current.stop().then(() => {
              setShowQrScanner(false);
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

  const handleScanResult = (decodedText) => {
    console.log("Scanned:", decodedText);
    if (decodedText.startsWith("http")) {
      window.open(decodedText, "_blank");
    } else {
      alert(`Scanned:\n${decodedText}`);
    }
  };

  const handleLogout = () => {
    signOut({ redirect: false });
    setToken(false);
    setIsProfileOpen(false);
    router.push("/login");
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white backdrop-blur-lg shadow-md border-b border-gray-200 transition-all duration-300">
      {/* ✅ QR Scanner Fullscreen View */}
      {showQrScanner && (
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
            <button onClick={toggleQrScanner} className="p-2 hover:bg-blue-700 hover:bg-opacity-10 rounded-full">
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
                aspectRatio: '1/1', // Maintain square aspect ratio
              }}
            >
              {/* This will be the actual scanner viewport */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Scanner border indicator - visual feedback */}
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
      )}

      {/* Navbar Content */}
      <div className="flex items-center justify-between py-4 px-6 md:px-10">
        {/* Logo */}
        <Link href="/">
          <Image src={assets.logo} alt="Clinic Logo" width={160} height={50} className="cursor-pointer" priority />
        </Link>

        {/* Right nav */}
        <div className="flex items-center gap-5">
          <button
            onClick={toggleQrScanner}
            className="hidden sm:flex text-blue-600 hover:text-blue-900"
            title="Scan QR"
          >
            <FaQrcode size={25} />
          </button>

          <button
            onClick={() => router.push("/my-appointment/1")}
            className="hidden sm:block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Bookings
          </button>

          {token ? (
            <div className="relative">
              <div className="hidden sm:flex cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <Image src={assets.profile_pic} alt="Profile" width={40} height={40} className="rounded-full" />
              </div>
              {isProfileOpen && (
                <div
                  ref={profileMenuRef}
                  className="absolute right-0 mt-2 w-40 bg-white border shadow rounded z-50"
                >
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      router.push("/profile");
                    }}
                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => router.push("/login")} className="bg-blue-600 text-white px-4 py-2 rounded">
              Login
            </button>
          )}

          <button className="sm:hidden text-gray-600 text-2xl" onClick={() => setShowMenu(true)}>
            <FaBars />
          </button>
        </div>
      </div>

      <MobileNavbar
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        token={token}
        setToken={setToken}
        onScanQR={toggleQrScanner}
      />
    </nav>
  );
};

export default Navbar;
