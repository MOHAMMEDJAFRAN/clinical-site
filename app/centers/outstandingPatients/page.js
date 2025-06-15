'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiPrinter, FiUser, FiPhone, FiArrowLeft, FiClock, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {FaSpinner} from 'react-icons/fa'

const OutstandingPatients = () => {
  const router = useRouter();
  const [clinicId, setClinicId] = useState(null);
  const [clinicData, setClinicData] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [shiftTimes, setShiftTimes] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showTrendingPopup, setShowTrendingPopup] = useState(false);

  // State management
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    doctorId: '',
    shiftTimeId: '',
    fullName: '',
    gender: '',
    age: '',
    contactNumber: ''
  });

  const [formErrors, setFormErrors] = useState({
    doctorId: '',
    shiftTimeId: '',
    fullName: '',
    gender: '',
    age: '',
    contactNumber: ''
  });

  // Check authentication and load clinic ID
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const profileData = JSON.parse(localStorage.getItem('profileData'));
        const merchantData = JSON.parse(localStorage.getItem('profileData'));
        
        if (!profileData && !merchantData) {
          toast.error('Please login to access this page');
          router.push('/login');
          return;
        }

        let clinicIdToSet = null;
        let clinicDataToSet = {
          name: '',
          address: '',
          phone: '',
          email: ''
        };

        // For staff profile
        if (profileData?.clinicId) {
          clinicIdToSet = profileData.clinicId;
            try {
              const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/outstanding/merchants/${profileData.clinicId}`
              );
              clinicDataToSet = {
                name: res.data.name,
                address: res.data.address,
                phone: res.data.phone,
                email: res.data.email
              };
            } catch (error) {
              console.error('Error fetching merchant details:', error);
            }
          
        } 
        // For merchant profile
        else if (merchantData?.id) {
          clinicIdToSet = merchantData.id;
          try {
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/outstanding/merchants/${merchantData.id}`
            );
            clinicDataToSet = {
              name: res.data.name,
              address: res.data.address,
              phone: res.data.phone,
              email: res.data.email
            };
          } catch (error) {
            console.error('Error fetching merchant details:', error);
          }
        } else {
          toast.error('No clinic associated with this account');
          router.push('/login');
          return;
        }
        
        if ((profileData || merchantData)?.isApproved === false) {
          toast.error('Your clinic is not yet approved');
          router.push('/login');
          return;
        }

        setClinicId(clinicIdToSet);
        setClinicData(clinicDataToSet);
        
        // Show trending popup after 3 seconds
        setTimeout(() => {
          setShowTrendingPopup(true);
        }, 3000);
      } catch (error) {
        console.error('Authentication check error:', error);
        toast.error('Failed to verify authentication');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // Fetch clinic data when clinicId is available
  useEffect(() => {
    if (!clinicId) return;

    const fetchClinicData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch doctors for this clinic
        const doctorsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/outstanding/clinics/${clinicId}/doctors`
        );
        setDoctors(doctorsRes.data);

        // Fetch appointments for this clinic
        const appointmentsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/outstanding/clinics/${clinicId}/appointments`
        );
        setAppointments(appointmentsRes.data);
        setFilteredAppointments(appointmentsRes.data);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching clinic data:', error);
        toast.error('Failed to load clinic data');
        setIsLoading(false);
      }
    };

    fetchClinicData();
  }, [clinicId]);

  // Fetch shift times when doctor is selected
  useEffect(() => {
    if (!selectedDoctorId || !clinicId) return;

    const fetchShiftTimes = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/outstanding/clinics/${clinicId}/doctors/${selectedDoctorId}/shift-times?date=${selectedDate}`
        );
        setShiftTimes(res.data);
      } catch (error) {
        console.error('Error fetching shift times:', error);
        toast.error('Failed to load available times');
      }
    };

    fetchShiftTimes();
  }, [selectedDoctorId, clinicId, selectedDate]);

  // Filter appointments based on search term
  useEffect(() => {
    const results = appointments.filter(appointment =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAppointments(results);
  }, [searchTerm, appointments]);

  // Validate form fields
  const validateField = (name, value) => {
    let error = '';
    
    if (!value) {
      error = 'This field is required';
    } else {
      switch (name) {
        case 'age':
          if (isNaN(value) || value < 0 || value > 120) {
            error = 'Age must be between 0 and 120';
          }
          break;
        case 'contactNumber':
          if (!/^\d{10}$/.test(value)) {
            error = 'Phone number must be 10 digits';
          }
          break;
        default:
          break;
      }
    }
    
    return error;
  };

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate the field
    const error = validateField(name, value);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // If doctor selection changed, update selectedDoctorId
    if (name === 'doctorId') {
      setSelectedDoctorId(value);
    }
  };

  // Validate entire form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });
    
    setFormErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    try {
      const selectedShiftTime = shiftTimes.find(t => t._id === formData.shiftTimeId);
      const [startTime, endTime] = selectedShiftTime?.timeRange.split(' - ') || ['', ''];
      
      const appointmentData = {
        doctorId: formData.doctorId,
        shiftTimeId: formData.shiftTimeId,
        patientName: formData.fullName,
        patientGender: formData.gender,
        patientAge: formData.age,
        patientContact: formData.contactNumber,
        appointmentDate: selectedDate,
        appointmentTime: startTime,
        endTime: endTime
      };

      // Show confirmation dialog
      if (window.confirm('Are you sure you want to confirm this booking?')) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/outstanding/clinics/${clinicId}/appointments`,
          appointmentData
        );

        const newAppointment = response.data;
        
        // Update state with the new appointment
        setAppointments([...appointments, newAppointment]);
        setFilteredAppointments([...appointments, newAppointment]);
        
        // Reset form
        setFormData({
          doctorId: '',
          shiftTimeId: '',
          fullName: '',
          gender: '',
          age: '',
          contactNumber: ''
        });
        
        // Show receipt
        setCurrentReceipt({
          ...newAppointment,
          patient: {
            fullName: newAppointment.patientName,
            gender: newAppointment.patientGender,
            age: newAppointment.patientAge,
            contactNumber: newAppointment.patientContact
          },
          clinicName: clinicData.name,
          address: clinicData.address,
          phone: clinicData.phone,
          email: clinicData.email,
          endTime: endTime
        });
        setIsFormOpen(false);
        setIsReceiptOpen(true);
        
        toast.success('Appointment booked successfully!');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  // Print receipt
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const selectedDoctor = doctors.find(d => d._id === currentReceipt.doctor);
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Appointment Receipt - ${currentReceipt.referenceNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            body {
              font-family: 'Poppins', sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .receipt-container {
              max-width: 500px;
              margin: 0 auto;
              border: 1px solid #eee;
              padding: 15px;
              box-shadow: 0 0 15px rgba(0,0,0,0.1);
              border-radius: 10px;
            }
            .header {
              text-align: center;
              margin-bottom: 5px;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            .clinic-name {
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 5px;
              color: #3b82f6;
            }
            .clinic-details {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 2px;
            }
            .receipt-info {
              margin-bottom: 20px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
              background-color: #f9fafb;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              font-size: 13px;
            }
            .info-label {
              font-weight: 500;
              color: #6b7280;
            }
            .info-value {
              font-weight: 500;
              color: #111827;
            }
            .section {
              margin-bottom: 5px;
            }
            .section-title {
              font-weight: 600;
              margin-bottom: 2px;
              color: #111827;
              border-bottom: 1px dashed #e5e7eb;
              padding-bottom: 5px;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .patient-info, .doctor-info {
              display: flex;
              gap: 15px;
              margin-bottom: 2px;
              font-size: 12px;
              padding: 5px;
              background-color: #f9fafb;
              border-radius: 8px;
              align-items: center;
            }
            .icon {
              color: #3b82f6;
              background-color: #dbeafe;
              padding: 8px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .footer {
              text-align: center;
              margin-top: 15px;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 8px;
            }
            .time-range {
              display: flex;
              align-items: center;
              gap: 5px;
              font-size: 12px;
              color: #6b7280;
              margin-top: 3px;
            }
            @media print {
              body {
                padding: 0;
              }
              .receipt-container {
                box-shadow: none;
                border: none;
                padding: 10px;
              }
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <div class="clinic-name">${currentReceipt.clinicName || 'Clinic'}</div>
              <div class="clinic-details">${currentReceipt.address || 'Address not available'}</div>
              ${currentReceipt.phone ? `<div class="clinic-details">Phone: ${currentReceipt.phone}</div>` : ''}
              
            </div>
            
            <div class="receipt-info">
              <div class="info-row">
                <span class="info-label">Reference No:</span>
                <span class="info-value">${currentReceipt.referenceNumber}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Queue No:</span>
                <span class="info-value">${currentReceipt.queueNumber}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value">${formatDate(currentReceipt.appointmentDate)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Time:</span>
                <span class="info-value">
                  ${currentReceipt.appointmentTime} - ${currentReceipt.endTime}
                  
                </span>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">PATIENT INFORMATION</div>
              <div class="patient-info">
                <div class="icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <div style="font-weight: 500;">${currentReceipt.patient.fullName}</div>
                  <div>${currentReceipt.patient.gender}, ${currentReceipt.patient.age} years</div>
                  <div>${currentReceipt.patient.contactNumber}</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">DOCTOR INFORMATION</div>
              <div class="doctor-info">
                <div class="icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <div style="font-weight: 500;">${selectedDoctor?.name || 'Doctor'}</div>
                  <div>${selectedDoctor?.specialization || 'General Practitioner'}</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <ul style="font-size: 12px; padding-left: 20px; margin-top: 5px;">
                <li>Please arrive 15 minutes before your appointment time</li>
                
              </ul>
            </div>
            
            <div class="footer">
              <div>Thank you for choosing ${currentReceipt.clinicName || 'our clinic'}</div>
              <div style="margin-top: 5px;">Generated on ${new Date().toLocaleString()}</div>
            </div>
          </div>
          <script>
            setTimeout(function() {
              window.print();
              window.close();
            }, 200);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
                                            <div className="flex flex-col items-center">
                                              <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
                                              <p className="text-gray-600">Loading appointments...</p>
                                            </div>
                                          </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4 md:p-6 relative">
      {/* Trending Popup */}
      {showTrendingPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowTrendingPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FiAlertCircle className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Appointment Reminder</h3>
                <p className="text-gray-600 mb-4">
                  Book your appointments in advance to secure your preferred time slots. 
                  Our trending time slots fill up quickly!
                </p>
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">Popular Time Slots</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="bg-yellow-100 px-2 py-1 rounded">9:00 AM - 10:00 AM</span>
                      <span className="text-xs text-yellow-600">80% booked</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-yellow-100 px-2 py-1 rounded">2:00 PM - 3:00 PM</span>
                      <span className="text-xs text-yellow-600">65% booked</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setShowTrendingPopup(false);
                    setIsFormOpen(true);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Outstanding Patients</h1>
            <p className="text-gray-500 mt-1">Manage patient appointments</p>
          </div>
          
          {/* Search and Add Appointment */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="pl-10 pr-4 text-gray-600 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setIsFormOpen(true);
                setIsReceiptOpen(false);
                setSelectedAppointment(null);
              }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <FiPlus className="text-lg" /> New Appointment
            </button>
          </div>
        </div>

        {/* Main Content */}
        {isFormOpen ? (
          /* Appointment Form */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center gap-3">
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-full hover:bg-blue-500 transition-colors"
              >
                <FiArrowLeft className="text-lg" />
              </button>
              <h2 className="text-lg font-semibold">New Appointment</h2>
            </div>
            <div className="p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor *</label>
                    <select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-gray-500 border ${formErrors.doctorId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    >
                      <option value="">Choose a doctor</option>
                      {doctors.map(doctor => (
                        <option key={doctor._id} value={doctor._id}>
                          {doctor.name} ({doctor.specialization || 'General'})
                        </option>
                      ))}
                    </select>
                    {formErrors.doctorId && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.doctorId}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Shift Time *</label>
                    <select
                      name="shiftTimeId"
                      value={formData.shiftTimeId}
                      onChange={handleInputChange}
                      className={`w-full text-gray-500 px-3 py-2 border ${formErrors.shiftTimeId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                      disabled={!formData.doctorId}
                    >
                      <option value="">{formData.doctorId ? 'Choose a shift time' : 'Select doctor first'}</option>
                      {shiftTimes.map(time => (
                        <option key={time._id} value={time._id}>
                          {time.shiftName}: {time.timeRange}
                        </option>
                      ))}
                    </select>
                    {formErrors.shiftTimeId && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.shiftTimeId}</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Patient Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-3 text-gray-500 py-2 border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                        placeholder="John Doe"
                      />
                      {formErrors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`w-full px-3 text-gray-500 py-2 border ${formErrors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {formErrors.gender && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.gender}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className={`w-full px-3 text-gray-500 py-2 border ${formErrors.age ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                        placeholder="30"
                        min="0"
                        max="120"
                      />
                      {formErrors.age && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.age}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className={`w-full px-3 text-gray-500 py-2 border ${formErrors.contactNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                        placeholder="1234567890"
                        maxLength="10"
                        pattern="[0-9]{10}"
                      />
                      {formErrors.contactNumber && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.contactNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : isReceiptOpen ? (
          /* Receipt View */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
              <h2 className="text-lg font-semibold">Appointment Receipt</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsReceiptOpen(false);
                    setCurrentReceipt(null);
                  }}
                  className="px-3 py-1.5 border border-white/30 rounded-md text-white hover:bg-blue-500 transition-colors text-sm"
                >
                  Back
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm transition-colors shadow-sm"
                >
                  <FiPrinter /> Print Receipt
                </button>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-center mb-6 border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-bold text-gray-800">{currentReceipt.clinicName || 'Clinic'}</h2>
                  <p className="text-gray-500 text-sm">{currentReceipt.address || 'Address not available'}</p>
                  {currentReceipt.phone && <p className="text-gray-500 text-sm">Phone: {currentReceipt.phone}</p>}
                  {currentReceipt.email && <p className="text-gray-500 text-sm">Email: {currentReceipt.email}</p>}
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-blue-600">Appointment Confirmation</h3>
                  <p className="text-gray-500 text-sm">Reference: {currentReceipt.referenceNumber}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-700">Queue No:</p>
                      <p className="font-medium text-gray-500 text-sm">{currentReceipt.queueNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">Date:</p>
                      <p className="font-medium text-gray-500 text-sm">{formatDate(currentReceipt.appointmentDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">Time:</p>
                      <p className="font-medium text-gray-500 text-sm flex items-center gap-1">
                        <FiClock className="text-sm" />
                        {currentReceipt.appointmentTime} - {currentReceipt.endTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">Status:</p>
                      <p className="font-medium text-green-600 text-sm">Confirmed</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-3 border-b border-gray-100 pb-1">
                      Patient Information
                    </h4>
                    <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FiUser className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">{currentReceipt.patient.fullName}</p>
                        <p className="text-gray-600 text-sm">
                          {currentReceipt.patient.gender}, {currentReceipt.patient.age} years
                        </p>
                        <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                          <FiPhone className="text-sm" /> {currentReceipt.patient.contactNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-3 border-b border-gray-100 pb-1">
                      Doctor Information
                    </h4>
                    <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-green-100 p-2 rounded-full">
                        <FiUser className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">
                          {doctors.find(d => d._id === currentReceipt.doctor)?.name || 'Doctor'}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {doctors.find(d => d._id === currentReceipt.doctor)?.specialization || 'General Practitioner'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">Important Notes</h4>
                  <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-1">
                    <li>Please arrive 15 minutes before your appointment time</li>
                    
                  </ul>
                </div>

                <div className="text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
                  <p>Thank you for choosing {currentReceipt.clinicName || 'our clinic'}</p>
                  <p className="mt-1">Generated on {new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ) : selectedAppointment ? (
          /* Appointment Detail View */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center gap-3">
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="p-1 rounded-full hover:bg-blue-500 transition-colors"
              >
                <FiArrowLeft className="text-lg" />
              </button>
              <h2 className="text-lg font-semibold">Appointment Details</h2>
              <button
                onClick={() => {
                  setCurrentReceipt({
                    ...selectedAppointment,
                    patient: {
                      fullName: selectedAppointment.patientName,
                      gender: selectedAppointment.patientGender,
                      age: selectedAppointment.patientAge,
                      contactNumber: selectedAppointment.patientContact
                    },
                    clinicName: clinicData.name,
                    address: clinicData.address,
                    phone: clinicData.phone,
                    email: clinicData.email,
                    endTime: selectedAppointment.endTime
                  });
                  setIsReceiptOpen(true);
                }}
                className="ml-auto flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm transition-colors shadow-sm"
              >
                <FiPrinter /> Print Receipt
              </button>
            </div>
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Appointment Info</h3>
                    <div className="space-y-2">
                      <p className="flex justify-between">
                        <span className="text-gray-600">Reference No:</span>
                        <span className="font-medium text-gray-500">{selectedAppointment.referenceNumber}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Queue No:</span>
                        <span className="font-medium text-gray-500">{selectedAppointment.queueNumber}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium text-gray-500">{formatDate(selectedAppointment.appointmentDate)}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium text-gray-500 flex items-center gap-1">
                          <FiClock className="text-sm" />
                          {selectedAppointment.appointmentTime} - {selectedAppointment.endTime}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-green-600">Confirmed</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Doctor Info</h3>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FiUser className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">
                          {doctors.find(d => d._id === selectedAppointment.doctor)?.name || 'Doctor'}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {doctors.find(d => d._id === selectedAppointment.doctor)?.specialization || 'General Practitioner'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Patient Info</h3>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <FiUser className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">{selectedAppointment.patientName}</p>
                        <p className="text-gray-600 text-sm">{selectedAppointment.patientGender}, {selectedAppointment.patientAge} years</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <FiPhone className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">{selectedAppointment.patientContact}</p>
                        <p className="text-gray-600 text-sm">Contact Number</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Clinic Info</h3>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-700">{clinicData.name}</p>
                      <p className="text-gray-600 text-sm">{clinicData.address}</p>
                      {clinicData.phone && <p className="text-gray-600 text-sm">Phone: {clinicData.phone}</p>}
                      {clinicData.email && <p className="text-gray-600 text-sm">Email: {clinicData.email}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Appointment List */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <h2 className="text-lg font-semibold">All Appointments</h2>
              <p className="text-sm text-blue-100">{filteredAppointments.length} appointments found</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference No
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(appointment => (
                      <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {appointment.referenceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <p className="font-medium">{appointment.patientName}</p>
                            <p className="text-gray-400">{appointment.patientContact}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <p className="font-medium">
                              {doctors.find(d => d._id === appointment.doctor)?.name || 'Doctor'}
                            </p>
                            <p className="text-gray-400">
                              {doctors.find(d => d._id === appointment.doctor)?.specialization || 'General Practitioner'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <p>{formatDate(appointment.appointmentDate)}</p>
                            <p className="text-gray-400 flex items-center gap-1">
                              <FiClock className="text-xs" />
                              {appointment.appointmentTime} - {appointment.endTime}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedAppointment(appointment)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setCurrentReceipt({
                                ...appointment,
                                patient: {
                                  fullName: appointment.patientName,
                                  gender: appointment.patientGender,
                                  age: appointment.patientAge,
                                  contactNumber: appointment.patientContact
                                },
                                clinicName: clinicData.name,
                                address: clinicData.address,
                                phone: clinicData.phone,
                                email: clinicData.email,
                                endTime: appointment.endTime
                              });
                              setIsReceiptOpen(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No appointments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutstandingPatients;