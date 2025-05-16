"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { assets } from "../../public/assets/assets";
import { FiHome } from "react-icons/fi";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white backdrop-blur-lg shadow-md border-b border-gray-200 transition-all duration-300">
      <div className="flex items-center justify-between py-4 px-4 md:px-10">
        {/* Left side - Logo */}
        <div className="flex items-center">
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
        </div>

        {/* Right side - Buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Home Button */}
          <button 
            onClick={() => router.push("/")}
            className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Home"
            title="Home"
          >
            <FiHome className="text-xl" />
          </button>
          
          {/* Admin Login Button */}
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white text-xs lg:text-sm md:text-base px-2 md:px-5  py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Admin Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;