"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { FaHeartbeat, FaUserMd, FaHospital, FaClinicMedical } from "react-icons/fa";

const About = () => {
  const features = [
    {
      icon: <FaHeartbeat className="text-4xl text-blue-600" />,
      title: "Patient-Centered Care",
      description: "Tailored treatments focused on individual needs and comfort"
    },
    {
      icon: <FaUserMd className="text-4xl text-blue-600" />,
      title: "Expert Specialists",
      description: "Board-certified doctors with extensive experience"
    },
    {
      icon: <FaHospital className="text-4xl text-blue-600" />,
      title: "Modern Facilities",
      description: "State-of-the-art equipment and comfortable environments"
    },
    {
      icon: <FaClinicMedical className="text-4xl text-blue-600" />,
      title: "Comprehensive Services",
      description: "From diagnostics to treatment under one roof"
    }
  ];

  const testimonials = [
    {
      quote: "The care I received at VitalCare was exceptional. The doctors took time to understand my concerns.",
      author: "Sarah Johnson",
      role: "Patient"
    },
    {
      quote: "As a medical professional, I'm impressed by their standards and attention to detail.",
      author: "Dr. Michael Chen",
      role: "Visiting Physician"
    },
    {
      quote: "The staff made my recovery process comfortable and stress-free. Highly recommended!",
      author: "Robert Williams",
      role: "Patient"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-blue-50 text-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">About VitalCare</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Where Compassion Meets Cutting-Edge Healthcare
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-20 py-16">
        {/* About Clinic Section */}
        <section className="mb-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image with floating effect */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/assets/about_image.png" 
                  width={600} 
                  height={400} 
                  className="w-full h-auto object-cover"
                  alt="VitalCare Clinic"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                  <div className="text-blue-600 text-2xl font-bold">15+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <h2 className="text-3xl font-bold text-blue-800 mb-6">Our Story</h2>
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Founded in 2008, VitalCare Clinic has grown from a small neighborhood practice to a 
                leading healthcare provider renowned for its patient-centered approach and clinical 
                excellence. Our journey has been guided by a simple principle: every patient deserves 
                compassionate, personalized care.
              </p>
              <p className="text-lg leading-relaxed text-gray-700 mb-8">
                Today, we combine decades of medical expertise with cutting-edge technology to deliver 
                comprehensive care across multiple specialties, all within a welcoming environment 
                designed to put patients at ease.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300">
                  Meet Our Team
                </button>
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition duration-300">
                  Virtual Tour
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Why Choose VitalCare?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're redefining healthcare excellence through innovation, compassion, and 
              uncompromising quality standards.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-center mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials Slider */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Patient Experiences</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear what our patients say about their VitalCare experience
            </p>
          </motion.div>

          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-xl shadow-lg h-full"
                >
                  <div className="text-blue-600 text-4xl mb-4">"</div>
                  <p className="text-gray-700 italic mb-6">{testimonial.quote}</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-800">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-100">Years Experience</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Specialists</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Patients Treated</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Emergency Care</div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;