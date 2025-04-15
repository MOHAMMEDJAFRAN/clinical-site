'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiCalendar, FiPhone, FiMapPin, FiUser } from 'react-icons/fi';

const clinics = [
  { 
    id: 'clinic-1', 
    name: 'City Medical Center', 
    city: 'Colombo',
    doctorInCharge: 'Dr. Perera',
    phoneNumber: '0771234567'
  },
  { 
    id: 'clinic-2', 
    name: 'Green Health Clinic', 
    city: 'Kandy',
    doctorInCharge: 'Dr. Fernando',
    phoneNumber: '0772345678'
  },
  { 
    id: 'clinic-3', 
    name: 'Sunrise Hospital', 
    city: 'Galle',
    doctorInCharge: 'Dr. Gunawardena',
    phoneNumber: '0773456789'
  }
];

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter clinics based on search
  const filteredClinics = clinics.filter((clinic) =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.doctorInCharge.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              placeholder="Search by clinical Ceneter..."
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
                <div key={clinic.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-semibold text-gray-800">{clinic.name}</h3>
                      <div className="flex items-center mt-1 text-gray-600">
                        <FiMapPin className="mr-1" size={14} />
                        <span className="text-sm">{clinic.city}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <FiUser className="mr-2 text-gray-500" />
                        <span className="text-sm text-gray-700">{clinic.doctorInCharge}</span>
                      </div>
                      <div className="flex items-center">
                        <FiPhone className="mr-2 text-gray-500" />
                        <span className="text-sm text-gray-700">{clinic.phoneNumber}</span>
                      </div>
                      <div className="col-span-2 md:col-span-1 flex justify-end">
                        <Link
                          href={`/admin/appointments/${clinic.id}`}
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
              <h3 className="text-lg font-medium text-gray-700">No clinics found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search or add a new clinic</p>
              <button 
                onClick={() => setSearchTerm('')} 
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Stats Section (optional) */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="text-gray-500 text-sm font-medium">Total Clinics</h4>
            <p className="text-2xl font-bold text-gray-800 mt-1">{clinics.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="text-gray-500 text-sm font-medium">Active Today</h4>
            <p className="text-2xl font-bold text-gray-800 mt-1">{clinics.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="text-gray-500 text-sm font-medium">Upcoming Appointments</h4>
            <p className="text-2xl font-bold text-gray-800 mt-1">24</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}