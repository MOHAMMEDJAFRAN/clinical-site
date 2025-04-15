"use client";
import React, { useState, useRef, useEffect } from "react";
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
  const [loadingAttraction, setLoadingAttraction] = useState(false);
  const [loadingClinic, setLoadingClinic] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formCompletion, setFormCompletion] = useState(0);
  const referenceNumber = Math.floor(100000 + Math.random() * 900000);
  const receiptRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    const filledFields = Object.values(updatedForm).filter(Boolean);
    setFormCompletion((filledFields.length / 4) * 100);
  };

  const handleConfirm = () => {
    if (
      !formData.patientName ||
      !formData.patientGender ||
      !formData.patientAge ||
      !formData.patientContact ||
      !selectedTime
    ) {
      alert("Please fill in all fields and select a time slot before confirming.");
      return;
    }

    setLoadingAttraction(true);
    setLoadingClinic(true);

    setTimeout(() => {
      setLoadingAttraction(false);
      setLoadingClinic(false);
      setIsConfirmed(true);
    }, 2000);
  };

  const downloadReceipt = () => {
    html2canvas(receiptRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `Appointment_Receipt_${referenceNumber}.png`;
      link.click();
    });
  };

  const shiftTimes = [
    doctor.shift_time_1,
    doctor.shift_time_2,
    doctor.shift_time_3,
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 z-50 p-4 overflow-auto">
      {/* Loading Spinner */}
      {loadingClinic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-30">
          <svg className="animate-spin h-16 w-16 text-blue-500" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
            <path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-9.63-9.63A1.5,1.5,0,0,0,12,2.5h0A1.5,1.5,0,0,0,12,4Z"/>
          </svg>
        </div>
      )}

      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-2xl border border-gray-300 relative">
        {!isConfirmed ? (
          <>
            <h2 className="text-xl font-bold text-center mb-4">Book an Appointment</h2>

            <div className="bg-blue-50 text-sm p-4 rounded-lg shadow-sm border mb-4">
              <p><strong>Doctor:</strong> {doctor.name}</p>
              <p><strong>City:</strong> {doctor.city}</p>
              <p><strong>Clinic center:</strong> {doctor.hospital}</p>
              <p><strong>Available Date:</strong> {doctor.availableDate}</p>
            </div>

            <h3 className="font-bold mb-2">Set Time Slot</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {shiftTimes.map((slot) => (
                <button
                  key={slot}
                  className={`px-4 py-2 text-sm border rounded-md ${
                    selectedTime === slot ? "bg-blue-500 text-white" : "bg-white text-black"
                  } hover:shadow-md transition`}
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>

            <h3 className="font-bold mb-2">Patient Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="patientName"
                placeholder="Name"
                value={formData.patientName}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={handleChange}
              />
              <select
                name="patientGender"
                value={formData.patientGender}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
                value={formData.patientAge}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={handleChange}
              />
              <input
                type="text"
                name="patientContact"
                placeholder="Contact no"
                value={formData.patientContact}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <progress value={formCompletion} max={100} className="w-full h-2 rounded-md bg-gray-200">
                {formCompletion}%
              </progress>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 mt-4">
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded w-full sm:w-1/2"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded w-full sm:w-1/2"
                onClick={() => {
                  if (
                    !formData.patientName ||
                    !formData.patientGender ||
                    !formData.patientAge ||
                    !formData.patientContact ||
                    !selectedTime
                  ) {
                    alert("Please fill in all fields and select a time slot before confirming.");
                    return;
                  }
                  setShowConfirmDialog(true);
                }}
              >
                Confirm
              </button>
            </div>
          </>
        ) : (
          <div className="text-center booking-success">
            <div ref={receiptRef} className="p-4 pt-0 border bg-gray-100 rounded-lg">
              <img
                src="/assets/booking_success.gif"
                alt="Booking Successful"
                className="mx-auto w-24 h-24 mb-4"
              />
              <h2 className="text-xl font-bold text-green-600 mb-2">Booking Successful!</h2>
              <p className="text-gray-700">
                Reference No: <strong>{referenceNumber}</strong>
              </p>
              <p className="text-gray-700">
                Queue No: <strong>{/* queue */}</strong>
              </p>

              <div className="flex justify-center my-4">
                <QRCodeCanvas
                  value={`Doctor: ${doctor.name}, Clinic center: ${doctor.hospital}, City: ${doctor.city}, Date: ${doctor.availableDate}, Time: ${selectedTime},Patient: ${formData.patientName},phone: ${formData.patientContact}`}
                  size={120}
                />
              </div>

              <div className="text-sm text-left">
                <p><strong>Doctor:</strong> {doctor.name}</p>
                <p><strong>Clinic center:</strong> {doctor.hospital}</p>
                <p><strong>City:</strong> {doctor.city}</p>
                <p><strong>Date:</strong> {doctor.availableDate}</p>
                <p><strong>Time Slot:</strong> {selectedTime}</p>
                <p><strong>Patient:</strong> {formData.patientName}</p>
                <p><strong>Phone No:</strong> {formData.patientContact}</p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row mt-4 gap-4">
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded w-full sm:w-1/2"
                onClick={onClose}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-800 text-white rounded w-full sm:w-1/2"
                onClick={downloadReceipt}
              >
                Download
              </button>
            </div>
          </div>
        )}

        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-sm">
              <h3 className="text-lg font-semibold text-center mb-4">
                Are you sure you want to confirm the booking?
              </h3>
              <div className="flex justify-center gap-8">
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  No
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
                  onClick={() => {
                    setShowConfirmDialog(false);
                    handleConfirm();
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;