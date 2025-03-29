"use client";
import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

const BookingForm = ({ doctor, onClose }) => {
  const [formData, setFormData] = useState({
    patientName: "",
    patientGender: "",
    patientAge: "",
    patientContact: "",
  });

  const [selectedTime, setSelectedTime] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loadingAttraction, setLoadingAttraction] = useState(false); // Loading state for attraction
  const [loadingClinic, setLoadingClinic] = useState(false); // Loading state for clinic center
  const referenceNumber = Math.floor(100000 + Math.random() * 900000);
  const receiptRef = useRef(null); // Ref for capturing receipt image

  const [formCompletion, setFormCompletion] = useState(0); // To track form completion

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update form completion progress
    const filledFields = Object.values(formData).filter((field) => field);
    setFormCompletion((filledFields.length / 4) * 100);
  };

  // Confirm Booking
  const handleConfirm = () => {
    if (!formData.patientName || !formData.patientGender || !formData.patientAge || !formData.patientContact || !selectedTime) {
      alert("Please fill in all fields and select a time slot before confirming.");
      return;
    }

    setLoadingAttraction(true); // Show attraction loading animation
    setLoadingClinic(true); // Show clinic center loading animation

    // Simulate a loading delay (can be replaced with actual API calls)
    setTimeout(() => {
      setLoadingAttraction(false); // Hide attraction loading animation
      setLoadingClinic(false); // Hide clinic center loading animation
      setIsConfirmed(true); // Show confirmation receipt
    }, 2000);
  };

  // Download receipt as an image
  const downloadReceipt = () => {
    html2canvas(receiptRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `Appointment_Receipt_${referenceNumber}.png`;
      link.click();
    });
  };

  // Get doctor's shift times
  const shiftTimes = [
    doctor.shift_time_1,
    doctor.shift_time_2,
    doctor.shift_time_3,
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center mt-20 bg-gray-300 bg-opacity-50">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-lg border border-gray-300">
        {/* Booking Form UI */}
        {!isConfirmed ? (
          <>
            <h2 className="text-xl font-bold text-center mb-4">Book an Appointment</h2>

            {/* Doctor Details */}
            <div className="bg-blue-50 p-4 rounded-lg shadow-md border border-gray-200 mb-4">
              <p><strong>Doctor:</strong> {doctor.name}</p>
              <p><strong>City:</strong> {doctor.city}</p>
              <p><strong>Clinical center:</strong> {doctor.hospital}</p>
              <p><strong>Available Date:</strong> {doctor.availableDate}</p>
            </div>

            {/* Shift Time Selection */}
            <h3 className="font-bold mb-2">Set Time Slot</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {shiftTimes.map((slot) => (
                <button
                  key={slot}
                  className={`px-4 py-2 border rounded-md ${
                    selectedTime === slot ? "bg-blue-500 text-white" : "bg-white text-black"
                  } hover:shadow-lg transition-transform transform hover:scale-105`}
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>

            {/* Patient Details */}
            <h3 className="font-bold mb-2">Patient Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input 
                type="text" 
                name="patientName" 
                placeholder="Name" 
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" 
                onChange={handleChange} 
              />
              <select 
                name="patientGender" 
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" 
                onChange={handleChange}
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input 
                type="number" 
                name="patientAge" 
                placeholder="Age" 
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" 
                onChange={handleChange} 
              />
              <input 
                type="text" 
                name="patientContact" 
                placeholder="Contact no" 
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" 
                onChange={handleChange} 
              />
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <progress value={formCompletion} max={100} className="w-full h-2 bg-gray-200 rounded-md">
                {formCompletion}%
              </progress>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded w-1/3" onClick={onClose}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded w-1/3" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </>
        ) : (
          // Confirmation Popup with Receipt
          <div className="text-center booking-success">
            {/* Booking Success GIF */}
            

            <div ref={receiptRef} className="p-4 pt-0 mt-[-15] border bg-gray-100 rounded-lg">
            <img
                src="/assets/booking_success.gif"
                alt="Booking Successful"
                className="mx-auto w-30 h-30 pt-0" // Adjusted size for GIF image
              />
              <h2 className="text-xl font-bold text-green-600">Booking Successful!</h2>
              <p className="text-gray-700">
                Reference No: <strong>{referenceNumber}</strong><br />
                Queue No: <strong>{}</strong>
              </p>

              {/* QR Code */}
              <div className="flex justify-center my-4">
                <QRCodeCanvas
                  value={`Doctor: ${doctor.name}, Specialization: ${doctor.speciality}, City: ${doctor.city}, Hospital: ${doctor.hospital}, Date: ${doctor.availableDate}, Time: ${selectedTime}, Ref: ${referenceNumber}, Patient: ${formData.patientName}`}
                  size={120}
                />
              </div>

              {/* Receipt Details */}
              <div className="text-sm text-left">
                <p><strong>Doctor:</strong> {doctor.name}</p>
                {/* <p><strong>Specialization:</strong> {doctor.speciality}</p> */}
                <p><strong>Clinic center:</strong> {doctor.hospital}</p>
                <p><strong>Date:</strong> {doctor.availableDate}</p>
                <p><strong>Time Slot:</strong> {selectedTime}</p>
                <p><strong>Patient:</strong> {formData.patientName}</p>
                <p><strong>Reference No:</strong> {referenceNumber}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-1 mt-4 gap-4">
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-800 cursor-pointer text-white rounded w-full"
                onClick={downloadReceipt}
              >
                Download
              </button>
              <button
                className="px-4  py-2 bg-red-500 hover:bg-red-700 text-white rounded w-full"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinners */}
        {loadingClinic && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10">
            <img src="/assets/loading.gif" alt="Loading" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
