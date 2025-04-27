'use client';

import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUser, FiClock, FiFilter, FiTrash2, FiCheckCircle, FiAlertCircle, FiXCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const AppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedAppointments, setExpandedAppointments] = useState([]);

  // Sample appointment data
  useEffect(() => {
    const sampleData = [
      { id: 1, patientName: 'Rahul Sharma', doctorName: 'Dr. Vivek', specialization: 'Allergists/Immunologists', date: '2025-03-22', time: '09:30 AM', status: 'confirmed' },
      { id: 2, patientName: 'Priya Patel', doctorName: 'Dr. Sumanth Shetty', specialization: 'Anesthesiologists', date: '2025-03-22', time: '11:00 AM', status: 'pending' },
      { id: 3, patientName: 'Anand Kumar', doctorName: 'Dr. Mohan', specialization: 'Cardiologists', date: '2025-03-23', time: '10:15 AM', status: 'confirmed' },
      { id: 4, patientName: 'Meera Reddy', doctorName: 'Dr. Baswaraj Biradar', specialization: 'Critical Care Medicine', date: '2025-03-23', time: '02:30 PM', status: 'cancelled' },
      { id: 5, patientName: 'Vikram Singh', doctorName: 'Dr. Shilpa', specialization: 'Dermatologists', date: '2025-03-24', time: '03:45 PM', status: 'confirmed' },
      { id: 6, patientName: 'Neha Gupta', doctorName: 'Dr. Aditi Garg', specialization: 'Endocrinologists', date: '2025-03-24', time: '05:00 PM', status: 'pending' },
      { id: 7, patientName: 'Ravi Desai', doctorName: 'Dr. Archana S', specialization: 'Family Physicians', date: '2025-03-25', time: '09:00 AM', status: 'confirmed' },
      { id: 8, patientName: 'Suman Joshi', doctorName: 'Dr. Santosh B S', specialization: 'Nephrologists', date: '2025-03-25', time: '11:30 AM', status: 'pending' },
      { id: 9, patientName: 'Deepak Verma', doctorName: 'Dr. Chaitra Nayak', specialization: 'Neurologists', date: '2025-03-26', time: '10:45 AM', status: 'confirmed' },
      { id: 10, patientName: 'Kavita Iyer', doctorName: 'Dr. Karthik', specialization: 'Dental Care', date: '2025-03-26', time: '04:15 PM', status: 'cancelled' }
    ];
    setAppointments(sampleData);
  }, []);

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    
    // Date range filtering
    const appointmentDate = new Date(appointment.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    let matchesDate = true;
    if (start && end) {
      matchesDate = appointmentDate >= start && appointmentDate <= end;
    } else if (start) {
      matchesDate = appointmentDate >= start;
    } else if (end) {
      matchesDate = appointmentDate <= end;
    }
    
    return matchesStatus && matchesDate;
  });

  const handleUpdateStatus = (id, newStatus) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status: newStatus } : appointment
    ));
  };

  const handleDelete = (id) => {
    setAppointments(appointments.filter(appointment => appointment.id !== id));
  };

  const clearFilters = () => {
    setFilterStatus('all');
    setStartDate('');
    setEndDate('');
  };

  const toggleAppointmentExpansion = (id) => {
    setExpandedAppointments(prev => 
      prev.includes(id) 
        ? prev.filter(apptId => apptId !== id) 
        : [...prev, id]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Appointments Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage and track all clinic appointments</p>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center justify-center w-full md:w-auto"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FiFilter className="mr-2" />
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 transition-all duration-300">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiFilter className="mr-2" /> Filter Appointments
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full p-2 text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Appointments</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <div className="relative text-gray-500">
                  <FiCalendar className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="date"
                    className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <div className="relative text-gray-500">
                  <FiCalendar className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="date"
                    className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-800 font-medium mr-4 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
            <h3 className="text-xs md:text-sm font-medium text-gray-500">Total Appointments</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{appointments.length}</p>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border-l-4 border-green-500">
            <h3 className="text-xs md:text-sm font-medium text-gray-500">Confirmed</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{appointments.filter(a => a.status === 'confirmed').length}</p>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <h3 className="text-xs md:text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{appointments.filter(a => a.status === 'pending').length}</p>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border-l-4 border-red-500">
            <h3 className="text-xs md:text-sm font-medium text-gray-500">Cancelled</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{appointments.filter(a => a.status === 'cancelled').length}</p>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment, index) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiUser className="text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                            <div className="text-sm text-gray-500">{appointment.specialization}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.doctorName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FiCalendar className="mr-1 text-gray-500" />
                          {appointment.date}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiClock className="mr-1 text-gray-500" />
                          {appointment.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status === 'confirmed' && <FiCheckCircle className="mr-1 inline" />}
                          {appointment.status === 'pending' && <FiAlertCircle className="mr-1 inline" />}
                          {appointment.status === 'cancelled' && <FiXCircle className="mr-1 inline" />}
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <select
                            className="border text-gray-500 border-gray-300 rounded-md p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                            value={appointment.status}
                            onChange={(e) => handleUpdateStatus(appointment.id, e.target.value)}
                          >
                            <option value="confirmed">Confirm</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                          <button
                            onClick={() => handleDelete(appointment.id)}
                            className="text-red-600 hover:text-red-900 transition-colors p-1"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
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
              <p className="text-gray-500 mt-1">Try adjusting your filters or check back later</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Mobile List View */}
        <div className="md:hidden space-y-3">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleAppointmentExpansion(appointment.id)}
                >
                  <div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <FiUser className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
                        <p className="text-xs text-gray-500">{appointment.doctorName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                    <div className="text-gray-400">
                      {expandedAppointments.includes(appointment.id) ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  </div>
                </div>
                
                {expandedAppointments.includes(appointment.id) && (
                  <div className="p-4 border-t border-gray-100 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Specialization:</span>
                      <span className="text-sm text-gray-900">{appointment.specialization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date:</span>
                      <span className="text-sm text-gray-900 flex items-center">
                        <FiCalendar className="mr-1 text-gray-500" />
                        {appointment.date}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Time:</span>
                      <span className="text-sm text-gray-900 flex items-center">
                        <FiClock className="mr-1 text-gray-500" />
                        {appointment.time}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-gray-500">Status:</span>
                      <select
                        className="border text-gray-500 border-gray-300 rounded-md p-1 text-xs focus:ring-blue-500 focus:border-blue-500"
                        value={appointment.status}
                        onChange={(e) => handleUpdateStatus(appointment.id, e.target.value)}
                      >
                        <option value="confirmed">Confirm</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    </div>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="text-red-600 hover:text-red-900 transition-colors text-sm flex items-center"
                      >
                        <FiTrash2 className="mr-1" />
                        Delete Appointment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-6 text-center bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 mb-4">
                <FiFilter size={36} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No appointments found</h3>
              <p className="text-gray-500 mt-1 text-sm">Try adjusting your filters or check back later</p>
              <button
                onClick={clearFilters}
                className="mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsDashboard;