'use client';

import { useState, useRef, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiCalendar, FiEdit2, FiSave, FiX, FiEye, FiEyeOff, FiCamera } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/utils/imageUtils';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AdminProfile() {
  const fileInputRef = useRef(null);

  // State for profile data
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    joinDate: '',
    profileImage: null
  });

  // State for UI controls
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    image: false
  });

  // State for password change
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // State for image cropping
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showImageCropper, setShowImageCropper] = useState(false);
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  // Fetch admin profile data on component mount
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin-profile/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProfile({
          name: response.data?.data?.name || 'Admin',
          email: response.data?.data?.userDetails?.email || '',
          phone: response.data?.data?.phoneNumber || '',
          role: response.data?.data?.adminType === 'superadmin' ? 'Super Admin' : 'Admin',
          joinDate: response.data?.data?.userDetails?.createdAt || new Date().toISOString(),
          profileImage: response.data?.data?.profileImage || null
        });
        
        if (response.data?.data?.profileImage) {
          setImageSrc(response.data?.data?.profileImage);
        }
      } catch (error) {
        toast.error('Failed to load profile data');
        console.error('Profile fetch error:', error);
      }
    };

    fetchAdminProfile();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(prev => ({ ...prev, profile: true }));
      
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin-profile/profile`,
        {
          name: profile.name,
          phoneNumber: profile.phone
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, password: true }));
      
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin-profile/change-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
      console.error('Password change error:', error);
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type and size
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Image size should be less than 2MB');
        return;
      }

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
      setLoading(prev => ({ ...prev, image: true }));
      
      // 1. First verify we have a valid image source
      if (!imageSrc) {
        throw new Error('No image source available');
      }
  
      // 2. Get the cropped image and verify it's a Blob
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      // Debug log to check what we're getting
      console.log('Cropped image type:', typeof croppedImage, croppedImage);
      
      // 3. If it's already a base64 string, use it directly
      if (typeof croppedImage === 'string' && croppedImage.startsWith('data:image')) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin-profile/profile-image`,
          { image: croppedImage },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setImageSrc(croppedImage);
      } 
      // 4. If it's a Blob, convert it
      else if (croppedImage instanceof Blob) {
        const base64data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Failed to read image data'));
          reader.readAsDataURL(croppedImage);
        });
  
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin-profile/profile-image`,
          { image: base64data },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setImageSrc(base64data);
      } 
      // 5. Handle unexpected return type
      else {
        throw new Error('Unexpected return type from getCroppedImg');
      }
  
      setShowImageCropper(false);
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Full error:', error);
      toast.error(error.message || 'Failed to update profile picture');
    } finally {
      setLoading(prev => ({ ...prev, image: false }));
    }
  };

  const fieldClasses = `w-full px-4 py-3 text-gray-500 rounded-lg border-2 focus:outline-none focus:ring-2 ${
    isEditing ? 'border-indigo-200 focus:border-indigo-500 focus:ring-indigo-200' : 'border-transparent'
  }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 md:p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-xl md:text-2xl font-bold">Admin Profile</h1>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-black gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all w-full md:w-auto justify-center"
                >
                  <FiEdit2 /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={handleSave}
                    disabled={loading.profile}
                    className="flex items-center text-black gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all w-full md:w-auto justify-center disabled:opacity-70"
                  >
                    {loading.profile ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave /> Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center text-black gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all w-full md:w-auto justify-center"
                  >
                    <FiX /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Avatar Section */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                  {imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={imageSrc} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-indigo-600 text-4xl md:text-5xl" />
                  )}
                </div>
                {isEditing && (
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 md:p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
                  >
                    <FiCamera size={14} className="md:size-4" />
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
                className="mt-2 md:mt-4 px-3 py-1 md:px-4 md:py-2 bg-gray-800 hover:bg-gray-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-1 md:gap-2 text-sm md:text-base"
              >
                <FiLock className="text-sm md:text-base" /> Change Password
              </button>
            </div>

            {/* Profile Details */}
            <div className="md:col-span-2 space-y-4 md:space-y-6">
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
                  <div className="text-base md:text-lg font-medium text-gray-800 p-2 md:p-3">{profile.name}</div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <FiMail className="text-indigo-600" /> Email Address
                </label>
                <div className="text-base md:text-lg text-gray-800 p-2 md:p-3">{profile.email}</div>
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
                  <div className="text-base md:text-lg text-gray-800 p-2 md:p-3">{profile.phone}</div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiUser className="text-indigo-600" /> Role
                  </label>
                  <div className="text-base md:text-lg text-gray-800 p-2 md:p-3">{profile.role}</div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiCalendar className="text-indigo-600" /> Member Since
                  </label>
                  <div className="text-base md:text-lg text-gray-800 p-2 md:p-3">
                    {profile.joinDate ? new Date(profile.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Loading...'}
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
            className="bg-white rounded-xl md:rounded-2xl shadow-xl w-full max-w-md md:max-w-2xl"
          >
            <div className="p-4 border-b">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Crop Profile Picture</h3>
            </div>
            
            <div className="relative h-64 md:h-96 w-full">
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
            
            <div className="p-4 border-t flex flex-col md:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-sm text-gray-600">Zoom:</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full md:w-32"
                />
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowImageCropper(false)}
                  className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 w-full md:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImageSave}
                  disabled={loading.image}
                  className="px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg w-full md:w-auto disabled:opacity-70"
                >
                  {loading.image ? 'Saving...' : 'Save Photo'}
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
            className="bg-white rounded-xl md:rounded-2xl shadow-xl w-full max-w-md"
          >
            <div className="p-4 md:p-6 border-b">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Change Password</h3>
            </div>
            
            <div className="p-4 md:p-6 space-y-3 md:space-y-4 text-gray-500">
              <div className="space-y-1 md:space-y-2">
                <label className="text-sm font-medium text-gray-600">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                  <button
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-2 md:top-3 text-gray-500 hover:text-indigo-600"
                  >
                    {showCurrentPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
                <label className="text-sm font-medium text-gray-600">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2 md:top-3 text-gray-500 hover:text-indigo-600"
                  >
                    {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
                <label className="text-sm font-medium text-gray-600">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>

            <div className="p-4 md:p-6 border-t flex flex-col md:flex-row justify-end gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 w-full md:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                disabled={loading.password}
                className="px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-1 md:gap-2 w-full md:w-auto"
              >
                {loading.password ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    </div>
  );
}