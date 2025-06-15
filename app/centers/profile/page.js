'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaSave, FaLock, FaEnvelope, FaHospital, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('clinic'); // 'clinic' or 'account'
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    clinicName: '',
    address: '',
    city: '',
    phoneNumber: '',
    inchargeName: '',
    email: '',
    status: 'Active',
    isApproved: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Format text to sentence case
  const toSentenceCase = (str) => {
    if (!str) return '';
    return str.toLowerCase().split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Fetch clinic profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const clinicId = localStorage.getItem('clinicId');
        
        if (!clinicId) {
          toast.error('Please login to access this page');
          router.push('/login');
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/clinicProfile/${clinicId}`,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data?.success) {
          const { data: clinicData, user } = response.data;
          
          setFormData(prev => ({
            ...prev,
            clinicName: toSentenceCase(clinicData.clinicName || clinicData.clinicname || ''),
            address: clinicData.address || '',
            city: toSentenceCase(clinicData.city || ''),
            phoneNumber: clinicData.phoneNumber || '',
            inchargeName: toSentenceCase(clinicData.inchargeName || clinicData.in_chargename || ''),
            email: user?.email || '',
            status: clinicData.status || 'Active',
            isApproved: clinicData.isApproved || false
          }));

          localStorage.setItem('profileData', JSON.stringify({
            ...clinicData,
            user
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        const errorMessage = error.response?.data?.message || 'Failed to load profile';
        toast.error(errorMessage);
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format specific fields before setting state
    let processedValue = value;
    
    if (name === 'phoneNumber') {
      // Limit phone number to 10 digits
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'clinicName' || name === 'city' || name === 'inchargeName') {
      // Convert to sentence case as user types
      processedValue = toSentenceCase(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear errors when user types
    if (name === 'email' && errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
    if ((name === 'newPassword' || name === 'confirmPassword') && errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      status: value,
      isApproved: value === 'Active'
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (activeSection === 'account') {
      // Email validation
      if (isEditing && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
        isValid = false;
      }

      // Password validation if any password field is filled
      if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
        if (!formData.currentPassword) {
          newErrors.password = 'Current password is required';
          isValid = false;
        } else if (!formData.newPassword) {
          newErrors.password = 'New password is required';
          isValid = false;
        } else if (formData.newPassword.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
          isValid = false;
        } else if (formData.newPassword !== formData.confirmPassword) {
          newErrors.password = 'Passwords do not match';
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const confirmSave = () => {
    return window.confirm('Are you sure you want to save these changes?');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!confirmSave()) {
      return; // User clicked "No", stay on page
    }

    setIsUpdating(true);
    const clinicId = localStorage.getItem('clinicId');
    
    if (!clinicId) {
      toast.error('Authentication required');
      setIsUpdating(false);
      return;
    }

    try {
      const storedProfile = JSON.parse(localStorage.getItem('profileData') || '{}');
      
      if (activeSection === 'clinic') {
        // Update only clinic information
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/clinicProfile/update/${clinicId}`,
          {
            clinicName: formData.clinicName,
            address: formData.address,
            city: formData.city,
            phoneNumber: formData.phoneNumber,
            inchargeName: formData.inchargeName,
            status: formData.status
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to update clinic information');
        }

        // Update local state
        const updatedProfile = {
          ...response.data?.profile || {},
          user: storedProfile.user || {}
        };

        localStorage.setItem('profileData', JSON.stringify(updatedProfile));
        toast.success('Clinic information updated successfully');
        
      } else if (activeSection === 'account') {
        // Update account information
        const updates = [];
        const emailChanged = formData.email !== storedProfile.user?.email;
        const passwordChanged = formData.currentPassword && formData.newPassword && formData.confirmPassword;

        if (emailChanged) {
          updates.push(
            axios.put(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/clinicProfile/profile/email`,
              { 
                email: formData.email,
                clinicId: clinicId 
              },
              {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )
          );
        }

        if (passwordChanged) {
          updates.push(
            axios.put(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/clinicProfile/profile/password`,
              {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
                clinicId: clinicId 
              },
              {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )
          );
        }

        if (updates.length > 0) {
          const responses = await Promise.all(updates);
          responses.forEach(response => {
            if (!response.data.success) {
              throw new Error(response.data.message || 'Update failed');
            }
          });
        }

        // Update local state
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));

        if (emailChanged || passwordChanged) {
          toast.success('Account information updated successfully');
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      let errorMessage = 'Failed to update profile';
      
      if (error.response) {
        if (error.response.data?.errors) {
          errorMessage = error.response.data.errors.map(err => err.msg || err.message).join(', ');
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h1 className="text-2xl font-bold">Clinic Profile</h1>
          <p className="text-blue-100">Manage your clinic information and account settings</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-3 font-medium text-sm ${activeSection === 'clinic' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveSection('clinic')}
          >
            Clinic Information
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${activeSection === 'account' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveSection('account')}
          >
            Account Information
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {activeSection === 'clinic' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaHospital className="mr-2 text-blue-600" />
                Clinic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Clinic Name */}
                <div>
                  <label className="block text-sm text-black font-bold mb-1">Clinic Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="clinicName"
                      value={formData.clinicName}
                      onChange={handleChange}
                      className="w-full px-3 text-gray-600 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  ) : (
                    <p className={`px-3 py-2 text-gray-600 bg-gray-50 rounded-md ${!formData.clinicName ? 'text-gray-400' : ''}`}>
                      {formData.clinicName || 'Not provided'}
                    </p>
                  )}
                </div>
                
                {/* Address */}
                <div>
                  <label className="block text-sm text-black font-bold mb-1">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 text-gray-600 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  ) : (
                    <p className={`px-3 py-2 text-gray-600 bg-gray-50 rounded-md ${!formData.address ? 'text-gray-400' : ''}`}>
                      {formData.address || 'Not provided'}
                    </p>
                  )}
                </div>
                
                {/* City */}
                <div>
                  <label className="block text-sm text-black font-bold mb-1">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  ) : (
                    <p className={`px-3 text-gray-600 py-2 bg-gray-50 rounded-md ${!formData.city ? 'text-gray-400' : ''}`}>
                      {formData.city || 'Not provided'}
                    </p>
                  )}
                </div>
                
                {/* Phone Number */}
                <div>
                  <label className="block text-sm text-black font-bold mb-1">Phone Number (10 digits)</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      maxLength={10}
                      pattern="\d{10}"
                      title="Please enter exactly 10 digits"
                    />
                  ) : (
                    <p className={`px-3 py-2 bg-gray-50 text-gray-600 rounded-md ${!formData.phoneNumber ? 'text-gray-400' : ''}`}>
                      {formData.phoneNumber || 'Not provided'}
                    </p>
                  )}
                </div>
                
                {/* Incharge Name */}
                <div>
                  <label className="block text-sm text-black font-bold mb-1">Incharge Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="inchargeName"
                      value={formData.inchargeName}
                      onChange={handleChange}
                      className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  ) : (
                    <p className={`px-3 py-2 bg-gray-50 text-gray-600 rounded-md ${!formData.inchargeName ? 'text-gray-400' : ''}`}>
                      {formData.inchargeName || 'Not provided'}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm text-black font-bold mb-1">Status</label>
                  {isEditing ? (
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleStatusChange}
                      className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!formData.isApproved}
                    >
                      <option value="Active">Active</option>
                    </select>
                  ) : (
                    <div className="flex text-gray-600 items-center px-3 py-2 bg-gray-50 rounded-md">
                      {formData.status === 'Active' ? (
                        <FaCheckCircle className="text-green-500 mr-2" />
                      ) : (
                        <FaTimesCircle className="text-red-500 mr-2" />
                      )}
                      <span>{formData.status}</span>
                    </div>
                  )}
                </div>

                {/* Approval Status */}
                <div>
                  <label className="block text-sm text-black font-bold mb-1">Approval Status</label>
                  <div className="flex text-gray-600 items-center px-3 py-2 bg-gray-50 rounded-md">
                    {formData.isApproved ? (
                      <>
                        <FaCheckCircle className="text-green-500 mr-2" />
                        <span>Approved</span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-yellow-500 mr-2" />
                        <span>Pending Approval</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'account' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaLock className="mr-2 text-blue-600" />
                Account Information
              </h2>
              
              {/* Email */}
              <div>
                <label className="block text-sm text-black font-bold mb-1 items-center">
                  <FaEnvelope className="mr-2 text-blue-600" />
                  Email Address
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 text-gray-600 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </>
                ) : (
                  <p className={`px-3 py-2 text-gray-600 bg-gray-50 rounded-md ${!formData.email ? 'text-gray-400' : ''}`}>
                    {formData.email || 'Not provided'}
                  </p>
                )}
              </div>
              
              {/* Password Fields (only shown when editing) */}
              {isEditing && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-black font-bold mb-1">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className={`w-full text-gray-600 px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter current password (required for changes)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-black font-bold mb-1">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className={`w-full text-gray-600 px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter new password (minimum 8 characters)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-black font-bold mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-3 text-gray-600 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Confirm new password"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaEdit className="mr-2" />
                Edit {activeSection === 'clinic' ? 'Clinic Info' : 'Account Info'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}