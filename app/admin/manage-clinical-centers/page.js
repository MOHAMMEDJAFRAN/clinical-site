'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiSearch, FiPlus, FiEye, FiCheckCircle, FiPauseCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';

const clinics = [
  {
    id: 'clinic-1',
    name: 'Downtown Medical Center',
    city: 'Colombo',
    status: 'Active',
    doctor: 'Dr. Fernando',
    doctorPhone: '0771234567'
  },
  {
    id: 'clinic-2',
    name: 'Westside Clinic',
    city: 'Kandy',
    status: 'On Hold',
    doctor: 'Dr. Perera',
    doctorPhone: '0777654321'
  },
  {
    id: 'clinic-3',
    name: 'Eastern Medical Facility',
    city: 'Jaffna',
    status: 'Active',
    doctor: 'Dr. Siva',
    doctorPhone: '0774567890'
  },
  {
    id: 'clinic-4',
    name: 'Northern Healthcare Center',
    city: 'Anuradhapura',
    status: 'Deactivated',
    doctor: 'Dr. Jayasinghe',
    doctorPhone: '0779876543'
  }
];

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editedClinics, setEditedClinics] = useState(clinics);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const router = useRouter();

  const handleStatusChange = (id, value) => {
    const clinic = editedClinics.find(c => c.id === id);
    setSelectedClinic(clinic);
    setNewStatus(value);
    setShowConfirmDialog(true);
  };

  const confirmStatusChange = () => {
    setEditedClinics(prev =>
      prev.map(clinic =>
        clinic.id === selectedClinic.id ? { ...clinic, status: newStatus } : clinic
      )
    );
    setShowConfirmDialog(false);
  };

  const cancelStatusChange = () => {
    setShowConfirmDialog(false);
  };

  const filteredClinics = editedClinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-blue-100 text-blue-800';
      case 'Deactivated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <FiCheckCircle className="mr-1" />;
      case 'On Hold': return <FiPauseCircle className="mr-1" />;
      case 'Deactivated': return <FiXCircle className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex items-start">
              <div className="flex-shrink-0 text-yellow-500">
                <FiAlertTriangle size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Confirm Status Change</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Are you sure you want to change the status of <span className="font-semibold">{selectedClinic?.name}</span> from <span className={`px-2 py-1 rounded ${getStatusColor(selectedClinic?.status)}`}>{selectedClinic?.status}</span> to <span className={`px-2 py-1 rounded ${getStatusColor(newStatus)}`}>{newStatus}</span>?</p>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={cancelStatusChange}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmStatusChange}
                    className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Clinical Centers Management</h1>
            <p className="text-gray-600 mt-1">Manage all clinical centers and their status</p>
          </div>
          <button
            onClick={() => router.push('/admin/clinical-centers/new')}
            className="mt-4 md:mt-0 flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
          >
            <FiPlus className="mr-2" />
            Add New Clinic
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by clinic, location or In-charge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-gray-500 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Clinic Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredClinics.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In-Charge</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClinics.map((clinic, index) => (
                    <tr key={clinic.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{clinic.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clinic.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={clinic.status}
                          onChange={(e) => handleStatusChange(clinic.id, e.target.value)}
                          className={`border rounded px-3 py-1 text-sm font-medium ${getStatusColor(clinic.status)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="Active" className="bg-green-100 text-green-800">Active</option>
                          <option value="On Hold" className="bg-blue-100 text-blue-800">On Hold</option>
                          <option value="Deactivated" className="bg-red-100 text-red-800">Deactivated</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{clinic.doctor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clinic.doctorPhone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/admin/manage-clinical-centers/${clinic.id}`}
                          className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                        >
                          <FiEye className="mr-1" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FiSearch size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No clinical centers found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search or add a new clinic</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}