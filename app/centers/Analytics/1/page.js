'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FiClock, FiCheckCircle, FiXCircle, FiUsers, FiCalendar, FiFilter, FiUser, FiPhone, FiClock as FiTime } from 'react-icons/fi';
import {FaSpinner} from 'react-icons/fa';

const ManageAppointmentsReport = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [completeAppointments, setCompleteAppointments] = useState(0);
  const [confirmAppointments, setConfirmAppointments] = useState(0);
  const [cancelAppointments, setCancelAppointments] = useState(0);
  const [doctorsList, setDoctorsList] = useState([]);
  const [clinicId, setClinicId] = useState('');
  const [clinicInfo, setClinicInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
      setClinicInfo({
        name: profileData.clinicName,
        status: profileData.status,
        address: profileData.address
      });
    };

    checkAuth();
  }, [router]);

  // Fetch data when clinicId changes
  useEffect(() => {
    const fetchData = async () => {
      if (!clinicId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch initial report data
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/analytics/${clinicId}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data?.success) {
          setAppointments(response.data.data.appointments);
          setFilteredAppointments(response.data.data.appointments);
          setDoctorsList(response.data.data.doctors);
          
          // Set metrics from backend
          setTotalAppointments(response.data.data.metrics.totalAppointments);
          setConfirmAppointments(response.data.data.metrics.confirmAppointments);
          setCompleteAppointments(response.data.data.metrics.completeAppointments);
          setCancelAppointments(response.data.data.metrics.cancelAppointments);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          router.push('/login');
        } else {
          toast.error(error.response?.data?.message || 'Failed to load appointments');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [clinicId, router]);

  const updateDashboardMetrics = (appointmentsData) => {
    setTotalAppointments(appointmentsData.length);
    setCompleteAppointments(appointmentsData.filter(app => app.status === 'Completed').length);
    setConfirmAppointments(appointmentsData.filter(app => app.status === 'Confirm').length);
    setCancelAppointments(appointmentsData.filter(app => app.status === 'Cancelled').length);
  };

  const handleStartDateChange = async (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    await filterAppointments(newStartDate, endDate, statusFilter, doctorFilter);
  };

  const handleEndDateChange = async (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    await filterAppointments(startDate, newEndDate, statusFilter, doctorFilter);
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    await filterAppointments(startDate, endDate, newStatus, doctorFilter);
  };

  const handleDoctorChange = async (e) => {
    const newDoctor = e.target.value;
    setDoctorFilter(newDoctor);
    await filterAppointments(startDate, endDate, statusFilter, newDoctor);
  };

  const filterAppointments = async (start, end, status, doctor) => {
    try {
      setIsLoading(true);
      
      const params = {};
      if (start) params.startDate = start;
      if (end) params.endDate = end;
      if (status) params.status = status;
      if (doctor) params.doctorId = doctor;
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/analytics/${clinicId}/filtered`,
        {
          params,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data?.success) {
        setFilteredAppointments(response.data.data.appointments);
        updateDashboardMetrics(response.data.data.appointments);
      }
    } catch (error) {
      console.error('Error filtering appointments:', error);
      toast.error(error.response?.data?.message || 'Failed to filter appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirm':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
                                            <div className="flex flex-col items-center">
                                              <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
                                              <p className="text-gray-600">Loading analytics...</p>
                                            </div>
                                          </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Report Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Appointments Report</h1>
          {clinicInfo && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
              <span className="font-medium text-gray-700">{clinicInfo.name}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                clinicInfo.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {clinicInfo.status}
              </span>
              <span className="text-sm text-gray-500">{clinicInfo.address}</span>
            </div>
          )}
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-medium flex items-center gap-2">
          <FiClock className="text-blue-600" />
          <span>{currentTime.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Appointments */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-3 rounded-full">
            <FiUsers className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{totalAppointments}</h2>
            <p className="text-gray-600 text-sm">All Appointments</p>
          </div>
        </div>

        {/* Confirm Appointments */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="bg-yellow-100 p-3 rounded-full">
            <FiClock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{confirmAppointments}</h2>
            <p className="text-gray-600 text-sm">Confirm Appointments</p>
          </div>
        </div>

        {/* Complete Appointments */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="bg-green-100 p-3 rounded-full">
            <FiCheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{completeAppointments}</h2>
            <p className="text-gray-600 text-sm">Complete Appointments</p>
          </div>
        </div>

        {/* Cancel Appointments */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="bg-red-100 p-3 rounded-full">
            <FiXCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{cancelAppointments}</h2>
            <p className="text-gray-600 text-sm">Cancel Appointments</p>
          </div>
        </div>
      </div>

      {/* Date Range Heading */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          {startDate && endDate ? `Report from ${formatDate(startDate)} to ${formatDate(endDate)}` : 'All Appointments'}
        </h2>
        <button 
          onClick={toggleFilters}
          className="md:hidden flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-sm"
        >
          <FiFilter className="text-gray-600" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filters Container */}
      <div className={`${showFilters ? 'block' : 'hidden'} md:block mb-6`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center gap-2">
              <FiCalendar className="text-gray-500" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="w-full px-3 text-gray-600 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center gap-2">
              <FiCalendar className="text-gray-500" />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center gap-2">
              <FiFilter className="text-gray-500" />
              Status
            </label>
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="Confirm">Confirm</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Doctor Filter */}
          <div>
            <label className="block text-sm  font-medium text-gray-700 mb-1 items-center gap-2">
              <FiUser className="text-gray-500" />
              Doctor
            </label>
            <select
              value={doctorFilter}
              onChange={handleDoctorChange}
              className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Doctors</option>
              {doctorsList.map((doctor, index) => (
                <option key={index} value={doctor._id}>{doctor.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  <div className="flex items-center gap-1">
                    <FiPhone className="text-gray-400" />
                    <span>Contact</span>
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Gender</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <FiCalendar className="text-gray-400" />
                    <span>Date</span>
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  <div className="flex items-center gap-1">
                    <FiTime className="text-gray-400" />
                    <span>Time</span>
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment, index) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {appointment.doctorName || 'Unknown Doctor'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.patientName}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {appointment.patientContact}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {appointment.patientGender}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {appointment.shiftTime || appointment.appointmentTime || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadge(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FiCalendar className="h-8 w-8 text-gray-400" />
                      <p>No appointments found for the selected filters</p>
                      <button 
                        onClick={() => {
                          setStartDate('');
                          setEndDate('');
                          setStatusFilter('');
                          setDoctorFilter('');
                          setFilteredAppointments(appointments);
                          updateDashboardMetrics(appointments);
                        }}
                        className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageAppointmentsReport;