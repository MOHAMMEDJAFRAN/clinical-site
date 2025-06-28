'use client';

import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiRefreshCw, FiCheckCircle, FiEye, FiEyeOff, FiAlertTriangle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const NewClinicSender = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clinicName: '',
    city: '',
    address: '',
    inChargeName: '',
    phoneNumber: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Generate random password on component mount
  useEffect(() => {
    generateRandomPassword();
    
    // Set up beforeunload event listener
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Track form changes
  useEffect(() => {
    const initialData = {
      clinicName: '',
      city: '',
      address: '',
      inChargeName: '',
      phoneNumber: '',
      email: '',
      password: '',
    };
    
    const isFormDirty = Object.keys(initialData).some(
      key => formData[key] !== initialData[key]
    );
    
    setHasUnsavedChanges(isFormDirty);
  }, [formData]);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const sentenceCaseRegex = /^[A-Z][a-z]*(?:\s+[A-Z][a-z]*)*$/;

    // Clinic Name validation
    if (!formData.clinicName.trim()) {
      newErrors.clinicName = 'Clinic name is required';
    } else if (formData.clinicName.trim().length > 100) {
      newErrors.clinicName = 'Clinic name must be less than 100 characters';
    } else if (!sentenceCaseRegex.test(formData.clinicName.trim())) {
      newErrors.clinicName = 'Clinic name should be in sentence case (e.g., "City Hospital")';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (formData.city.trim().length > 50) {
      newErrors.city = 'City must be less than 50 characters';
    } else if (!sentenceCaseRegex.test(formData.city.trim())) {
      newErrors.city = 'City name should be in sentence case (e.g., "New York")';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length > 200) {
      newErrors.address = 'Address must be less than 200 characters';
    }

    // In-charge Name validation
    if (!formData.inChargeName.trim()) {
      newErrors.inChargeName = 'In-charge name is required';
    } else if (formData.inChargeName.trim().length > 50) {
      newErrors.inChargeName = 'Name must be less than 50 characters';
    } else if (!sentenceCaseRegex.test(formData.inChargeName.trim())) {
      newErrors.inChargeName = 'Name should be in sentence case (e.g., "John Smith")';
    }

    // Phone Number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number (10 digits)';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    } else if (formData.email.length > 100) {
      newErrors.email = 'Email must be less than 100 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number input to only allow digits
    if (name === 'phoneNumber') {
      const formattedValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: formattedValue });
    } 
    // Convert to sentence case for name fields
    else if (['clinicName', 'city', 'inChargeName'].includes(name)) {
      const formattedValue = value
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setFormData({ ...formData, [name]: formattedValue });
    } 
    else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/clinicalCenters/register`,
        {
          clinicname: formData.clinicName.trim(),
          city: formData.city.trim(),
          address: formData.address.trim(),
          in_chargename: formData.inChargeName.trim(),
          phoneNumber: formData.phoneNumber,
          email: formData.email.trim(),
          password: formData.password,
          role: 'merchant'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (response.data.success) {
        setShowSuccess(true);
        setHasUnsavedChanges(false);
        toast.success('Merchant registered successfully! Credentials sent to their email.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        // Handle field-level validation errors from backend
        if (error.response.status === 400 && error.response.data.errors) {
          setErrors(error.response.data.errors);
          errorMessage = 'Please fix the highlighted errors';
        } 
        // Handle duplicate email error
        else if (error.response.status === 409) {
          setErrors({ email: 'Email already registered' });
          errorMessage = 'Email already registered';
        }
        else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowBackConfirm(true);
    } else {
      router.back();
    }
  };

  const confirmBackNavigation = () => {
    setShowBackConfirm(false);
    router.back();
  };

  const cancelBackNavigation = () => {
    setShowBackConfirm(false);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setFormData({
      clinicName: '',
      city: '',
      address: '',
      inChargeName: '',
      phoneNumber: '',
      email: '',
      password: '',
    });
    generateRandomPassword();
    router.push('/admin/dashboard');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative">
            <button
              onClick={handleSuccessClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX className="text-xl" />
            </button>
            <div className="flex flex-col items-center text-center pt-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FiCheckCircle className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
              <p className="text-gray-600 mb-6">
                Clinical center has been successfully registered and login credentials 
                have been sent to <span className="font-semibold">{formData.email}</span>.
              </p>
              <div className="w-full bg-blue-50 p-4 rounded-lg mb-4 text-left">
                <h4 className="font-medium text-blue-800 mb-2">Credentials Sent:</h4>
                <p className="text-sm text-gray-700"><span className="font-medium">Email:</span> {formData.email}</p>
                <p className="text-sm text-gray-700"><span className="font-medium">Password:</span> {formData.password}</p>
              </div>
              <button
                onClick={handleSuccessClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Navigation Confirmation Modal */}
      {showBackConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 text-yellow-500">
                <FiAlertTriangle size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Unsaved Changes</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>You have unsaved changes. Are you sure you want to leave?</p>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={cancelBackNavigation}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Stay
                  </button>
                  <button
                    onClick={confirmBackNavigation}
                    className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Leave
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Register New Clinical Center</h1>
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
                  value={formData.clinicName}
                  onChange={handleInputChange}
                  className={`w-full px-4 text-gray-700 py-2 border ${errors.clinicName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  maxLength={100}
                />
                {errors.clinicName && <p className="mt-1 text-sm text-red-600">{errors.clinicName}</p>}
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
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 text-gray-700 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  maxLength={50}
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 text-gray-700 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  maxLength={200}
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
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
                  value={formData.inChargeName}
                  onChange={handleInputChange}
                  className={`w-full px-4 text-gray-700 py-2 border ${errors.inChargeName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  maxLength={50}
                />
                {errors.inChargeName && <p className="mt-1 text-sm text-red-600">{errors.inChargeName}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full text-gray-700 px-4 py-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  pattern="[0-9]*"
                  maxLength={10}
                />
                {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 text-gray-700 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  maxLength={100}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  System Password <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <div className="relative flex-grow">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 text-gray-700 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10`}
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
                {errors.password ? (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Minimum 8 characters with letters, numbers, and symbols</p>
                )}
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
                    Registering...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Register Center
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