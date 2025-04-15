'use client';

import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import { FiEdit, FiSave, FiX, FiEye, FiEyeOff, FiLock } from 'react-icons/fi';

const ClinicalCenterDashboard = () => {
  const [centers, setCenters] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const sampleData = [
        {
          id: 1,
          name: 'Downtown Medical Center',
          city: 'Colombo',
          address: '14, town road, colombo-13',
          incharge_name: 'Dr. Silva',
          doctorPhone: '0771234567',
          email: 'downtown@gmail.com',
          password: '1c4654564c*c44c6',
          status: 'Active',
        },
      ];
      setCenters(sampleData);
    };

    fetchData();
  }, []);

  const handleEdit = (center) => {
    setEditingId(center.id);
    setEditForm({ ...center });
    setShowPassword(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updated = centers.map((c) => (c.id === editingId ? editForm : c));
    setCenters(updated);
    setEditingId(null);
    // Here you would typically make an API call to save the changes
    alert('Changes saved successfully!');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-blue-100 text-blue-800';
      case 'Deactivated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Clinical Centers Management</h1>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor In-Charge</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {centers.map((center, index) => (
                  <tr key={center.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    
                    {/* Center Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === center.id ? (
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{center.name}</div>
                      )}
                    </td>
                    
                    {/* City */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === center.id ? (
                        <input
                          type="text"
                          name="city"
                          value={editForm.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{center.city}</div>
                      )}
                    </td>
                    
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === center.id ? (
                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleInputChange}
                          className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(editForm.status)}`}
                        >
                          <option value="Active" className="bg-green-100 text-green-800">Active</option>
                          <option value="On Hold" className="bg-blue-100 text-blue-800">On Hold</option>
                          <option value="Deactivated" className="bg-red-100 text-red-800">Deactivated</option>
                        </select>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(center.status)}`}>
                          {center.status}
                        </span>
                      )}
                    </td>
                    
                    {/* Doctor In-Charge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === center.id ? (
                        <input
                          type="text"
                          name="incharge_name"
                          value={editForm.incharge_name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{center.incharge_name}</div>
                      )}
                    </td>
                    
                    {/* Phone Number */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === center.id ? (
                        <input
                          type="tel"
                          name="doctorPhone"
                          value={editForm.doctorPhone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{center.doctorPhone}</div>
                      )}
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingId === center.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                          >
                            <FiSave className="mr-1" />
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center"
                          >
                            <FiX className="mr-1" />
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(center)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                        >
                          <FiEdit className="mr-1" />
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal - Shows when editing */}
        {editingId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Clinical Center</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Center Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={editForm.city}
                    onChange={handleInputChange}
                    className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={editForm.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleInputChange}
                    className={`w-full text-gray-500 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(editForm.status)}`}
                  >
                    <option value="Active" className="bg-green-100 text-green-800">Active</option>
                    <option value="On Hold" className="bg-blue-100 text-blue-800">On Hold</option>
                    <option value="Deactivated" className="bg-red-100 text-red-800">Deactivated</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor In-Charge</label>
                  <input
                    type="text"
                    name="incharge_name"
                    value={editForm.incharge_name}
                    onChange={handleInputChange}
                    className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="doctorPhone"
                    value={editForm.doctorPhone}
                    onChange={handleInputChange}
                    className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="flex">
                    <input
                      type={showPassword ? "text" : "password"}
                      value="********" // Masked password
                      readOnly
                      className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="px-3 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 flex items-center"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 flex items-center">
                    <FiLock className="mr-1" /> Password cannot be viewed or changed here
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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