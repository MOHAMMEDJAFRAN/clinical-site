"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

const About = () => {
  return (
    <div className="bg-gray-100 text-gray-900 h-screen">

      {/* ✅ About Section with Animation */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-6 md:px-20 py-10">
        
        <div className="relative h-[15vh] w-full flex items-center justify-center bg-cover bg-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-xl md:text-4xl font-bold text-blue-600 shadow-lg bg-opacity-50 bg-gray-300 px-4 rounded-lg">
          About VitalCare Clinic
        </motion.h1>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-10">
          
          {/* Left - Image */}
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full md:w-1/2 flex justify-center">
            <Image src="/assets/about_image.png" width={350} height={250} className="rounded-lg shadow-lg" alt="VitalCare Clinic" />
          </motion.div>
          
          {/* Right - Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full md:w-1/2 text-lg leading-relaxed">
            <p className="mb-4">
              Welcome to VitalCare Clinic, VitalCare Clinic is a leading healthcare provider dedicated to offering compassionate and expert medical care. 
              With a team of highly skilled professionals and state-of-the-art facilities, we strive to ensure the best patient experience.
            </p>
            <p>
              From general checkups to specialized treatments, we focus on patient-centered care, innovation, and excellence.
            </p>
          </motion.div>
        
        </div>
      </motion.div>

      {/* ✅ Image Slider (Swiper) */}
      <div className="py-10 bg-white">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Our Facility</h2>
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          navigation
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="w-full max-w-6xl mx-auto">
          
          <SwiperSlide>
            <Image src="/assets/clinic1.jpg" width={400} height={250} className="rounded-lg shadow-lg" alt="Clinic" />
          </SwiperSlide>
          <SwiperSlide>
            <Image src="/assets/clinic2.jpg" width={400} height={250} className="rounded-lg shadow-lg" alt="Clinic" />
          </SwiperSlide>
          <SwiperSlide>
            <Image src="/assets/clinic3.jpg" width={400} height={250} className="rounded-lg shadow-lg" alt="Clinic" />
          </SwiperSlide>
          <SwiperSlide>
            <Image src="/assets/clinic4.jpg" width={400} height={250} className="rounded-lg shadow-lg" alt="Clinic" />
          </SwiperSlide>
        
        </Swiper>
      </div>

      

    </div>
  );
};

export default About;
