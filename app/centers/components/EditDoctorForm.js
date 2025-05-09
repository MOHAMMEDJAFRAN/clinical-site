'use client';

import React, { useState } from 'react';

const EditDoctorForm = ({ doctor, onSave, onCancel }) => {
  const [editDoctor, setEditDoctor] = useState(doctor);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditDoctor({
        ...editDoctor,
        photo: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editDoctor);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-auto">
        <h3 className="text-xl text-gray-800 font-bold text-center mb-4">
          Edit Doctor Information
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            {editDoctor.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={editDoctor.photo} alt="Doctor" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-50 flex flex-col justify-center items-center relative border-2 border-dashed border-gray-300">
                <span className="text-sm text-gray-500">Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="editPhotoUpload"
                />
                <label htmlFor="editPhotoUpload" className="absolute bottom-0 right-0 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center cursor-pointer">
                  +
                </label>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Doctor Name:</label>
            <input
              type="text"
              value={editDoctor.name}
              onChange={(e) => setEditDoctor({ ...editDoctor, name: e.target.value })}
              className="w-full text-gray-500 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Gender:</label>
            <select
              value={editDoctor.gender}
              onChange={(e) => setEditDoctor({ ...editDoctor, gender: e.target.value })}
              className="w-full text-gray-500 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone:</label>
            <input
              type="tel"
              value={editDoctor.phoneNumber}
              onChange={(e) => setEditDoctor({ ...editDoctor, phoneNumber: e.target.value })}
              className="w-full text-gray-500 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              value={editDoctor.email}
              onChange={(e) => setEditDoctor({ ...editDoctor, email: e.target.value })}
              className="w-full text-gray-500 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">City:</label>
            <input
              type="text"
              value={editDoctor.city}
              onChange={(e) => setEditDoctor({ ...editDoctor, city: e.target.value })}
              className="w-full text-gray-500 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Clinic Name:</label>
            <input
              type="text"
              value={editDoctor.clinicName}
              onChange={(e) => setEditDoctor({ ...editDoctor, clinicName: e.target.value })}
              className="w-full text-gray-500 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button 
              type="button" 
              className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoctorForm;