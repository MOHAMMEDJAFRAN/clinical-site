'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    clinic.doctorInCharge.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Clinics (Medical Cenders)</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Medical Cender..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-2 border border-gray-400 rounded text-black"
        />
      </div>

      <table className="w-full border border-gray-400 border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-2 text-black">Medical Cender</th>
            <th className="border border-gray-400 p-2 text-black">City</th>
            <th className="border border-gray-400 p-2 text-black">Doctor In-Charge</th>
            <th className="border border-gray-400 p-2 text-black">Phone Number</th>
            <th className="border border-gray-400 p-2 text-black">View</th>
          </tr>
        </thead>
        <tbody>
          {filteredClinics.length > 0 ? (
            filteredClinics.map((clinic) => (
              <tr key={clinic.id} className="bg-white">
                <td className="border border-gray-400 p-2 text-black">{clinic.name}</td>
                <td className="border border-gray-400 p-2 text-black">{clinic.city}</td>
                <td className="border border-gray-400 p-2 text-black">{clinic.doctorInCharge}</td>
                <td className="border border-gray-400 p-2 text-black">{clinic.phoneNumber}</td>
                <td className="border border-gray-400 p-2">
                  <Link
                    href={`/admin/appointments/${clinic.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Appointments
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 p-4">
                No matching medical senders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}