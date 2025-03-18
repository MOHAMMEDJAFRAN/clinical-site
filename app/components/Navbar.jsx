"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaBars } from "react-icons/fa";
import { assets } from "../../public/assets/assets";
import MobileNavbar from "./Mobilenavbar"; 

const Navbar = () => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-lg shadow-md border-b border-gray-200 transition-all duration-300">
      <div className="flex items-center justify-between text-sm py-4 px-6 md:px-10">
        {/* Logo */}
        <Link href="/">
          <Image src={assets.logo} alt="Clinic Logo" width={160} height={50} className="cursor-pointer" />
        </Link>

        {/* Right Side: Profile & Booking Button */}
        <div className="flex items-center gap-6">
          {/* Booking Button (Hidden on small screens) */}
          <button
            onClick={() => router.push("/book-appointment")}
            className="hidden sm:block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/50"
          >
            Bookings
          </button>

          {/* Profile Section */}
          {token ? (
            <div className="relative">
              {/* Profile Image (Hidden on mobile) */}
              <div className="hidden sm:flex items-center gap-2 cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <Image src={assets.profile_pic} alt="Profile" width={40} height={40} className="rounded-full" />
              </div>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div ref={profileMenuRef} className="absolute top-12 right-0 bg-white shadow-lg rounded-md p-4 w-36 z-50 border">
                  <p
                    onClick={() => {
                      setIsProfileOpen(false);
                      router.push("/profile");
                    }}
                    className="cursor-pointer text-gray-800 hover:text-black"
                  >
                    Profile
                  </p>
                  <p
                    onClick={() => {
                      setToken(false);
                      setIsProfileOpen(false);
                      router.push("/login");
                    }}
                    className="cursor-pointer mt-2 text-gray-800 hover:text-black"
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="hidden sm:block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-all duration-300"
            >
              Login
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button className="sm:hidden text-gray-800 text-2xl" onClick={() => setShowMenu(true)}>
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile Navbar Component */}
      <MobileNavbar showMenu={showMenu} setShowMenu={setShowMenu} token={token} setToken={setToken} />
    </nav>
  );
};

export default Navbar;
