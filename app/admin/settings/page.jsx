'use client';

import { useState } from 'react';
import { FaUser, FaLock, FaBell, FaPalette, FaDatabase, FaShieldAlt, FaGlobe, FaCog } from 'react-icons/fa';
import { FiSave, FiX } from 'react-icons/fi';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@vitalcarehub.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: true,
    darkMode: false,
    language: 'en',
    timezone: 'UTC',
    dataRetention: 30,
    twoFactorAuth: true
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (activeTab === 'account' && !formData.name) {
      newErrors.name = 'Name is required';
    }

    if (activeTab === 'security' && formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('Settings saved successfully!');
      setIsEditing(false);
      setErrors({});
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'account', icon: <FaUser />, label: 'Account' },
    { id: 'security', icon: <FaLock />, label: 'Security' },
    { id: 'notifications', icon: <FaBell />, label: 'Notifications' },
    { id: 'appearance', icon: <FaPalette />, label: 'Appearance' },
    { id: 'privacy', icon: <FaShieldAlt />, label: 'Privacy' },
    { id: 'data', icon: <FaDatabase />, label: 'Data' },
    { id: 'language', icon: <FaGlobe />, label: 'Language' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl">
                <FaUser />
              </div>
              <div className="flex-1">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Change Avatar
                </button>
                <p className="text-sm text-gray-500 mt-2">JPG, GIF or PNG. Max size of 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} ${!isEditing ? 'bg-gray-100' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border border-gray-300 ${!isEditing ? 'bg-gray-100' : ''}`}
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 flex items-center gap-2">
                <FaShieldAlt /> Two-Factor Authentication
              </h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-600">
                  {formData.twoFactorAuth ? 'Enabled' : 'Disabled'} - Adds an extra layer of security to your account
                </p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="twoFactorAuth"
                    checked={formData.twoFactorAuth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Change Password</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border border-gray-300 ${!isEditing ? 'bg-gray-100' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border border-gray-300 ${!isEditing ? 'bg-gray-100' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} ${!isEditing ? 'bg-gray-100' : ''}`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Email Notifications</h3>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">System Notifications</p>
                  <p className="text-sm text-gray-500">Important updates about your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Appointment Reminders</p>
                  <p className="text-sm text-gray-500">Get reminders for upcoming appointments</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Push Notifications</h3>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">New Messages</p>
                  <p className="text-sm text-gray-500">When you receive new messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Theme</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${!formData.darkMode ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                  onClick={() => isEditing && setFormData({...formData, darkMode: false})}
                >
                  <div className="bg-white w-full h-24 rounded-md shadow-inner mb-2"></div>
                  <p className="text-center font-medium">Light Mode</p>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.darkMode ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                  onClick={() => isEditing && setFormData({...formData, darkMode: true})}
                >
                  <div className="bg-gray-800 w-full h-24 rounded-md shadow-inner mb-2"></div>
                  <p className="text-center font-medium">Dark Mode</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Accent Color</h3>
              
              <div className="grid grid-cols-5 gap-2">
                {['blue', 'green', 'purple', 'red', 'orange'].map(color => (
                  <div 
                    key={color}
                    className={`w-10 h-10 rounded-full bg-${color}-500 cursor-pointer border-2 ${formData.accentColor === color ? 'border-gray-800' : 'border-transparent'}`}
                    onClick={() => isEditing && setFormData({...formData, accentColor: color})}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        );

      // Add cases for other tabs (privacy, data, language) similarly
      default:
        return (
          <div className="space-y-6">
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium text-gray-700">Coming Soon</h3>
              <p className="text-gray-500 mt-2">This section is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-white rounded-xl shadow-sm p-4 h-fit sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaCog className="text-blue-600" /> Settings
            </h2>
            
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <span className={`${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'}`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {tabs.find(t => t.id === activeTab)?.label} Settings
              </h2>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Settings
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setErrors({});
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    <FiX /> Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <FiSave /> Save Changes
                  </button>
                </div>
              )}
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-200">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {renderTabContent()}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}