"use client";
import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import axios from "axios";

const BookingForm = ({ doctor, onClose, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    patientName: "",
    patientGender: "",
    patientAge: "",
    patientContact: "",
  });

  const [errors, setErrors] = useState({
    patientAge: "",
    patientContact: "",
  });

  const [selectedTime, setSelectedTime] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loadingAttraction, setLoadingAttraction] = useState(false);
  const [loadingClinic, setLoadingClinic] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formCompletion, setFormCompletion] = useState(0);
  const [bookingData, setBookingData] = useState(null);
  const receiptRef = useRef(null);

  // Fetch available shift times for the doctor
  const [shiftTimes, setShiftTimes] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);

  useEffect(() => {
    if (doctor && doctor._id && doctor.availableDate) {
      const fetchShiftTimes = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${doctor._id}/shift-times/${doctor.availableDate}`
          );
          setShiftTimes(response.data);
        } catch (error) {
          console.error("Error fetching shift times:", error);
        }
      };
      fetchShiftTimes();
    }
  }, [doctor]);

  const validateAge = (age) => {
    if (!age) return "Age is required";
    if (isNaN(age)) return "Age must be a number";
    if (age < 0) return "Age cannot be negative";
    if (age > 120) return "Age cannot be more than 120";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";
    if (!/^\d{10}$/.test(phone)) return "Phone must be 10 digits";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    // Validate fields
    if (name === "patientAge") {
      setErrors({ ...errors, patientAge: validateAge(value) });
    }
    if (name === "patientContact") {
      setErrors({ ...errors, patientContact: validatePhone(value) });
    }

    const filledFields = Object.values(updatedForm).filter(Boolean);
    setFormCompletion((filledFields.length / 4) * 100);
  };

  const handleBookingSubmit = async () => {
    try {
      setLoadingClinic(true);
      
      const requestData = {
        doctor_id: doctor._id,
        shift_time_id: selectedShift._id,
        patient_name: formData.patientName.trim(),
        patient_gender: formData.patientGender,
        patient_age: Number(formData.patientAge),
        patient_contact: formData.patientContact.trim(),
        appointment_date: doctor.availableDate,
        appointment_time: selectedShift.timeRange
      };
  
      console.log("Submitting to:", `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/appointments/create`);
      console.log("Request data:", requestData);
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/appointments/create`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
  
      console.log("Success response:", response.data);
      setBookingData(response.data);
      setIsConfirmed(true);
      onBookingSuccess?.();
  
    } catch (error) {
      console.error("Full error details:", {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        status: error.response?.status,
        response: error.response?.data
      });
  
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      "Booking failed. Please check console for details.";
      
      alert(`Error: ${errorMsg}`);
  
    } finally {
      setLoadingClinic(false);
    }
  };

  const downloadReceipt = async () => {
    try {
      setLoadingClinic(true);
      
      // Wait for DOM updates to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!receiptRef.current) {
        throw new Error("Receipt element not found");
      }

      // Create a clone of the receipt element to avoid styling issues
      const clone = receiptRef.current.cloneNode(true);
      clone.style.visibility = 'visible';
      clone.style.position = 'fixed';
      clone.style.left = '0';
      clone.style.top = '0';
      clone.style.zIndex = '9999';
      document.body.appendChild(clone);

      // Generate the canvas from the cloned element
      const canvas = await html2canvas(clone, {
        scale: 2, // Higher resolution
        logging: true, // For debugging
        useCORS: true, // For external images
        backgroundColor: '#ffffff', // White background
        allowTaint: true // For images that can't be cross-origin
      });

      // Remove the clone from DOM
      document.body.removeChild(clone);

      // Create download link
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png", 1.0); // Highest quality
      link.download = `Appointment_${bookingData?.referenceNumber || 'receipt'}.png`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Receipt generation error:", error);
      alert("Could not generate receipt. Please try again or take a screenshot.");
    } finally {
      setLoadingClinic(false);
    }
  };

  const generateQRCodeData = () => {
    if (!bookingData?.referenceNumber) return null;
    
    return JSON.stringify({
      doctor: doctor?.name || 'Unknown',
      clinic: doctor?.clinicName || doctor?.hospital || 'Unknown',
      city: doctor?.city || 'Unknown',
      date: doctor?.availableDate || new Date().toISOString().split('T')[0],
      time: selectedShift?.timeRange || 'Unknown',
      patient: formData.patientName || 'Unknown',
      phone: formData.patientContact || 'Unknown',
      reference: bookingData.referenceNumber,
      queue: bookingData.queueNumber || 'Unknown'
    });
  };

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
              <p><strong>Clinic center:</strong> {doctor.clinicName || doctor.hospital}</p>
              <p><strong>Available Date:</strong> {doctor.availableDate}</p>
            </div>

            <h3 className="font-bold mb-2">Set Time Slot</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {shiftTimes.map((shift) => (
                <button
                  key={shift._id}
                  className={`px-4 py-2 text-sm border rounded-md ${
                    selectedShift?._id === shift._id ? "bg-blue-500 text-white" : "bg-white text-black"
                  } hover:shadow-md transition ${shift.status !== 'Available' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => shift.status === 'Available' && setSelectedShift(shift)}
                  disabled={shift.status !== 'Available'}
                >
                  {shift.timeRange}
                  {shift.status !== 'Available' && ' (Unavailable)'}
                </button>
              ))}
            </div>

            <h3 className="font-bold mb-2">Patient Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  name="patientName"
                  placeholder="Name"
                  value={formData.patientName}
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <select
                  name="patientGender"
                  value={formData.patientGender}
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <input
                  type="number"
                  name="patientAge"
                  placeholder="Age"
                  value={formData.patientAge}
                  className={`border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-full ${
                    errors.patientAge ? "border-red-500" : ""
                  }`}
                  onChange={handleChange}
                  min="0"
                  max="120"
                  required
                />
                {errors.patientAge && (
                  <p className="text-red-500 text-xs mt-1">{errors.patientAge}</p>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  name="patientContact"
                  placeholder="Contact no (10 digits)"
                  value={formData.patientContact}
                  className={`border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-full ${
                    errors.patientContact ? "border-red-500" : ""
                  }`}
                  onChange={handleChange}
                  maxLength="10"
                  required
                />
                {errors.patientContact && (
                  <p className="text-red-500 text-xs mt-1">{errors.patientContact}</p>
                )}
              </div>
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
                  const ageError = validateAge(formData.patientAge);
                  const phoneError = validatePhone(formData.patientContact);
                  
                  setErrors({
                    patientAge: ageError,
                    patientContact: phoneError,
                  });

                  if (
                    !formData.patientName ||
                    !formData.patientGender ||
                    !formData.patientAge ||
                    !formData.patientContact ||
                    !selectedShift ||
                    ageError ||
                    phoneError
                  ) {
                    alert("Please fill in all fields correctly before confirming.");
                    return;
                  }
                  setShowConfirmDialog(true);
                }}
                disabled={!selectedShift}
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
                crossOrigin="anonymous"
              />
              <h2 className="text-xl font-bold text-green-600 mb-2">Booking Successful!</h2>
              <p className="text-gray-700">
                Reference No: <strong>{bookingData?.referenceNumber}</strong>
              </p>
              <p className="text-gray-700">
                Queue No: <strong>{bookingData?.queueNumber}</strong>
              </p>

              {/* QR Code Section */}
              <div className="flex flex-col items-center my-6">
                <p className="text-sm font-medium mb-3">Scan this QR code for appointment details</p>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  {generateQRCodeData() ? (
                    <QRCodeCanvas
                      value={generateQRCodeData()}
                      size={160}
                      level="H"
                      includeMargin={true}
                    />
                  ) : (
                    <div className="w-40 h-40 flex items-center justify-center bg-gray-100">
                      <p className="text-xs text-gray-500">QR Code not available</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm text-left space-y-2">
                <p><strong>Doctor:</strong> {doctor.name}</p>
                <p><strong>Clinic center:</strong> {doctor.clinicName || doctor.hospital}</p>
                <p><strong>City:</strong> {doctor.city}</p>
                <p><strong>Date:</strong> {doctor.availableDate}</p>
                <p><strong>Time Slot:</strong> {selectedShift?.timeRange}</p>
                <p><strong>Patient:</strong> {formData.patientName}</p>
                <p><strong>Gender:</strong> {formData.patientGender}</p>
                <p><strong>Age:</strong> {formData.patientAge}</p>
                <p><strong>Phone No:</strong> {formData.patientContact}</p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row mt-6 gap-4">
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded w-full sm:w-1/2"
                onClick={onClose}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-800 text-white rounded w-full sm:w-1/2"
                onClick={downloadReceipt}
                disabled={!bookingData?.referenceNumber}
              >
                Download Receipt
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
                    handleBookingSubmit();
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