'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiUser } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';

const StaffManagement = () => {
  const router = useRouter();
  // State for staff data
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clinicId, setClinicId] = useState(null);


  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    gender: '',
    email: '',
    password: ''
  });

  // Check authentication and load clinic ID
  useEffect(() => {
    const checkAuth = () => {
      const profileData = JSON.parse(localStorage.getItem('profileData'));
      
      
      if (!profileData) {
        toast.error('Please login to access this page');
        router.push('/login');
        return;
      }
    
      if (!profileData.isApproved) {
        toast.error('Your clinic is not yet approved');
        router.push('/login');
        return;
      }
      
      setClinicId(profileData.id);
      
    };

    checkAuth();
  }, [router]);

  // Fetch staff data
  useEffect(() => {
    const fetchStaff = async () => {
      if (!clinicId) return;
      
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/staff/all/${clinicId}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data?.success) {
          setStaff(response.data.data);
          setFilteredStaff(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          router.push('/login');
        } else {
          toast.error(error.response?.data?.message || 'Failed to load staff');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [clinicId, router]);

  // Filter staff based on search term
  useEffect(() => {
    if (searchTerm) {
      const searchStaff = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/staff/${clinicId}/search?q=${searchTerm}`,
            {
              headers: {
                'Content-Type': 'application/json'
                
              }
            }
          );

          if (response.data?.success) {
            setFilteredStaff(response.data.data);
          }
        } catch (error) {
          console.error('Error searching staff:', error);
          // Fall back to client-side filtering if API search fails
          const results = staff.filter(person =>
            person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.phone.includes(searchTerm) ||
            (person.user && person.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
          );
          setFilteredStaff(results);
        }
      };

      const debounceTimer = setTimeout(() => {
        if (searchTerm.trim()) {
          searchStaff();
        } else {
          setFilteredStaff(staff);
        }
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setFilteredStaff(staff);
    }
  }, [searchTerm, staff, clinicId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle staff selection
  const handleStaffSelect = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsEditing(false);
  };

  // Handle add new staff
  const handleAddStaff = () => {
    setIsAdding(true);
    setSelectedStaff(null);
    setFormData({
      name: '',
      phone: '',
      address: '',
      city: '',
      gender: '',
      email: '',
      password: ''
    });
  };

  // Handle save new staff
  const handleSaveStaff = async () => {
    try {
      if (!formData.name || !formData.phone || !formData.address || 
          !formData.city || !formData.gender || !formData.email || !formData.password) {
        toast.error('Please fill all required fields');
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/staff/create/${clinicId}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
            
          }
        }
      );

      if (response.data?.success) {
        toast.success('Staff member created successfully');
        setStaff([...staff, response.data.data]);
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Error creating staff:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        router.push('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to create staff');
      }
    }
  };

  // Handle edit staff
  const handleEditStaff = () => {
    setIsEditing(true);
    setFormData({
      name: selectedStaff.name,
      phone: selectedStaff.phone,
      address: selectedStaff.address,
      city: selectedStaff.city,
      gender: selectedStaff.gender,
      email: selectedStaff.user?.email || '',
      password: '' // Don't pre-fill password for security
    });
  };

  // Handle update staff
  const handleUpdateStaff = async () => {
    try {
      if (!formData.name || !formData.phone || !formData.address || 
          !formData.city || !formData.gender || !formData.email) {
        toast.error('Please fill all required fields');
        return;
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/staff/${clinicId}/${selectedStaff._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
            
          }
        }
      );

      if (response.data?.success) {
        toast.success('Staff member updated successfully');
        const updatedStaff = staff.map(person =>
          person._id === selectedStaff._id ? response.data.data : person
        );
        setStaff(updatedStaff);
        setSelectedStaff(response.data.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        router.push('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update staff');
      }
    }
  };

  // Handle delete staff
  const handleDeleteStaff = async (id) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/staff/${clinicId}/${id}`,
        {
          headers: {
            'Content-Type': 'application/json'
            
          }
        }
      );

      if (response.data?.success) {
        toast.success('Staff member deleted successfully');
        const updatedStaff = staff.filter(person => person._id !== id);
        setStaff(updatedStaff);
        if (selectedStaff && selectedStaff._id === id) {
          setSelectedStaff(null);
        }
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        router.push('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to delete staff');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
                                            <div className="flex flex-col items-center">
                                              <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
                                              <p className="text-gray-600">Loading staff...</p>
                                            </div>
                                          </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Staff Management</h1>
            <p className="text-gray-500 mt-1">Manage your organization staff members</p>
          </div>
          
          {/* Search and Add Staff */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                className="pl-10 pr-4 text-gray-600 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleAddStaff}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <FiPlus className="text-lg" /> Add Staff
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Staff List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-4 bg-white border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Staff Members</h2>
              <p className="text-sm text-gray-500">{filteredStaff.length} staff members</p>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-220px)]">
              {filteredStaff.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {filteredStaff.map((staffMember) => (
                    <li
                      key={staffMember._id}
                      className={`p-4 hover:bg-blue-50 cursor-pointer transition-colors ${selectedStaff?._id === staffMember._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                      onClick={() => handleStaffSelect(staffMember)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                          <FiUser className="text-blue-600 text-lg" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-gray-800 truncate">{staffMember.name}</h3>
                          <p className="text-sm text-blue-500 truncate">{staffMember.user?.email}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center">
                  <FiUser className="mx-auto text-gray-300 text-4xl mb-3" />
                  <h3 className="text-gray-500 font-medium">No staff members found</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchTerm ? 'Try a different search' : 'Add a new staff member to get started'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Staff Details or Add Form */}
          <div className="lg:col-span-2">
            {isAdding ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 h-full">
                <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Add New Staff</h2>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <FiX className="text-lg" />
                  </button>
                </div>
                <div className="p-4 md:p-6">
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Personal Information</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 text-gray-500 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 text-gray-500 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="123-456-7890"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-700 mb-3 mt-2">Address Information</h3>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="New York"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-700 mb-3 mt-2">Account Information</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="••••••••"
                        minLength="6"
                      />
                    </div>
                  </form>
                  <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
                    <button
                      onClick={() => setIsAdding(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveStaff}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <FiSave /> Save Staff
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedStaff ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 h-full">
                <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Staff Details</h2>
                  {!isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditStaff}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(selectedStaff._id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-4 md:p-6">
                  {isEditing ? (
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Personal Information</h3>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-700 mb-3 mt-2">Address Information</h3>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-700 mb-3 mt-2">Account Information</h3>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Leave blank to keep current"
                          minLength="6"
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdateStaff}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                        >
                          <FiSave /> Update Staff
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <FiUser className="text-blue-600 text-2xl" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{selectedStaff.name}</h3>
                          <p className="text-gray-500">Staff Member</p>
                          <p className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                            selectedStaff.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : selectedStaff.status === 'Inactive' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {selectedStaff.status}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-5">
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Contact Information</h4>
                          <div className="space-y-2">
                            <p className="flex items-center gap-2 text-gray-700">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {selectedStaff.phone}
                            </p>
                            <p className="flex items-center gap-2 text-gray-700">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {selectedStaff.user?.email}
                            </p>
                            <p className="flex items-center gap-2 text-gray-700">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {selectedStaff.gender}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Address</h4>
                          <div className="space-y-2">
                            <p className="text-gray-700">{selectedStaff.address}</p>
                            <p className="text-gray-700">{selectedStaff.city}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 h-full flex items-center justify-center">
                <div className="p-8 text-center">
                  <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                    <FiUser className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-gray-600 font-medium mb-1">No Staff Selected</h3>
                  <p className="text-gray-400 text-sm">Select a staff member from the list or add a new one</p>
                  <button
                    onClick={handleAddStaff}
                    className="mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-sm mx-auto"
                  >
                    <FiPlus /> Add Staff Member
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;