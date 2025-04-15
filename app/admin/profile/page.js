'use client';

import { useState, useRef } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiCalendar, FiEdit2, FiSave, FiX, FiEye, FiEyeOff, FiUpload, FiCamera } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/utils/imageUtils';

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@vitalcare.com',
    phone: '+94 77 123 4567',
    role: 'Super Admin',
    joinDate: '2023-01-15'
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      showSuccessMessage('Profile updated successfully!');
    }, 1500);
  };

  const handlePasswordSubmit = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showErrorMessage("Passwords don't match!");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      showSuccessMessage('Password changed successfully!');
    }, 1500);
  };

  const showSuccessMessage = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const showErrorMessage = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setShowImageCropper(true);
    }
  };

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleImageSave = async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );
      // Here you would typically upload the cropped image to your server
      // For now, we'll just set it in state
      setImageSrc(croppedImage);
      setShowImageCropper(false);
      showSuccessMessage('Profile picture updated successfully!');
    } catch (e) {
      showErrorMessage('Error cropping image');
    }
  };

  const fieldClasses = `w-full px-4 py-3 text-gray-500 rounded-lg border-2 focus:outline-none focus:ring-2 ${
    isEditing ? 'border-indigo-200 focus:border-indigo-500 focus:ring-indigo-200' : 'border-transparent'
  }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      {/* Success/Error Message */}
      {showMessage && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`px-6 py-3 rounded-lg shadow-lg ${
            message.includes('success') ? 'bg-green-500' : 'bg-red-500'
          } text-white font-medium`}>
            {message}
          </div>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Admin Profile</h1>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-black gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
                >
                  <FiEdit2 /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="flex items-center text-black gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
                  >
                    <FiSave /> {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center text-black gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
                  >
                    <FiX /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                  {imageSrc ? (
                    <img 
                      src={imageSrc} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-indigo-600 text-5xl" />
                  )}
                </div>
                {isEditing && (
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
                  >
                    <FiCamera size={16} />
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              <button
                onClick={() => setShowPasswordModal(true)}
                className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <FiLock /> Change Password
              </button>
            </div>

            {/* Profile Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <FiUser className="text-indigo-600" /> Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className={fieldClasses}
                  />
                ) : (
                  <div className="text-lg font-medium text-gray-800 p-3">{profile.name}</div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <FiMail className="text-indigo-600" /> Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className={fieldClasses}
                  />
                ) : (
                  <div className="text-lg text-gray-800 p-3">{profile.email}</div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <FiPhone className="text-indigo-600" /> Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    className={fieldClasses}
                  />
                ) : (
                  <div className="text-lg text-gray-800 p-3">{profile.phone}</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiUser className="text-indigo-600" /> Role
                  </label>
                  <div className="text-lg text-gray-800 p-3">{profile.role}</div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiCalendar className="text-indigo-600" /> Member Since
                  </label>
                  <div className="text-lg text-gray-800 p-3">
                    {new Date(profile.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Cropper Modal */}
      {showImageCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl"
          >
            <div className="p-4 border-b">
              <h3 className="text-xl font-bold text-gray-800">Crop Profile Picture</h3>
            </div>
            
            <div className="relative h-96 w-full">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            </div>
            
            <div className="p-4 border-t flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Zoom:</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-32"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowImageCropper(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImageSave}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg"
                >
                  Save Photo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
          >
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
            </div>
            
            <div className="p-6 space-y-4 text-gray-500">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                  <button
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
                  >
                    {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
                  >
                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-70 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
          >
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Confirm Changes</h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6">Are you sure you want to save these changes to your profile?</p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    handleSave();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}