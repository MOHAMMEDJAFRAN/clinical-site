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
  const referenceNumber = Math.floor(100000 + Math.random() * 900000);
  const receiptRef = useRef(null); // Ref for capturing receipt image

  // Generate time slots based on doctor's available hours
  const generateTimeSlots = (availableTime) => {
    if (!availableTime) return [];

    let [start, end] = availableTime.split("-").map((t) => parseInt(t));
    let slots = [];

    for (let hour = start; hour <= end; hour++) {
      slots.push(`${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots(doctor.availableTime);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Confirm Booking
  const handleConfirm = () => {
    if (!formData.patientName || !formData.patientGender || !formData.patientAge || !formData.patientContact ) {
      // || !selectedTime
      alert("Please fill in all fields and select a time slot before confirming.");
      return;
    }
    setIsConfirmed(true);
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

  return (
    <div className="fixed inset-0 flex items-center justify-center mt-20 bg-gray-300 bg-opacity-50">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-lg border border-gray-300">
        
        {/* Booking Form UI */}
        {!isConfirmed ? (
          <>
            <h2 className="text-xl font-bold text-center mb-4">Book an Appointment</h2>

            {/* Doctor Details */}
            <div className="mb-4 border-b pb-2 text-sm text-gray-700">
              <p><strong>Doctor:</strong> {doctor.name}</p>
              <p><strong>Specialization:</strong> {doctor.speciality}</p>
              <p><strong>City:</strong> {doctor.city}</p>
              <p><strong>Hospital:</strong> {doctor.hospital}</p>
              <p><strong>Available Date:</strong> {doctor.availableDate}</p>
              <p><strong>Available Time:</strong> {doctor.availableTime}</p>
            </div>

            {/* Time Slot Selection */}
            <h3 className="font-bold mb-2">Set Time Slot</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  className={`px-4 py-2 border rounded-md ${
                    selectedTime === slot ? "bg-blue-500 text-white" : "bg-white text-black"
                  }`}
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>

            {/* Patient Details */}
            <h3 className="font-bold mb-2">Patient Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" name="patientName" placeholder="Name" className="border p-2 rounded w-full" onChange={handleChange} />
              <select name="patientGender" className="border p-2 rounded w-full" onChange={handleChange}>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input type="number" name="patientAge" placeholder="Age" className="border p-2 rounded w-full" onChange={handleChange} />
              <input type="text" name="patientContact" placeholder="Contact no" className="border p-2 rounded w-full" onChange={handleChange} />
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
          <div className="text-center">
            <div ref={receiptRef} className="p-4 border bg-gray-100 rounded-lg">
              <h2 className="text-xl font-bold text-green-600">Booking Successful!</h2>
              <p className="text-gray-700">
                Reference No: <strong>{referenceNumber}</strong><br></br>
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
                <p><strong>Specialization:</strong> {doctor.speciality}</p>
                <p><strong>Hospital:</strong> {doctor.hospital}</p>
                <p><strong>Date:</strong> {doctor.availableDate}</p>
                <p><strong>Time Slot:</strong> {selectedTime}</p>
                <p><strong>Patient:</strong> {formData.patientName}</p>
                <p><strong>Reference No:</strong> {referenceNumber}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col mt-4">
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-800 cursor-pointer text-white rounded w-full mb-2"
                onClick={downloadReceipt}
              >
                Download Receipt
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded w-full"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
