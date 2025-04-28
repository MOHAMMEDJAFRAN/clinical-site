// components/Navbar.jsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { assets } from "../../public/assets/assets";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white backdrop-blur-lg shadow-md border-b border-gray-200 transition-all duration-300">
      <div className="flex items-center justify-between py-4 px-4 md:px-10">
        {/* Logo */}
        <Link href="/">
          <Image
            src={assets.logo}
            alt="Clinic Logo"
            width={140}
            height={40}
            className="cursor-pointer"
            priority
          />
        </Link>

        {/* Admin Login Button */}
        <div>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white text-sm md:text-base px-3 md:px-5 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Admin Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
