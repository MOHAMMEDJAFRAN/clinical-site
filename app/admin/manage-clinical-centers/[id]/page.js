'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FiEdit, FiSave, FiX, FiEye, FiEyeOff, FiLock, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import axios from 'axios';

const ClinicalCenterDashboard = () => {
  const params = useParams();
  const clinicId = params?.id;

  const [centers, setCenters] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchCenter = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/all-centers/${clinicId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.data;
        setCenters([data]); // keeping as array for consistency
      } catch (err) {
        console.error('Failed to fetch clinic:', err);
        alert('Error loading clinic data.');
      }
    };

    if (clinicId) {
      fetchCenter();
    }
  }, [clinicId]);

  const handleEdit = (center) => {
    setEditingId(center._id);
    setEditForm({
      ...center,
      name: center.clinicname,
      in_chargename: center.in_chargename,
      doctorPhone: center.phoneNumber,
    });
    setShowPassword(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('authToken');

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/all-centers/${editingId}`,
        {
          clinicname: editForm.name,
          city: editForm.city,
          address: editForm.address,
          in_chargename: editForm.in_chargename,
          phoneNumber: editForm.doctorPhone,
          status: editForm.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const updated = centers.map((c) =>
        c._id === editingId ? { ...c, ...editForm } : c
      );
      setCenters(updated);
      setEditingId(null);
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On Hold':
        return 'bg-blue-100 text-blue-800';
      case 'Deactivated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Clinical Center Details</h1>

        {/* Desktop View */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In-Charge</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {centers.map((center, index) => (
                  <tr key={center._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{center.clinicname}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{center.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(center.status)}`}>
                        {center.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{center.in_chargename}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{center.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(center)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <FiEdit className="mr-1" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {centers.map((center) => (
            <div key={center._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div 
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={toggleExpand}
              >
                <div>
                  <h3 className="font-medium text-gray-900">{center.clinicname}</h3>
                  <p className="text-sm text-gray-500">{center.city}</p>
                </div>
                <div className="text-gray-400">
                  {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-4 border-t border-gray-100 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(center.status)}`}>
                      {center.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">In-Charge:</span>
                    <span className="text-sm text-gray-900">{center.in_chargename}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Phone:</span>
                    <span className="text-sm text-gray-900">{center.phoneNumber}</span>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleEdit(center)}
                      className="w-full text-blue-600 hover:text-blue-800 flex items-center justify-center transition-colors text-sm"
                    >
                      <FiEdit className="mr-1" />
                      Edit Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Clinical Center</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Center Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name || ''}
                    onChange={handleInputChange}
                    className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={editForm.city || ''}
                    onChange={handleInputChange}
                    className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={editForm.address || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={editForm.status || ''}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${getStatusColor(editForm.status)}`}
                  >
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Deactivated">Deactivated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor In-Charge</label>
                  <input
                    type="text"
                    name="in_chargename"
                    value={editForm.in_chargename || ''}
                    onChange={handleInputChange}
                    className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="doctorPhone"
                    value={editForm.doctorPhone || ''}
                    maxLength={10}
                    onChange={handleInputChange}
                    className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalCenterDashboard;