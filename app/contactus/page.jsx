"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: null,
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: "" });

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contactus/contactus`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSubmitStatus({
        success: true,
        message: response.data.message || 'Your message has been sent successfully!'
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error('Submission error:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        setSubmitStatus({
          success: false,
          message: error.response.data.message || 'Failed to send message. Please try again.'
        });
      } else if (error.request) {
        // The request was made but no response was received
        setSubmitStatus({
          success: false,
          message: 'No response from server. Please try again later.'
        });
      } else {
        // Something happened in setting up the request
        setSubmitStatus({
          success: false,
          message: error.message || 'An error occurred. Please try again.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="relative mt-15 w-full md:w-1/2">
          <Image
            src="/assets/contact-us.png"
            alt="Contact Us"
            width={600}
            height={400}
            className="object-cover"
            priority
          />
        </div>

        {/* Right Side - Content Section */}
        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="bg-[#cfccc9] text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg text-center font-bold">Get in Touch</h2>
            <p className="text-sm mt-2">
              Have any questions? Reach out to us and we'll get back to you as
              soon as possible.
            </p>
            
            {/* Status Message */}
            {submitStatus.message && (
              <div className={`mt-4 p-2 rounded-md text-center ${
                submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {submitStatus.message}
              </div>
            )}
            
            <input
              type="text"
              name="name"
              placeholder="Enter your Name"
              className="w-full mt-4 p-2 border rounded-md text-gray-800"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={100}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter a valid email address"
              className="w-full mt-2 p-2 border rounded-md text-gray-800"
              value={formData.email}
              onChange={handleChange}
              required
              pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number (optional)"
              className="w-full mt-2 p-2 border rounded-md text-gray-800"
              value={formData.phone}
              onChange={handleChange}
              maxLength={20}
            />
            <textarea
              name="message"
              placeholder="Enter your message"
              className="w-full mt-2 p-2 border rounded-md text-gray-800 h-24 resize-none"
              value={formData.message}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={1000}
            ></textarea>
            <button
              type="submit"
              className="mt-4 bg-black hover:bg-gray-800 transition text-white py-2 rounded-md w-full disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  SENDING...
                </span>
              ) : 'SUBMIT'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;