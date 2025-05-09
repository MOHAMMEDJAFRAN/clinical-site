'use client';

import React, { useState, useEffect } from 'react';

const AddDoctorForm = ({ onAddDoctor, onCancel, cities, clinicName, isLoading, error }) => {
  const [newDoctor, setNewDoctor] = useState({ 
    name: '', 
    gender: 'Male',
    photo: null,
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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDoctor({
        ...newDoctor,
        photo: file
      });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddDoctor(newDoctor);
  };

  const handleSelectCity = (city) => {
    setNewDoctor({ ...newDoctor, city });
    setCityQuery(city);
    setShowCitySuggestions(false);
  };

  useEffect(() => {
    if (cityQuery) {
      const filtered = cities.filter(city => 
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
    <div className="p-4 bg-white min-h-screen max-w-6xl mx-auto">
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">Add New Doctor</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-6">
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={photoPreview} 
                alt="Doctor Preview" 
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" 
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-50 flex flex-col justify-center items-center relative border-2 border-dashed border-gray-300">
                <span className="text-sm text-gray-500">Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photoUpload"
                />
                <label htmlFor="photoUpload" className="absolute bottom-0 right-0 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center cursor-pointer">
                  +
                </label>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Doctor Name*</label>
              <input
                type="text"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Gender*</label>
              <select
                value={newDoctor.gender}
                onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
              <input
                type="tel"
                value={newDoctor.phoneNumber}
                onChange={(e) => setNewDoctor({ ...newDoctor, phoneNumber: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email (optional)</label>
              <input
                type="email"
                value={newDoctor.email}
                onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">City*</label>
            <div className="relative">
              <input
                type="text"
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                onFocus={() => setShowCitySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {showCitySuggestions && filteredCities.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                  {filteredCities.map((city, index) => (
                    <li 
                      key={index} 
                      className="p-2 hover:bg-blue-50 cursor-pointer"
                      onClick={() => handleSelectCity(city)}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Clinic Name*</label>
            <input
              type="text"
              value={newDoctor.clinicName}
              onChange={(e) => setNewDoctor({ ...newDoctor, clinicName: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Status*</label>
            <select
              value={newDoctor.status}
              onChange={(e) => setNewDoctor({ ...newDoctor, status: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
          
          <div className="flex space-x-4 pt-6">
            <button 
              type="button" 
              className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition disabled:opacity-50"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorForm;