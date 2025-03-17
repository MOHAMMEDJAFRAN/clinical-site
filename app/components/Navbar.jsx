"use client"; // Required for Next.js 13+ Client Components

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa";
import { assets } from "../../public/assets/assets";

const Navbar = () => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const menuRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-lg shadow-md border-b border-gray-200 transition-all duration-300 inset-shadow-sm inset-shadow-gray-500">
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
          <button className="sm:hidden text-gray-800 text-2xl" onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-full bg-transparent backdrop-blur-xl text-black shadow-2xl p-6 z-50 transition-transform duration-300 ${
          showMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button className="absolute top-8 right-6 text-gray-800 text-2xl" onClick={() => setShowMenu(false)}>
          <FaTimes />
        </button>

        {/* Mobile Profile Section */}
        {token ? (
          <div className="mt-10 font-normal py-8 rounded-1xl px-4 bg-gray-300 ">
            <p
              onClick={() => {
                router.push("/profile");
                setShowMenu(false);
              }}
              className="cursor-pointer hover:text-blue-600"
            >
              Profile
            </p>
            <p
              onClick={() => {
                setToken(false);
                router.push("/login");
                setShowMenu(false);
              }}
              className="cursor-pointer mt-2 hover:text-blue-600"
            >
              Logout
            </p>
          </div>
        ) : (
          <button
            onClick={() => {
              router.push("/login");
              setShowMenu(false);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-md mt-6 w-full hover:bg-blue-800 transition-all duration-300"
          >
            Login
          </button>
        )}

        {/* Booking Button (Shown in mobile menu) */}
        <button
          onClick={() => {
            router.push("/book-appointment");
            setShowMenu(false);
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-md mt-5 w-full hover:bg-blue-800 transition-all duration-300"
        >
          Bookings
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
