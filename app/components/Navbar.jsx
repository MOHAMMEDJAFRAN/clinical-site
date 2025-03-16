"use client"; // Required for Next.js 13+ Client Components

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa";
import { assets } from "../../public/assets/assets";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
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

  // Common styles for links
  const baseStyle = "py-2 px-4 transition-all duration-300 rounded-md";
  const hoverStyle = "hover:text-white hover:bg-blue-600";
  const activeStyle = "text-white bg-blue-600 font-bold";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-lg shadow-md border-b border-gray-200 transition-all duration-300">
      <div className="flex items-center justify-between text-sm py-4 px-6 md:px-10">
        {/* Logo */}
        <Link href="/">
          <Image src={assets.logo} alt="Clinic Logo" width={160} height={50} className="cursor-pointer" />
        </Link>

        {/* Right Side: Profile & Booking Button */}
        <div className="flex items-center gap-6">
          {/* Booking Button */}
          <button
            onClick={() => router.push("/book-appointment")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-all duration-300 hidden md:block"
          >
            Book Appointment
          </button>

          {token ? (
            <div className="relative">
              {/* Profile Image */}
              <div className="hidden md:flex items-center gap-2 cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}>
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
              className="bg-blue-600 text-white px-6 py-2 rounded-md hidden md:block hover:bg-blue-800 transition-all duration-300"
            >
              Login
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-gray-800 text-2xl" onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white text-black shadow-lg p-6 z-50 transition-transform duration-300 ${
          showMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button className="absolute top-4 right-4 text-gray-800 text-2xl" onClick={() => setShowMenu(false)}>
          <FaTimes />
        </button>
        <ul className="flex flex-col gap-6 mt-10">
          <li>
            <Link
              href="/"
              className={`${baseStyle} ${hoverStyle} ${pathname === "/" ? activeStyle : ""}`}
              onClick={() => setShowMenu(false)}
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              href="/doctors"
              className={`${baseStyle} ${hoverStyle} ${pathname === "/doctors" ? activeStyle : ""}`}
              onClick={() => setShowMenu(false)}
            >
              ALL DOCTORS
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={`${baseStyle} ${hoverStyle} ${pathname === "/about" ? activeStyle : ""}`}
              onClick={() => setShowMenu(false)}
            >
              ABOUT
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className={`${baseStyle} ${hoverStyle} ${pathname === "/contact" ? activeStyle : ""}`}
              onClick={() => setShowMenu(false)}
            >
              CONTACT
            </Link>
          </li>
        </ul>

        {/* Mobile Profile Section */}
        {token ? (
          <div className="border-t text-gray-600 mt-6 pt-4">
            <p
              onClick={() => {
                router.push("/profile");
                setShowMenu(false);
              }}
              className="cursor-pointer hover:text-black"
            >
              Profile
            </p>
            <p
              onClick={() => {
                setToken(false);
                router.push("/login");
                setShowMenu(false);
              }}
              className="cursor-pointer mt-2 hover:text-black"
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
      </div>
    </nav>
  );
};

export default Navbar;
