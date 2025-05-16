'use client';

import React, { useState } from 'react';
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
  FaCheck,
  FaEdit
} from 'react-icons/fa';

const EditDoctorForm = ({ doctor, onSave, onCancel, isLoading }) => {
  const [editDoctor, setEditDoctor] = useState(doctor);
  const [photoPreview, setPhotoPreview] = useState(doctor.photo || null);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imageSrc = event.target.result;
        const croppedImage = await getCroppedImg(imageSrc);
        setEditDoctor(prev => ({ ...prev, photo: croppedImage }));
        setPhotoPreview(croppedImage);
      } catch (err) {
        console.error('Image cropping failed:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editDoctor);
  };

  const toSentenceCase = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex items-center justify-center gap-3">
            <FaEdit className="text-xl" />
            <h3 className="text-xl font-bold text-center">
              Edit Doctor Information
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Photo Upload */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoPreview}
                  alt="Doctor"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
                  <FaUser className="text-gray-400 text-4xl" />
                </div>
              )}
              <label
                htmlFor="editPhotoUpload"
                className="absolute bottom-0 right-0 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 transition-all duration-200 group-hover:scale-110"
              >
                <FaCamera className="text-lg" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="editPhotoUpload"
                />
              </label>
            </div>
            <label
              htmlFor="editPhotoUpload"
              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-200"
            >
              {photoPreview ? 'Change Photo' : 'Upload Photo'}
            </label>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 items-center">
                <FaUser className="mr-2 text-blue-600" />
                Doctor Name
              </label>
              <input
                type="text"
                value={editDoctor.name}
                onChange={(e) => setEditDoctor({ ...editDoctor, name: toSentenceCase(e.target.value) })}
                className="w-full p-3 text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 items-center">
                <FaVenusMars className="mr-2 text-blue-600" />
                Gender
              </label>
              <select
                value={editDoctor.gender}
                onChange={(e) => setEditDoctor({ ...editDoctor, gender: e.target.value })}
                className="w-full p-3 border text-gray-500 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 items-center">
                <FaPhone className="mr-2 text-blue-600" />
                Phone
              </label>
              <input
                type="tel"
                value={editDoctor.phoneNumber}
                maxLength={10}
                onChange={(e) => setEditDoctor({ ...editDoctor, phoneNumber: e.target.value })}
                className="w-full text-gray-500 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 items-center">
                <FaEnvelope className="mr-2 text-blue-600" />
                Email
              </label>
              <input
                type="email"
                value={editDoctor.email}
                onChange={(e) => setEditDoctor({ ...editDoctor, email: e.target.value })}
                className="w-full text-gray-500 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                City
              </label>
              <input
                type="text"
                value={editDoctor.city}
                onChange={(e) => setEditDoctor({ ...editDoctor, city: e.target.value })}
                className="w-full text-gray-500 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            {/* Clinic Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 items-center">
                <FaHospital className="mr-2 text-blue-600" />
                Clinic Name
              </label>
              <input
                type="text"
                value={editDoctor.clinicName}
                onChange={(e) => setEditDoctor({ ...editDoctor, clinicName: e.target.value })}
                className="w-full text-gray-500 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-2 text-sm sm:flex-row gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
            >
              <FaTimes />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-0 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FaCheck />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoctorForm;