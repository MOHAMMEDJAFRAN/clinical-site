'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiCalendar, FiPhone, FiMapPin, FiUser } from 'react-icons/fi';
import axios from 'axios';

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch clinics from API
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const token = localStorage.getItem('authToken');
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/allClinicAppointments/clinics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setClinics(response.data.data); // Changed from response.json() to response.data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []); // Removed clinicId from dependencies

  // Filter clinics based on search
  const filteredClinics = clinics.filter((clinic) =>
    clinic.clinicname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.in_chargename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading clinics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Medical Centers Appointments</h1>
            <p className="text-gray-600 mt-2">Manage and view appointments across all clinics</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by clinic name, doctor, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-gray-500 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Clinics Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredClinics.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredClinics.map((clinic) => (
                <div key={clinic._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-semibold text-gray-800">{clinic.clinicname}</h3>
                      <div className="flex items-center mt-1 text-gray-600">
                        <FiMapPin className="mr-1" size={14} />
                        <span className="text-sm">{clinic.city}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <FiUser className="mr-2 text-gray-500" />
                        <span className="text-sm text-gray-700">{clinic.in_chargename}</span>
                      </div>
                      <div className="flex items-center">
                        <FiPhone className="mr-2 text-gray-500" />
                        <span className="text-sm text-gray-700">{clinic.phoneNumber}</span>
                      </div>
                      <div className="col-span-2 md:col-span-1 flex justify-end">
                        <Link
                          href={`/admin/appointments/${clinic._id}`}
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <FiCalendar className="mr-1" />
                          <span>View Appointments</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FiSearch size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">
                {clinics.length === 0 ? 'No clinics available' : 'No clinics match your search'}
              </h3>
              <p className="text-gray-500 mt-1">
                {clinics.length === 0 ? 'Please check back later' : 'Try adjusting your search'}
              </p>
              {clinics.length > 0 && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}