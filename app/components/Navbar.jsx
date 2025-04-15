// components/Navbar.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaQrcode } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { assets } from "../../public/assets/assets";
import MobileNavbar from "./Mobilenavbar";
import QrScanner from "./QrScanner";

const Navbar = () => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const profileMenuRef = useRef(null);

  const toggleQrScanner = () => {
    setShowQrScanner(!showQrScanner);
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
      {/* QR Scanner */}
      {showQrScanner && (
        <QrScanner 
          onClose={() => setShowQrScanner(false)} 
          onScan={handleScanResult} 
        />
      )}

      {/* Navbar Content */}
      <div className="flex items-center justify-between py-4 px-6 md:px-10">
        {/* Logo */}
        <Link href="/">
          <Image src={assets.logo} alt="Clinic Logo" width={160} height={50} className="cursor-pointer" priority />
        </Link>

        {/* Right nav */}
        <div className="flex items-center gap-5">
          {/* <button
            onClick={toggleQrScanner}
            className="hidden sm:flex text-blue-600 hover:text-blue-900"
            title="Scan QR"
          >
            <FaQrcode size={25} />
          </button> */}

          {/* <button
            onClick={() => router.push("/my-appointment/1")}
            className="hidden sm:block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            My Appointments
          </button> */}

          {/* {token ? (
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
                    className="block px-4 text-gray-500 py-2 hover:bg-gray-100 w-full text-left"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block px-4 text-gray-500 py-2 hover:bg-gray-100 w-full text-left"
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
          </button> */}
        </div>
      </div>

      {/* <MobileNavbar
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        token={token}
        setToken={setToken}
        onScanQR={toggleQrScanner}
      /> */}
    </nav>
  );
};

export default Navbar;