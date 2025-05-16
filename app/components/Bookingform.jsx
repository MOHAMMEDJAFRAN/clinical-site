"use client";
import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import axios from "axios";
import { 
  FiX, 
  FiCheck, 
  FiDownload, 
  FiClock, 
  FiCalendar, 
  FiUser, 
  FiPhone, 
  FiMapPin,
  FiLoader
} from "react-icons/fi";

const BookingForm = ({ doctor, onClose, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    patientName: "",
    patientGender: "",
    patientAge: "",
    patientContact: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedShift, setSelectedShift] = useState(null);
  const [shiftTimes, setShiftTimes] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loadingClinic, setLoadingClinic] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formCompletion, setFormCompletion] = useState(0);
  const [bookingData, setBookingData] = useState(null);
  const [timeSlotError, setTimeSlotError] = useState("");
  const receiptRef = useRef(null);

  useEffect(() => {
    if (doctor?._id && doctor.availableDate) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${doctor._id}/shift-times/${doctor.availableDate}`)
        .then((res) => setShiftTimes(res.data))
        .catch((err) => console.error("Shift fetch error:", err));
    }
  }, [doctor]);

  const validateAge = (age) => {
    if (!age) return "Age is required";
    if (isNaN(age)) return "Age must be a number";
    if (age < 0 || age > 120) return "Age must be between 0 and 120";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone) return "Phone is required";
    if (!/^\d{10}$/.test(phone)) return "Must be 10 digits";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (name === "patientAge") setErrors({ ...errors, patientAge: validateAge(value) });
    if (name === "patientContact") setErrors({ ...errors, patientContact: validatePhone(value) });

    const filled = Object.values(updated).filter(Boolean).length;
    setFormCompletion((filled / 4) * 100);
  };

  const handleBookingSubmit = async () => {
    try {
      setLoadingClinic(true);
      const payload = {
        doctor_id: doctor._id,
        shift_time_id: selectedShift._id,
        patient_name: formData.patientName.trim(),
        patient_gender: formData.patientGender,
        patient_age: Number(formData.patientAge),
        patient_contact: formData.patientContact.trim(),
        appointment_date: doctor.availableDate,
        appointment_time: selectedShift.timeRange,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/appointments/create`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      setBookingData(response.data);
      setIsConfirmed(true);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed. Please try again.");
    } finally {
      setLoadingClinic(false);
    }
  };

  const downloadReceipt = async () => {
    try {
      setLoadingClinic(true);
  
      // Create QR image from canvas
      const originalCanvas = receiptRef.current.querySelector("canvas");
      const qrDataUrl = originalCanvas?.toDataURL("image/png");
  
      // Create plain container
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "400px";
      container.style.padding = "24px";
      container.style.backgroundColor = "#ffffff";
      container.style.fontFamily = "Arial, sans-serif";
      container.style.fontSize = "14px";
      container.style.color = "#000000";
      container.style.lineHeight = "1.5";
  
      // Plain HTML receipt content (no Tailwind)
      container.innerHTML = `
        <div style="text-align:center;margin-bottom:16px;">
          <h2 style="margin:0;font-size:18px;color:#16a34a;">Booking Confirmed</h2>
          <p>Your appointment has been successfully booked</p>
        </div>
  
        ${
          qrDataUrl
            ? `<div style="text-align:center;margin:12px 0;">
                <img src="${qrDataUrl}" width="120"  height="120" alt="QR Code" style="display: block; margin: 0 auto;"/>
                <p style="font-size:12px;color:#555;margin-top:6px;">Scan this QR code at the clinic</p>
              </div>`
            : ""
        }
  
        <div style="margin-top:20px;">
          <p><strong>Reference:</strong> ${bookingData?.referenceNumber}</p>
          <p><strong>Queue No:</strong> ${bookingData?.queueNumber}</p>
          <p><strong>Doctor:</strong> ${doctor?.name}</p>
          <p><strong>Clinic:</strong> ${doctor?.clinicName || doctor?.hospital}, ${doctor?.clinicCity || 'Clinic location'}</p>
          <p><strong>Patient:</strong> ${formData.patientName}</p>
          <p><strong>Date & Time:</strong> ${doctor?.availableDate}, ${selectedShift?.timeRange}</p>
          <p><strong>Contact:</strong> ${formData.patientContact}</p>
        </div>
      `;
  
      document.body.appendChild(container);
      await new Promise((res) => setTimeout(res, 300));
  
      const canvas = await html2canvas(container, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });
  
      document.body.removeChild(container);
  
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `Appointment_${bookingData?.referenceNumber || Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Final receipt download failed:", err);
      alert("Receipt failed. Please take a screenshot.");
    } finally {
      setLoadingClinic(false);
    }
  };
  

  const generateQRCodeData = () => {
    if (!bookingData?.referenceNumber) return null;
    return JSON.stringify({
      doctor: doctor?.name || "Unknown",
      clinic: doctor?.clinicName || doctor?.hospital || "Unknown",
      clinicCity: doctor?.clinicCity || "Unknown",
      date: doctor?.availableDate || new Date().toISOString().split("T")[0],
      time: selectedShift?.timeRange || "Unknown",
      patient: formData.patientName,
      phone: formData.patientContact,
      reference: bookingData.referenceNumber,
      queue: bookingData.queueNumber || "N/A",
    });
  };

  const handleSubmitAttempt = () => {
    const ageError = validateAge(formData.patientAge);
    const phoneError = validatePhone(formData.patientContact);
    setErrors({ patientAge: ageError, patientContact: phoneError });
    
    if (!selectedShift) {
      setTimeSlotError("Please select a time slot");
      return;
    } else {
      setTimeSlotError("");
    }

    if (
      !formData.patientName ||
      !formData.patientGender ||
      !formData.patientAge ||
      !formData.patientContact ||
      ageError ||
      phoneError
    ) {
      alert("Please fill all required fields correctly before submitting.");
      return;
    }

    setShowConfirmDialog(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 overflow-y-auto">
      {/* Loading Overlay */}
      {loadingClinic && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80">
          <FiLoader className="animate-spin text-blue-600 text-4xl mb-4" />
          <p className="text-gray-700">
            {isConfirmed ? "Downloading receipt..." : "Processing your booking..."}
          </p>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close booking form"
        >
          <FiX className="text-gray-500 text-xl" />
        </button>

        {!isConfirmed ? (
          // Booking Form
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 text-gray-800">Book an Appointment</h2>

            {/* Doctor Info Card */}
            <div className="bg-blue-50 p-3 md:p-4 rounded-lg mb-4 md:mb-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FiUser className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                  <p className="text-xs md:text-sm text-gray-600">{doctor.specialization}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm">
                <div className="flex text-gray-500 items-center gap-2">
                  <FiMapPin className="text-gray-500" />
                  <span>{doctor.clinicName || doctor.hospital}, {doctor.clinicCity || 'Clinic location'}</span>
                </div>
                <div className="flex text-gray-500 items-center gap-2">
                  <FiCalendar className="text-gray-500" />
                  <span>{doctor.availableDate}</span>
                </div>
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="mb-4 md:mb-6">
              <h3 className="font-semibold text-gray-700 mb-2 md:mb-3 flex items-center gap-2">
                <FiClock className="text-blue-500" />
                Select Time Slot
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {shiftTimes.map((shift) => (
                  <button
                    key={shift._id}
                    disabled={shift.status !== "Available"}
                    className={`px-2 py-1 text-gray-600 md:px-4 md:py-2 text-xs md:text-sm rounded-lg border transition-all ${
                      selectedShift?._id === shift._id 
                        ? "bg-blue-600 text-white border-blue-600" 
                        : "bg-white border-gray-300 hover:border-blue-300"
                    } ${
                      shift.status !== "Available" 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "hover:shadow-md"
                    }`}
                    onClick={() => {
                      setSelectedShift(shift);
                      setTimeSlotError("");
                    }}
                  >
                    {shift.timeRange}
                    {shift.status !== "Available" && (
                      <span className="block text-xxs md:text-xs mt-1">Booked</span>
                    )}
                  </button>
                ))}
              </div>
              {timeSlotError && (
                <p className="text-red-500 text-xs mt-1">{timeSlotError}</p>
              )}
            </div>

            {/* Patient Details Form */}
            <div className="mb-4 md:mb-6">
              <h3 className="font-semibold text-gray-700 mb-2 md:mb-3">Patient Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold md:text-sm text-gray-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    placeholder="Patient Name"
                    className="w-full text-gray-600 p-2 md:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-xs md:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold md:text-sm text-gray-600 mb-1">Gender *</label>
                  <select
                    name="patientGender"
                    value={formData.patientGender}
                    onChange={handleChange}
                    className="w-full text-gray-600 p-2 md:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-xs md:text-sm"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold md:text-sm text-gray-600 mb-1">Age *</label>
                  <input
                    type="number"
                    name="patientAge"
                    value={formData.patientAge}
                    onChange={handleChange}
                    placeholder="Age"
                    className={`w-full text-gray-600 p-2 md:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-xs md:text-sm ${
                      errors.patientAge ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.patientAge && <p className="text-red-500 text-xxs md:text-xs mt-1">{errors.patientAge}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold md:text-sm text-gray-600 mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    name="patientContact"
                    value={formData.patientContact}
                    onChange={handleChange}
                    placeholder="10 digit phone number"
                    className={`w-full text-gray-600 p-2 md:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-xs md:text-sm ${
                      errors.patientContact ? "border-red-500" : ""
                    }`}
                    maxLength="10"
                    required
                  />
                  {errors.patientContact && <p className="text-red-500 text-xxs md:text-xs mt-1">{errors.patientContact}</p>}
                </div>
              </div>
            </div>

            {/* Form Completion Progress */}
            <div className="mb-4 md:mb-6">
              <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-1">
                <span>Form Completion</span>
                <span>{Math.round(formCompletion)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${formCompletion}%` }}
                ></div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 md:gap-4">
              <button
                onClick={handleSubmitAttempt}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 md:py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg text-sm md:text-base"
                disabled={loadingClinic}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        ) : (
          // Confirmation Receipt
          <div className="p-4 md:p-6">
            <div 
              ref={receiptRef} 
              className="p-4 md:p-6 bg-white border border-gray-200 rounded-xl max-w-md mx-auto"
              style={{
                backgroundColor: '#ffffff',
                color: '#333333',
                fontFamily: 'Arial, sans-serif'
              }}
            >
              {/* Success Header */}
              <div className="text-center mb-4 md:mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <FiCheck className="text-green-600 text-3xl md:text-4xl" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-green-600 mb-1 md:mb-2">Booking Confirmed</h2>
                <p className="text-xs md:text-sm text-gray-600">Your appointment has been successfully booked</p>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center mb-4 md:mb-6">
                <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm">
                  <QRCodeCanvas 
                    value={generateQRCodeData()} 
                    size={120} 
                    level="H" 
                    includeMargin 
                  />
                </div>
                <p className="text-xxs md:text-xs text-gray-500 mt-2 md:mt-3">Scan this QR code at the clinic</p>
              </div>

              {/* Booking Details */}
              <div className="space-y-3 mb-4 md:mb-6 text-xs md:text-sm">
                <div className="flex justify-between border-b pb-1 md:pb-2">
                  <span className="text-gray-600">Reference Number:</span>
                  <span className="font-medium text-gray-600">{bookingData?.referenceNumber}</span>
                </div>
                <div className="flex justify-between border-b pb-1 md:pb-2">
                  <span className="text-gray-600">Queue Number:</span>
                  <span className="font-medium text-gray-600">{bookingData?.queueNumber}</span>
                </div>
                <div className="flex justify-between border-b pb-1 md:pb-2">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-medium text-gray-600">{doctor.name}</span>
                </div>
                <div className="flex justify-between border-b pb-1 md:pb-2">
                  <span className="text-gray-600">Clinic:</span>
                  <span className="font-medium text-gray-600">{doctor.clinicName || doctor.hospital}, {doctor.clinicCity || 'Clinic location'}</span>
                </div>
                <div className="flex justify-between border-b pb-1 md:pb-2">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium text-gray-600">
                    {doctor.availableDate}, {selectedShift?.timeRange}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1 md:pb-2">
                  <span className="text-gray-600">Patient:</span>
                  <span className="font-medium text-gray-600">{formData.patientName}</span>
                </div>
                <div className="flex justify-between border-b pb-1 md:pb-2">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium text-gray-600">{formData.patientContact}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    onBookingSuccess?.();
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 md:py-3 rounded-lg font-medium transition-colors text-xs md:text-sm"
                >
                  Close
                </button>
                <button
                  onClick={downloadReceipt}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 md:py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm"
                >
                  <FiDownload className="text-xs md:text-sm" />
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
            <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-sm shadow-xl">
              <h3 className="text-lg md:text-xl font-semibold text-center mb-3 md:mb-4 text-gray-800">Confirm Booking?</h3>
              <p className="text-xs md:text-sm text-gray-600 text-center mb-4 md:mb-6">
                Are you sure you want to book this appointment with {doctor.name} at {doctor.clinicName || doctor.hospital}?
              </p>
              <div className="flex gap-3 md:gap-4">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors text-xs md:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirmDialog(false);
                    handleBookingSubmit();
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-xs md:text-sm"
                >
                  Confirm
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