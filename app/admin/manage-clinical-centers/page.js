'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiSearch, FiPlus, FiEye, FiAlertTriangle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function AppointmentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [, setClinics] = useState([]); //remove clinics
  const [editedClinics, setEditedClinics] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/all-centers/allCenters`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const clinicsData = response.data.data.map(clinic => ({
          ...clinic,
          inChargeName: clinic.in_chargename || clinic.inCharge?.name || 'N/A'
        }));
        setClinics(clinicsData);
        setEditedClinics(clinicsData);
      } catch (error) {
        toast.error('Failed to load clinics');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchClinics();
  }, [token]);

  const handleStatusChange = (id, value) => {
    const clinic = editedClinics.find(c => c._id === id);
    setSelectedClinic(clinic);
    setNewStatus(value);
    setShowConfirmDialog(true);
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id) 
        : [...prev, id]
    );
  };

  const confirmStatusChange = async () => {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/all-centers/${selectedClinic._id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedClinic = res.data.data;

      setEditedClinics(prev =>
        prev.map(clinic =>
          clinic._id === updatedClinic._id ? updatedClinic : clinic
        )
      );

      toast.success('Status updated!');
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    } finally {
      setShowConfirmDialog(false);
    }
  };

  const cancelStatusChange = () => {
    setShowConfirmDialog(false);
  };

  const filteredClinics = editedClinics.filter(clinic =>
    clinic.clinicname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.inChargeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-blue-100 text-blue-800';
      case 'Deactivated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
          <p className="text-gray-600">Loading clinical centers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 text-yellow-500">
                <FiAlertTriangle size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Confirm Status Change</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>
                    Are you sure you want to change the status of
                    <span className="font-semibold"> {selectedClinic?.clinicname}</span> from
                    <span className={`px-2 py-1 mx-1 rounded ${getStatusColor(selectedClinic?.status)}`}>
                      {selectedClinic?.status}
                    </span>
                    to
                    <span className={`px-2 py-1 mx-1 rounded ${getStatusColor(newStatus)}`}>
                      {newStatus}
                    </span>?
                  </p>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Clinical Centers</h1>
            <p className="text-gray-600 mt-1">Manage all clinical centers and their status</p>
          </div>
          <button
            onClick={() => router.push('/admin/clinical-centers/new')}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors w-full md:w-auto justify-center"
          >
            <FiPlus className="mr-2" />
            <span>Add New Clinic</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
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

        {/* Clinic Table - Desktop */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredClinics.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In-Charge</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClinics.map((clinic, index) => (
                    <tr key={clinic._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{clinic.clinicname}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clinic.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clinic.inChargeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clinic.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={clinic.status}
                          onChange={(e) => handleStatusChange(clinic._id, e.target.value)}
                          className={`border rounded px-3 py-1 text-sm font-medium ${getStatusColor(clinic.status)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="Active">Active</option>
                          <option value="On Hold">On Hold</option>
                          <option value="Deactivated">Deactivated</option>
                        </select>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/admin/manage-clinical-centers/${clinic._id}`}
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

        {/* Mobile Clinic List */}
        <div className="md:hidden space-y-4">
          {filteredClinics.length > 0 ? (
            filteredClinics.map((clinic) => (
              <div key={clinic._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleRowExpansion(clinic._id)}
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{clinic.clinicname}</h3>
                    <p className="text-sm text-gray-500">{clinic.city}</p>
                  </div>
                  <div className="text-gray-400">
                    {expandedRows.includes(clinic._id) ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                </div>
                
                {expandedRows.includes(clinic._id) && (
                  <div className="p-4 border-t border-gray-100 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <select
                        value={clinic.status}
                        onChange={(e) => handleStatusChange(clinic._id, e.target.value)}
                        className={`border rounded px-2 py-1 text-sm font-medium ${getStatusColor(clinic.status)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="Active">Active</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Deactivated">Deactivated</option>
                      </select>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">In-Charge:</span>
                      <span className="text-sm text-gray-900">{clinic.inChargeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Phone:</span>
                      <span className="text-sm text-gray-900">{clinic.phoneNumber}</span>
                    </div>
                    <div className="pt-2">
                      <Link
                        href={`/admin/manage-clinical-centers/${clinic._id}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center justify-center transition-colors text-sm"
                      >
                        <FiEye className="mr-1" />
                        View Details
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white rounded-lg shadow-sm">
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