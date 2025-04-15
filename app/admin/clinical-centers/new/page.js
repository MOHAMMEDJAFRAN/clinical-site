'use client';

import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiRefreshCw, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const NewClinicSender = () => {
  const router = useRouter();
  const [clinicDetails, setClinicDetails] = useState({
    clinicName: '',
    city: '',
    address: '',
    inChargeName: '',
    contact: '',
    email: '',
    password: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Generate random password on component mount
  useEffect(() => {
    generateRandomPassword();
  }, []);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setClinicDetails(prev => ({ ...prev, password }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClinicDetails({ ...clinicDetails, [name]: value });
    
    // Clear email error when typing
    if (name === 'email') {
      setEmailError('');
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const sendEmail = async (details) => {
    // This is a simulation - in a real app you would call your API endpoint
    console.log('Sending email with details:', details);
    return new Promise(resolve => setTimeout(() => resolve(true), 1000));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(clinicDetails.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call to save data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send email with credentials
      const emailSent = await sendEmail(clinicDetails);
      
      if (emailSent) {
        console.log('Submitted data:', clinicDetails);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/manage-clinical-centers');
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setClinicDetails({
      clinicName: '',
      city: '',
      address: '',
      inChargeName: '',
      contact: '',
      email: '',
      password: '',
    });
    generateRandomPassword();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FiCheckCircle className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 mb-6">
                Clinical center has been successfully added and credentials sent to {clinicDetails.email}.
              </p>
              <button
                onClick={handleSuccessClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">New Clinical Center</h1>
          <p className="mt-2 text-lg text-gray-600">Fill in the details to register a new clinical center</p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Clinic Name */}
              <div>
                <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700 mb-1">
                  Clinical Center Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="clinicName"
                  name="clinicName"
                  value={clinicDetails.clinicName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={clinicDetails.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={clinicDetails.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 text-gray-500 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              {/* In-charge Name */}
              <div>
                <label htmlFor="inChargeName" className="block text-sm font-medium text-gray-700 mb-1">
                  In-charge Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="inChargeName"
                  name="inChargeName"
                  value={clinicDetails.inChargeName}
                  onChange={handleInputChange}
                  className="w-full px-4 text-gray-500 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Contact Number */}
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={clinicDetails.contact}
                  onChange={handleInputChange}
                  className="w-full px-4 text-gray-500 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Email with validation */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={clinicDetails.email}
                  onChange={handleInputChange}
                  className={`w-full text-gray-500 px-4 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  required
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>

              {/* Password with toggle */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  System Password
                </label>
                <div className="flex">
                  <div className="relative flex-grow">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={clinicDetails.password}
                      onChange={handleInputChange}
                      className="w-full text-gray-500 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10"
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <FiRefreshCw className="mr-1" />
                    Regenerate
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Automatically generated secure password</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
              >
                <FiX className="mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Save Clinical Center
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewClinicSender;