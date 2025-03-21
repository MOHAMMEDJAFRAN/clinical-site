"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { doctors } from "../../public/assets/assets";
import BookingForm from "../components/Bookingform";
import DoctorCard from "../components/Doctorcard";
import { motion } from "framer-motion"; 

const DoctorInfo = () => {
  const searchParams = useSearchParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const doctorId = searchParams.get("id");
    
    if (doctorId) {
      const foundDoctor = doctors.find((doc) => doc._id === doctorId);
      setDoctor(foundDoctor);
    }
    
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return <div className="text-center text-blue-500 text-xl">Loading...</div>;
  }

  if (!doctor) {
    return <div className="text-center text-red-500 text-xl">Doctor not found</div>;
  }

  // Generate time slots in 1-hour increments
  const generateTimeSlots = (availableTime) => {
    const [start, end] = availableTime
      .split("-")
      .map((t) => parseInt(t.trim().replace("AM", "").replace("PM", "")));

    let slots = [];
    for (let i = start; i < end; i++) {
      const formattedSlot = `${i}:00 ${i < 12 ? "AM" : "PM"}`;
      slots.push(formattedSlot);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots(doctor.availableTime);

  // Recommended doctors
  const recommendedDoctors = doctors.filter(
    (doc) => doc.speciality === doctor.speciality && doc.city === doctor.city && doc._id !== doctor._id
  );

  return (
    <motion.div
      initial={{ x: "100vw", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100vw", opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="flex flex-col items-center min-h-screen bg-gray-100 p-6"
    >
      {/* Doctor Details */}
      <div className="bg-gray-300 shadow-lg rounded-lg p-6 w-full max-w-md text-center border border-gray-300">
        <div className="relative mx-auto w-20 h-20 lg:w-34 lg:h-34 rounded-full bg-white shadow-2xs overflow-hidden">
          <img src={doctor.image || "/assets/user.png"} alt={doctor.name} className="w-full h-full object-cover" />
        </div>
        <h2 className="text-md lg:text-xl text-blue-600 font-bold mt-2">{doctor.name}</h2>
        <p className="text-sm lg:text-md font-semibold text-gray-600">{doctor.speciality}</p>
        <p className="text-xs lg:text-sm text-gray-500">{doctor.hospital}</p>

        {/* Availability & Contact */}
        <div className="mt-3 text-left">
          <p className="text-gray-700 text-xs lg:text-sm font-semibold">
            Available Time: <span className="font-normal">{doctor.availableTime}</span>
          </p>
          <p className="text-gray-700 text-xs lg:text-sm mt-1 font-semibold">
            Phone: <span className="font-normal">{doctor.phone}</span>
          </p>
        </div>

        {/* Doctor About Section */}
        <div className="mt-4 text-left">
          <h3 className="font-semibold text-sm lg:text-md text-black">About Doctor</h3>
          <p className="text-gray-600 text-justify text-xs lg:text-sm mt-1">{doctor.about}</p>
        </div>

        {/* Time Slot Selection */}
        <div className="mt-4">
          <h3 className="text-sm lg:text-md font-semibold text-red-600 mb-2 text-left">Set time slot</h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => setSelectedSlot(slot)}
                className={`px-4 py-2 rounded-lg border text-sm ${
                  selectedSlot === slot ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Book Now Button */}
        <div className="mt-6">
          <button
            className="w-full px-6 py-2 bg-blue-600 text-white text-md lg:text-lg font-semibold rounded-lg cursor-pointer hover:bg-red-600 transition shadow-lg shadow-blue-500/20 hover:shadow-red-500/20"
            onClick={() => setShowBookingForm(true)}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Recommended Doctors */}
      <div className="mt-10 w-full max-w-full">
        <h3 className="text-xl text-red-600 font-semibold mb-6 text-center">Recommended Doctors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedDoctors.map((recDoctor) => (
            <DoctorCard key={recDoctor._id} doctor={recDoctor} />
          ))}
        </div>
      </div>

      {/* Booking Form Popup */}
      {showBookingForm && <BookingForm doctor={doctor} timeSlot={selectedSlot} onClose={() => setShowBookingForm(false)} />}
    </motion.div>
  );
};

export default DoctorInfo;
