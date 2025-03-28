"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Contact = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen p-6">
      {/* Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-transparent shadow-lg rounded-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden"
      >
        {/* Left Side - Image Section */}
        <div className="relative w-full md:w-1/2">
          <Image
            src="/assets/contact-us.png"
            alt="Contact Us"
            width={600}
            height={400}
            className=" object-cover"
          />
        </div>

        {/* Right Side - Content Section */}
        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          {/* What We Offer */}
          <div className="bg-[#cfccc9] text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg text-center font-bold">Get in Touch</h2>
            <p className="text-sm mt-2">
            Have any questions? Reach out to us and we’ll get back to you as soon as possible.
            </p>
            <input
              type="text"
              placeholder="Enter your Name"
              className="w-full mt-4 p-2 border rounded-md text-gray-800"
            />
            <input
              type="email"
              placeholder="Enter a valid email address"
              className="w-full mt-2 p-2 border rounded-md text-gray-800"
            />
            {/* Message Box */}
            <textarea
              placeholder="Enter your message"
              className="w-full mt-2 p-2 border rounded-md text-gray-800 h-24 resize-none"
            ></textarea>
            <button className="mt-4 bg-black hover:bg-gray-800 transition text-white py-2 rounded-md w-full">
              SUBMIT
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
