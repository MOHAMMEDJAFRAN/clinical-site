/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';
import { FiUser, FiPhone, FiMail, FiMapPin, FiHome, FiCamera, FiX, FiPlus } from 'react-icons/fi';

// Custom blue color theme
const blueTheme = {
  primary: 'rgb(59 130 246)', // blue-500
  hover: 'rgb(37 99 235)',    // blue-600
  focusRing: 'rgb(147 197 253)', // blue-300
  border: 'rgb(147 197 253)', // blue-300
  text: 'rgb(37 99 235)',     // blue-600
  lightBg: 'rgb(239 246 255)' // blue-50
};

const AddDoctorForm = ({ onAddDoctor, onCancel, cities, isLoading, error, clinicName }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    phoneNumber: '',
    email: '',
    city: '',
    clinicName: clinicName,
    photoBase64: null,
    photoFile: null
  });
  const [touchedFields, setTouchedFields] = useState({});
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Field validations
  const validations = {
    name: (value) => {
      if (!value.trim()) return 'Name is required';
      if (!/^[A-Za-z\s]+$/.test(value)) return 'Name should contain only letters';
      return null;
    },
    phoneNumber: (value) => {
      if (!value) return 'Phone number is required';
      if (!/^\d{10}$/.test(value)) return 'Phone number must be 10 digits';
      return null;
    },
    email: (value) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Invalid email format';
      }
      return null;
    },
    city: (value) => {
      if (!value) return 'City is required';
      return null;
    }
  };

  const errors = Object.keys(validations).reduce((acc, field) => {
    const error = validations[field](formData[field]);
    if (error && touchedFields[field]) {
      acc[field] = error;
    }
    return acc;
  }, {});

  const isFormValid = Object.keys(errors).length === 0 && 
    formData.name && formData.phoneNumber && formData.city;

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      fileType: 'image/webp'
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Error compressing image:', error);
      throw new Error('Failed to compress image');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        toast.error(error.code === 'file-too-large' ? 
          'Image is too large (max 5MB)' : 'Invalid image file');
        return;
      }

      if (acceptedFiles.length > 0) {
        try {
          setIsProcessingImage(true);
          const file = acceptedFiles[0];
          const compressedFile = await compressImage(file);
          
          const reader = new FileReader();
          reader.onload = () => {
            setFormData(prev => ({
              ...prev,
              photoFile: compressedFile,
              photoBase64: reader.result
            }));
            setIsProcessingImage(false);
          };
          reader.onerror = () => {
            toast.error('Error reading image file');
            setIsProcessingImage(false);
          };
          reader.readAsDataURL(compressedFile);
        } catch (err) {
          toast.error(err.message || 'Failed to process image');
          setIsProcessingImage(false);
        }
      }
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format name to sentence case
    if (name === 'name') {
      const formattedValue = value
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } 
    // Format phone number (only digits, max 10)
    else if (name === 'phoneNumber') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show errors
    setTouchedFields({
      name: true,
      phoneNumber: true,
      email: true,
      city: true
    });

    if (!isFormValid) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (formData.photoBase64 && formData.photoBase64.length > 10 * 1024 * 1024) {
      toast.error('Image is too large after compression. Please try a smaller image.');
      return;
    }

    try {
      await onAddDoctor(formData);
      toast.success('Doctor added successfully!');
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photoBase64: null,
      photoFile: null
    }));
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <p className="text-red-700 flex items-center">
              <FiX className="mr-2" /> {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo Upload - First column */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Doctor Photo
            </label>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition min-h-40 flex items-center justify-center 
                ${isProcessingImage ? 'opacity-50 border-gray-300 bg-gray-50' : 
                  formData.photoBase64 ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
            >
              <input {...getInputProps()} disabled={isProcessingImage} />
              {isProcessingImage ? (
                <div className="flex flex-col items-center">
                  <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${blueTheme.border} mb-3`}></div>
                  <p className="text-sm text-gray-600">Processing image...</p>
                </div>
              ) : formData.photoBase64 ? (
                <div className="flex flex-col items-center w-full">
                  <div className="relative">
                    <img 
                      src={formData.photoBase64} 
                      alt="Preview" 
                      className="w-32 h-32 rounded-full object-cover mb-3 border-4 border-white shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition shadow-md"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-blue-600 mt-2">Click to change photo</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <FiCamera className={`${blueTheme.text} text-3xl mb-3`} />
                  <p className="text-sm text-gray-600 font-medium">
                    Drag & drop a photo here
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    or click to browse (Max 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right column fields - Split into two columns */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name - Full width */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className={`${errors.name ? 'text-red-500' : 'text-blue-500'}`} />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`pl-10 mt-1 p-3 text-gray-600 border rounded-lg w-full focus:ring-2 focus:border-blue-500 transition
                      ${errors.name ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Gender - Full width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex space-x-6">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={handleChange}
                      className={`h-4 w-4 ${blueTheme.text} focus:ring-blue-500`}
                    />
                    <span className="ml-2 text-gray-700">Male</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === 'Female'}
                      onChange={handleChange}
                      className={`h-4 w-4 ${blueTheme.text} focus:ring-blue-500`}
                    />
                    <span className="ml-2 text-gray-700">Female</span>
                  </label>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className={`${errors.phoneNumber ? 'text-red-500' : 'text-blue-500'}`} />
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength="10"
                    className={`pl-10 mt-1 p-3 text-gray-600 border rounded-lg w-full focus:ring-2 focus:border-blue-500 transition
                      ${errors.phoneNumber ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                    required
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className={`${errors.email ? 'text-red-500' : 'text-blue-500'}`} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`pl-10 mt-1 p-3 text-gray-600 border rounded-lg w-full focus:ring-2 focus:border-blue-500 transition
                      ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className={`${errors.city ? 'text-red-500' : 'text-blue-500'}`} />
                  </div>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`pl-10 mt-1 p-3 text-gray-600 border rounded-lg w-full focus:ring-2 focus:border-blue-500 appearance-none transition
                      ${errors.city ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                    required
                  >
                    <option value="">Select a city</option>
                    {cities.filter((city, index, self) => 
                      self.indexOf(city) === index).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              {/* Clinic Name */}
              <div>
                <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700 mb-1">
                  Clinic Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiHome className="text-blue-500" />
                  </div>
                  <input
                    type="text"
                    id="clinicName"
                    name="clinicName"
                    value={formData.clinicName}
                    onChange={handleChange}
                    className="pl-10 mt-1 p-3 text-gray-600 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 mt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium flex items-center justify-center"
            disabled={isLoading || isProcessingImage}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-6 py-3 text-white rounded-lg transition font-medium flex items-center justify-center
              ${isFormValid ? `bg-blue-600 hover:bg-blue-700` : 'bg-blue-400 cursor-not-allowed'}`}
            disabled={isLoading || isProcessingImage || !isFormValid}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              <>
                <FiPlus className="mr-2" /> Add Doctor
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctorForm;