'use client';

import React, { useState, useEffect } from 'react';
import { FiCalendar, FiFilter, FiUser, FiPhone, FiClock, FiActivity, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { FaClinicMedical, FaUserMd, FaUserInjured, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const ManageAppointmentsReport = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clinicFilter, setClinicFilter] = useState('');
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
    ongoing: 0,
    totalClinics: 0
  });

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both appointments and stats in parallel
        const [appointmentsRes, statsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/appointmentreport/report`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/appointmentreport/stats`)
        ]);
        
        setAppointments(appointmentsRes.data.appointments);
        setFilteredAppointments(appointmentsRes.data.appointments);
        setClinics(appointmentsRes.data.clinics);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // You might want to show an error message to the user here
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fetch filtered data when filters change
  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (statusFilter) params.append('status', statusFilter);
        if (clinicFilter) params.append('clinicId', clinicFilter);
        
        const [appointmentsRes, statsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/appointmentreport/report?${params.toString()}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/appointmentreport/stats?${params.toString()}`)
        ]);
        
        setFilteredAppointments(appointmentsRes.data.appointments);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching filtered data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if we have at least one filter
    if (startDate || endDate || statusFilter || clinicFilter) {
      fetchFilteredData();
    }
  }, [startDate, endDate, statusFilter, clinicFilter]);

  // Calculate statistics from filtered data if no filters are applied
  const totalAppointments = startDate || endDate || statusFilter || clinicFilter 
    ? stats.total 
    : filteredAppointments.length;
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ongoingCount = startDate || endDate || statusFilter || clinicFilter 
    ? stats.ongoing 
    : filteredAppointments.filter(a => a.status === 'Ongoing').length;
  
  const completedCount = startDate || endDate || statusFilter || clinicFilter 
    ? stats.completed 
    : filteredAppointments.filter(a => a.status === 'Completed').length;
  
  const cancelledCount = startDate || endDate || statusFilter || clinicFilter 
    ? stats.cancelled 
    : filteredAppointments.filter(a => a.status === 'Cancelled').length;
  
  const totalClinics = startDate || endDate || statusFilter || clinicFilter 
    ? stats.totalClinics 
    : [...new Set(filteredAppointments.map(a => a.clinicId))].length;

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleClinicChange = (e) => {
    setClinicFilter(e.target.value);
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('');
    setClinicFilter('');
    setFilteredAppointments(appointments);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
                      <p className="text-gray-600">Loading appointments...</p>
                    </div>
                  </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center">
            <FiActivity className="mr-2" /> Appointments Report
          </h1>
          <p className="text-gray-600 mt-2">View and filter appointment records</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaClinicMedical size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Clinics</p>
              <p className="text-2xl text-blue-500 font-bold">{totalClinics}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FiUser size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Appointments</p>
              <p className="text-2xl text-purple-500 font-bold">{totalAppointments}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiCheckCircle size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl text-green-500 font-bold">{completedCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <FiXCircle size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cancelled</p>
              <p className="text-2xl text-red-500 font-bold">{cancelledCount}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiFilter className="mr-2" /> Filter Options
            </h2>
            <button 
              onClick={resetFilters}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
                <FiCalendar className="mr-1" /> Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full px-4 text-gray-500 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1  items-center">
                <FiCalendar className="mr-1" /> End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="w-full px-4 text-gray-500 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1  items-center">
                <FaClinicMedical className="mr-1" /> Clinic
              </label>
              <select
                value={clinicFilter}
                onChange={handleClinicChange}
                className="w-full px-4 text-gray-500 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">All Clinics</option>
                {clinics.map(clinic => (
                  <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
                <FiLoader className="mr-1" /> Status
              </label>
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="w-full px-4 text-gray-500 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">All Status</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report Heading */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {startDate && endDate ? (
              <span>Showing appointments from <span className="text-blue-600">{startDate}</span> to <span className="text-blue-600">{endDate}</span></span>
            ) : (
              'All Appointments'
            )}
          </h2>
          <p className="text-gray-500 text-sm">
            Showing {filteredAppointments.length} of {appointments.length} records
          </p>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaClinicMedical className="inline mr-1" /> Clinic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaUserMd className="inline mr-1" /> Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaUserInjured className="inline mr-1" /> Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FiPhone className="inline mr-1" /> Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FiCalendar className="inline mr-1" /> Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FiClock className="inline mr-1" /> Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment, index) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.clinicName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.doctorName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.patientName} ({appointment.patientGender})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.patientContact}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.appointmentDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'Ongoing' ? 'bg-yellow-100 text-yellow-800' :
                          appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FiFilter size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No appointments found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAppointmentsReport;