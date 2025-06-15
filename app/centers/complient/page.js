'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiCalendar,  
  FiUser, 
  FiPhone, 
  FiTrash2,
  FiPlus,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiMessageSquare
} from 'react-icons/fi';
import {FaSpinner} from 'react-icons/fa';

// API service for complaint operations
const complaintService = {
  // Get all complaints for the current merchant
  getComplaints: async (merchantId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/compleint/merchant/${merchantId}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  },
  
  // Get complaints filtered by status
  getComplaintsByStatus: async (merchantId, status) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/compleint/merchant/${merchantId}/status/${status}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching complaints by status:', error);
      throw error;
    }
  },
  
  // Create a new complaint
  createComplaint: async (merchantId, complaintData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/compleint/merchant/${merchantId}`,
        complaintData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw error;
    }
  },
  
  // Update complaint status
  updateComplaintStatus: async (complaintId, status) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/compleint/${complaintId}/status`,
        { status },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating complaint status:', error);
      throw error;
    }
  },
  
  // Delete complaint
  deleteComplaint: async (complaintId) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/compleint/${complaintId}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting complaint:', error);
      throw error;
    }
  }
};

// Main Page Component
export default function ManageQueries() {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [merchantId, setMerchantId] = useState(null);
  const [merchantData, setMerchantData] = useState(null);
  const [expandedComplaints, setExpandedComplaints] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
      
      setMerchantId(profileData.id);
      setMerchantData({
        id: profileData.id,
        clinicName: profileData.clinicName,
        status: profileData.status,
        address: profileData.address
      });
    };

    checkAuth();
  }, [router]);

  // Fetch complaints when merchantId or filter changes
  useEffect(() => {
    const fetchComplaints = async () => {
      if (!merchantId) return;
      
      setLoading(true);
      try {
        let data;
        if (filter === 'all') {
          data = await complaintService.getComplaints(merchantId);
        } else {
          data = await complaintService.getComplaintsByStatus(merchantId, filter);
        }
        
        setComplaints(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        if (err.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          router.push('/login');
        } else {
          setError('Failed to fetch complaints. Please try again later.');
        }
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [merchantId, filter, router]);

  // Handle new complaint submission
  const handleSubmitComplaint = async (formData) => {
    if (!merchantId) {
      throw new Error('Authentication data not available');
    }
    
    try {
      const newComplaint = await complaintService.createComplaint(
        merchantId, 
        formData
      );
      
      setComplaints([newComplaint, ...complaints]);
      setShowForm(false);
      toast.success('Complaint submitted successfully!');
      return newComplaint;
    } catch (error) {
      console.error('Error submitting complaint:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        router.push('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit complaint');
      }
      throw error;
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending':
        return 'bg-amber-500/10 text-amber-600';
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-600';
      case 'Resolved':
        return 'bg-emerald-500/10 text-emerald-600';
      case 'Rejected':
        return 'bg-red-500/10 text-red-600';
      default:
        return 'bg-gray-500/10 text-gray-600';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending':
        return <FiClock className="w-4 h-4" />;
      case 'In Progress':
        return <FiClock className="w-4 h-4" />;
      case 'Resolved':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'Rejected':
        return <FiXCircle className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  // Handle complaint status update
  const handleUpdateStatus = async (complaintId, newStatus) => {
    try {
      await complaintService.updateComplaintStatus(complaintId, newStatus);
      
      setComplaints(complaints.map(complaint => 
        complaint._id === complaintId 
          ? { ...complaint, status: newStatus } 
          : complaint
      ));
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating complaint status:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        router.push('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update status');
      }
    }
  };

  // Handle deleting a complaint
  const handleDeleteComplaint = async (complaintId) => {
    setIsDeleting(true);
    try {
      await complaintService.deleteComplaint(complaintId);
      setComplaints(complaints.filter(complaint => complaint._id !== complaintId));
      toast.success('Complaint deleted successfully');
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting complaint:', error);
      toast.error(error.response?.data?.message || 'Failed to delete complaint');
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle complaint expansion
  const toggleExpandComplaint = (complaintId) => {
    setExpandedComplaints(prev => ({
      ...prev,
      [complaintId]: !prev[complaintId]
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Get the latest admin reply from notes
  const getLatestAdminReply = (notes) => {
    if (!notes || notes.length === 0) return null;
    
    // Sort notes by date (newest first)
    const sortedNotes = [...notes].sort((a, b) => 
      new Date(b.addedAt) - new Date(a.addedAt)
    );
    
    // Find the first note added by an admin (assuming addedBy is populated)
    const adminNote = sortedNotes.find(note => 
      note.addedBy && note.addedBy.role === 'admin'
    );
    
    return adminNote || sortedNotes[0]; // Return the latest note if no admin note found
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-6">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Clinical Center Queries</h1>
              <p className="text-gray-600 mt-1">Track and manage clinical staff complaints</p>
              
              {merchantData && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-700">{merchantData.clinicName}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    merchantData.status === 'Active' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {merchantData.status}
                  </span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
            >
              {showForm ? (
                <>
                  <FiX className="w-4 h-4" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <FiPlus className="w-4 h-4" />
                  <span>New Complaint</span>
                </>
              )}
            </button>
          </div>

          {/* Complaint Form */}
          {showForm && (
            <div className="mb-8">
              <ComplaintForm 
                clinicName={merchantData?.clinicName || ''}
                onSubmit={handleSubmitComplaint}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex overflow-x-auto pb-2 mb-6 gap-1">
            {['all', 'Pending', 'In Progress', 'Resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`py-2 px-4 whitespace-nowrap text-sm font-medium rounded-lg transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {status === 'all' ? 'All Complaints' : status}
              </button>
            ))}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {['Pending', 'In Progress', 'Resolved'].map((status) => (
              <div key={status} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{status}</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {complaints.filter(c => filter === 'all' ? c.status === status : true).length}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
                                            <div className="flex flex-col items-center">
                                              <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
                                              <p className="text-gray-600">Loading compleints...</p>
                                            </div>
                                          </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Complaints List */}
          {!loading && !error && complaints.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiXCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No complaints found</h3>
              <p className="mt-1 text-gray-500">
                {filter === 'all' 
                  ? 'You haven\'t submitted any complaints yet.' 
                  : `No complaints with status "${filter}"`}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Submit New Complaint
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {!loading && !error && complaints.map((complaint) => {
                const latestReply = getLatestAdminReply(complaint.notes);
                
                return (
                  <div key={complaint._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Complaint Header */}
                    <div 
                      className={`p-4 cursor-pointer ${expandedComplaints[complaint._id] ? 'border-b border-gray-200' : ''}`}
                      onClick={() => toggleExpandComplaint(complaint._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getStatusColor(complaint.status)}`}>
                            {getStatusIcon(complaint.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{complaint.subject}</h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(complaint.submittedOn)} at {formatTime(complaint.submittedOn)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                          {expandedComplaints[complaint._id] ? (
                            <FiChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <FiChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Content */}
                    {expandedComplaints[complaint._id] && (
                      <div className="p-4 pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          {/* Sender Info */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Sender Information</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FiUser className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-900">{complaint.senderName}</span>
                              </div>
                              {complaint.contactInfo && (
                                <div className="flex items-center gap-2">
                                  <FiPhone className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-900">{complaint.contactInfo}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Clinic Info */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Clinic Information</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                                <span className="text-sm text-gray-900">{complaint.clinicName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FiCalendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-900">
                                  Occurred on {formatDate(complaint.dateOfOccurrence)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                          <p className="text-gray-700 whitespace-pre-line">{complaint.description}</p>
                        </div>
                        
                        {/* Admin Reply Section */}
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                            <FiMessageSquare className="w-4 h-4" />
                            Admin Reply
                          </h4>
                          {latestReply ? (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-medium text-blue-800">
                                  {latestReply.addedBy?.name || 'Admin'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(latestReply.addedAt)} at {formatTime(latestReply.addedAt)}
                                </span>
                              </div>
                              <p className="text-gray-700 whitespace-pre-line">{latestReply.content}</p>
                            </div>
                          ) : (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <p className="text-gray-500 text-sm">No reply from admin yet</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          {/* Status Update Button - Only show for Pending status */}
                          {complaint.status === 'Pending' && (
                            <button 
                              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
                              onClick={() => handleUpdateStatus(complaint._id, 'In Progress')}
                            >
                              <FiClock className="w-4 h-4" />
                              Set to In Progress
                            </button>
                          )}
                          
                          {/* Delete Button */}
                          <button
                            className="py-2 px-4 bg-white hover:bg-gray-50 text-red-600 border border-red-200 text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2 ml-auto"
                            onClick={() => setDeleteId(complaint._id)}
                          >
                            <FiTrash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Complaint</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this complaint? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="py-2 px-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium rounded-lg shadow-sm transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteComplaint(deleteId)}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Complaint Form Component
const ComplaintForm = ({ 
  clinicName = '', 
  onSubmit,
  onCancel
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    clinicName: clinicName,
    senderName: '',
    contactInfo: '',
    subject: '',
    description: '',
    dateOfOccurrence: today,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/;
    
    // Required fields validation
    if (!formData.clinicName.trim()) errors.clinicName = 'Clinic name is required';
    if (!formData.senderName.trim()) errors.senderName = 'Name is required';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.dateOfOccurrence) errors.dateOfOccurrence = 'Date of occurrence is required';
    
    // Contact info validation (if provided)
    if (formData.contactInfo.trim()) {
      if (!emailRegex.test(formData.contactInfo)) {
        errors.contactInfo = 'Please enter a valid email address';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      
      setFormData({
        clinicName: clinicName,
        senderName: '',
        contactInfo: '',
        subject: '',
        description: '',
        dateOfOccurrence: today,
      });
      
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
      
    } catch (error) {
      setFormErrors({ 
        submit: error.response?.data?.message || 'Failed to submit complaint. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Clinical Staff Complaint Form</h2>
            <p className="text-blue-100 text-sm mt-1">
              Report issues or submit complaints to system administration
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-blue-800 transition-colors"
          >
            <FiX className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      
      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 p-4 rounded-r-lg">
            <p className="font-medium">Success!</p>
            <p className="text-sm">Your complaint has been submitted successfully.</p>
          </div>
        )}
        
        {/* Error Message */}
        {formErrors.submit && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg">
            <p className="font-medium">Error</p>
            <p className="text-sm">{formErrors.submit}</p>
          </div>
        )}
        
        {/* Clinic Name */}
        <div>
          <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700 mb-1">
            Clinic Name*
          </label>
          <input
            type="text"
            id="clinicName"
            name="clinicName"
            value={formData.clinicName}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.clinicName ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {formErrors.clinicName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.clinicName}</p>
          )}
        </div>
        
        {/* Sender Name */}
        <div>
          <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-1">
            Name (Doctor/Nurse)*
          </label>
          <input
            type="text"
            id="senderName"
            name="senderName"
            value={formData.senderName}
            onChange={handleInputChange}
            placeholder="Dr. John Doe"
            className={`w-full p-3 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.senderName ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {formErrors.senderName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.senderName}</p>
          )}
        </div>
        
        {/* Contact Information */}
        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
            Email (Optional)
          </label>
          <input
            type="email"
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleInputChange}
            placeholder="email@example.com"
            className={`w-full p-3 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.contactInfo ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.contactInfo && (
            <p className="mt-1 text-sm text-red-600">{formErrors.contactInfo}</p>
          )}
        </div>
        
        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject*
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="E.g., Appointment System Issue"
            className={`w-full p-3 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.subject ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {formErrors.subject && (
            <p className="mt-1 text-sm text-red-600">{formErrors.subject}</p>
          )}
        </div>
        
        {/* Date of Occurrence */}
        <div>
          <label htmlFor="dateOfOccurrence" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Occurrence*
          </label>
          <input
            type="date"
            id="dateOfOccurrence"
            name="dateOfOccurrence"
            value={formData.dateOfOccurrence}
            onChange={handleInputChange}
            max={today}
            className={`w-full p-3 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.dateOfOccurrence ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {formErrors.dateOfOccurrence && (
            <p className="mt-1 text-sm text-red-600">{formErrors.dateOfOccurrence}</p>
          )}
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description of the Issue*
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="5"
            placeholder="Please provide detailed information about the issue..."
            className={`w-full p-3 border rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          ></textarea>
          {formErrors.description && (
            <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="py-3 px-6 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm border border-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`py-3 px-6 rounded-lg text-white font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </div>
            ) : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
};