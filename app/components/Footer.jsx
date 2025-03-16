"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { assets } from "../../public/assets/assets";

const Footer = () => {
  return (
    <div className="border-gray-800 w-full h-[-100] px-20 bg-gray-300">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-10 text-sm">
        {/* ------------ Left Section ------------- */}
        <div>
          <Image className="mb-5 w-40" src={assets.logo} alt="Company Logo" width={160} height={40} />
          <p className="w-full text-justify md:w-2/3 text-gray-600 leading-6">
            Mayo Clinic is dedicated to providing accessible and high-quality healthcare services. 
            Our platform connects patients with trusted doctors and specialists, making it easier 
            than ever to book appointments, access medical advice, and receive quality care—all in one place.
          </p>
        </div>

        {/* ------------ Center Section (Company Links) ------------ */}
        <div>
          <p className="text-xl text-gray-600 font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            
            <li>
              <Link href="/about" className="hover:text-black text-gray-500 transition-all">About</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-black text-gray-500 transition-all">Contact</Link>
            </li>
          </ul>
        </div>

        {/* ------------ Right Section (Get in Touch & Social Media) ------------ */}
        <div>
          <p className="text-xl text-gray-600 font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>077123456</li>
            <li>mayoclinic@gmail.com</li>
          </ul>

          {/* Social Media Icons */}
          <div className="flex gap-4 mt-4 text-gray-600">
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="hover:text-blue-700 transition-all text-xl" />
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="hover:text-blue-600 transition-all text-xl" />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="hover:text-pink-600 transition-all text-xl" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="hover:text-blue-700 transition-all text-xl" />
            </Link>
          </div>
        </div>
      </div>

      {/* ------------ Bottom Footer ------------- */}
      <div>
        <p className="py-5 text-sm text-center text-gray-600">
          © Copyright Mayo Clinic 2025. All Rights Reserved.
          <Link href="/privacy-policy" className="text-blue-600 hover:underline mx-2">Privacy Policy</Link> |
          <Link href="/terms-conditions" className="text-blue-600 hover:underline mx-2">Terms & Conditions</Link>
        </p>
      </div>
    </div>
  );
};

export default Footer;
