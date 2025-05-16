'use client';

import React, { useState, useEffect } from 'react';
import { getCroppedImg } from '@/utils/docImage';
import { 
  FaUser, 
  FaVenusMars, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaHospital, 
  FaCamera, 
  FaTimes, 
  FaCheck 
} from 'react-icons/fa';

const AddDoctorForm = ({ onAddDoctor, onCancel, cities, clinicName, isLoading, error }) => {
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    gender: 'Male',
    photo: '',
    phoneNumber: '',
    email: '',
    city: '',
    clinicName: clinicName || '',
    status: 'Available'
  });

  const [cityQuery, setCityQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imageSrc = event.target.result;
        if (!imageSrc) throw new Error('Invalid image source');
        const cropped = await getCroppedImg(imageSrc);
        setNewDoctor((prev) => ({ ...prev, photo: cropped }));
        setPhotoPreview(cropped);
      } catch (err) {
        console.error('Image cropping failed:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddDoctor(newDoctor);
  };

  const toSentenceCase = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleSelectCity = (city) => {
    setNewDoctor({ ...newDoctor, city });
    setCityQuery(city);
    setShowCitySuggestions(false);
  };

  useEffect(() => {
    if (cityQuery) {
      const filtered = cities.filter((city) =>
        city.toLowerCase().includes(cityQuery.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowCitySuggestions(true);
    } else {
      setFilteredCities([]);
      setShowCitySuggestions(false);
    }
  }, [cityQuery, cities]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-auto my-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 md:p-6 text-white">
          <h1 className="text-xl md:text-2xl font-bold text-center">
            Add New Doctor
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-4 mt-4 rounded">
            <div className="flex items-center">
              <FaTimes className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Photo Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoPreview}
                    alt="Doctor Preview"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
                    <FaUser className="text-gray-400 text-3xl md:text-4xl" />
                  </div>
                )}
                <label
                  htmlFor="photoUpload"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 transition-all duration-200"
                >
                  <FaCamera className="text-sm md:text-lg" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photoUpload"
                  />
                </label>
              </div>
              <label
                htmlFor="photoUpload"
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-200"
              >
                {photoPreview ? 'Change Photo' : 'Upload Photo'}
              </label>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  <FaUser className="inline mr-2 text-blue-600" />
                  Doctor Name*
                </label>
                <input
                  type="text"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: toSentenceCase(e.target.value) })}
                  className="w-full p-2 md:p-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter doctor's full name"
                  required
                />
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  <FaVenusMars className="inline mr-2 text-blue-600" />
                  Gender*
                </label>
                <select
                  value={newDoctor.gender}
                  onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value })}
                  className="w-full p-2 md:p-3 border border-gray-300 text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  <FaPhone className="inline mr-2 text-blue-600" />
                  Phone Number*
                </label>
                <input
                  type="tel"
                  value={newDoctor.phoneNumber}
                  onChange={(e) => setNewDoctor({ ...newDoctor, phoneNumber: e.target.value })}
                  className="w-full p-2 md:p-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                  maxLength={10}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  <FaEnvelope className="inline mr-2 text-blue-600" />
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                  className="w-full p-2 md:p-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              {/* City */}
              <div className="space-y-1 relative">
                <label className="block text-sm font-medium text-gray-700">
                  <FaMapMarkerAlt className="inline mr-2 text-blue-600" />
                  City*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cityQuery}
                    onChange={(e) => setCityQuery(toSentenceCase(e.target.value))}
                    onFocus={() => setShowCitySuggestions(true)}
                    onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                    className="w-full p-2 md:p-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Select city"
                    required
                  />
                  {showCitySuggestions && filteredCities.length > 0 && (
                    <ul className="absolute z-10 text-gray-600 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredCities.map((city, index) => (
                        <li
                          key={index}
                          className="p-2 md:p-3 hover:bg-blue-50 cursor-pointer flex items-center"
                          onClick={() => handleSelectCity(city)}
                        >
                          <FaMapMarkerAlt className="mr-2 text-blue-500" />
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Clinic Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  <FaHospital className="inline mr-2 text-blue-600" />
                  Clinic Name*
                </label>
                <input
                  type="text"
                  value={newDoctor.clinicName}
                  onChange={(e) => setNewDoctor({ ...newDoctor, clinicName: e.target.value })}
                  className="w-full p-2 md:p-3 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter clinic name"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-2 text-sm lg:text-md sm:flex-row gap-3 pt-6">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-2 md:py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
              >
                <FaTimes />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 md:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Save Doctor
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

export default AddDoctorForm;