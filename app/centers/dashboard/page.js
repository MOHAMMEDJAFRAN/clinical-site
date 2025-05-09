'use client';

import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUserMd, FaUserInjured, FaCheckCircle, FaTimesCircle, FaSearch, FaPrint } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
// import { useAuth } from '@/hooks/useAuth';


const ClinicalCenterDashboard = () => {
  // useAuth('merchant');
  const todayDate = new Date().toISOString().split('T')[0];
  const [currentClinic, setCurrentClinic] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data initialization
  useEffect(() => {
    const sampleClinic = {
      id: 1, 
      name: 'Royal Medical Center', 
      location: 'Colombo', 
      status: 'Active',
      contact: '011-2234567',
      openHours: '8:00 AM - 8:00 PM'
    };
    
    setCurrentClinic(sampleClinic);

    // Today's appointments
    const sampleTodayAppointments = [
      { 
        id: 1, 
        patientName: 'Rahul Sharma', 
        doctorName: 'Dr. Vivek Sharma', 
        date: todayDate, 
        time: '08:00 AM', 
        status: 'confirmed',
        gender: 'Male',
        phone: '9876543210',
        queue: 'A001',
        age: 32
      },
      { 
        id: 2, 
        patientName: 'Priya Patel', 
        doctorName: 'Dr. Perera', 
        date: todayDate, 
        time: '09:30 AM', 
        status: 'confirmed',
        gender: 'Female',
        phone: '8765432109',
        queue: 'A002',
        age: 28
      },
      { 
        id: 3, 
        patientName: 'Deepak Verma', 
        doctorName: 'Dr. Fernando', 
        date: todayDate, 
        time: '10:15 AM', 
        status: 'confirmed',
        gender: 'Male',
        phone: '7654321098',
        queue: 'A003',
        age: 45
      },
      { 
        id: 4, 
        patientName: 'Anita Singh', 
        doctorName: 'Dr. Gunawardena', 
        date: todayDate, 
        time: '11:00 AM', 
        status: 'confirmed',
        gender: 'Female',
        phone: '6543210987',
        queue: 'A004',
        age: 39
      },
      { 
        id: 5, 
        patientName: 'Vikram Malhotra', 
        doctorName: 'Dr. Vivek Sharma', 
        date: todayDate, 
        time: '02:00 PM', 
        status: 'confirmed',
        gender: 'Male',
        phone: '5432109876',
        queue: 'A005',
        age: 52
      },
      { 
        id: 6, 
        patientName: 'Sunita Reddy', 
        doctorName: 'Dr. Perera', 
        date: todayDate, 
        time: '03:30 PM', 
        status: 'confirmed',
        gender: 'Female',
        phone: '4321098765',
        queue: 'A006',
        age: 41
      },
      { 
        id: 7, 
        patientName: 'Rajesh Kumar', 
        doctorName: 'Dr. Fernando', 
        date: todayDate, 
        time: '04:15 PM', 
        status: 'confirmed',
        gender: 'Male',
        phone: '3210987654',
        queue: 'A007',
        age: 35
      }
    ];

    // Upcoming appointments
    const sampleUpcomingAppointments = [
      { 
        id: 8, 
        patientName: 'Maya Jayasuriya', 
        doctorName: 'Dr. Perera', 
        date: '2023-12-15', 
        time: '10:30 AM', 
        status: 'confirmed',
        gender: 'Female',
        phone: '7123456789',
        queue: 'B001',
        age: 29
      },
      { 
        id: 9, 
        patientName: 'Harsha Fernando', 
        doctorName: 'Dr. Gunawardena', 
        date: '2023-12-15', 
        time: '02:00 PM', 
        status: 'confirmed',
        gender: 'Male',
        phone: '7234567890',
        queue: 'B002',
        age: 42
      },
      { 
        id: 10, 
        patientName: 'Nimal Perera', 
        doctorName: 'Dr. Vivek Sharma', 
        date: '2023-12-16', 
        time: '09:00 AM', 
        status: 'confirmed',
        gender: 'Male',
        phone: '7345678901',
        queue: 'C001',
        age: 58
      },
      { 
        id: 11, 
        patientName: 'Kumari Silva', 
        doctorName: 'Dr. Fernando', 
        date: '2023-12-16', 
        time: '11:30 AM', 
        status: 'confirmed',
        gender: 'Female',
        phone: '7456789012',
        queue: 'C002',
        age: 35
      },
      { 
        id: 12, 
        patientName: 'Rajiv Patel', 
        doctorName: 'Dr. Perera', 
        date: '2023-12-17', 
        time: '10:00 AM', 
        status: 'confirmed',
        gender: 'Male',
        phone: '7567890123',
        queue: 'D001',
        age: 47
      },
      { 
        id: 13, 
        patientName: 'Lakshmi Devi', 
        doctorName: 'Dr. Gunawardena', 
        date: '2023-12-17', 
        time: '02:30 PM', 
        status: 'confirmed',
        gender: 'Female',
        phone: '7678901234',
        queue: 'D002',
        age: 61
      },
      { 
        id: 14, 
        patientName: 'Amal Jayasinghe', 
        doctorName: 'Dr. Fernando', 
        date: '2023-12-18', 
        time: '09:30 AM', 
        status: 'confirmed',
        gender: 'Male',
        phone: '7789012345',
        queue: 'E001',
        age: 33
      }
    ];

    setTodayAppointments(sampleTodayAppointments);
    setUpcomingAppointments(sampleUpcomingAppointments);
  }, [todayDate]);

  // Filter appointments based on search query
  const filteredTodayAppointments = todayAppointments.filter(app => 
    app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUpcomingAppointments = upcomingAppointments.filter(app => 
    app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status badge component
  const StatusBadge = ({ status }) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
    
    switch(status) {
      case 'confirmed':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Confirmed</span>;
      case 'completed':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Completed</span>;
      case 'cancelled':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</span>;
      default:
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
    }
  };

  // Action buttons for appointments
  const AppointmentActions = ({ appointment, onComplete, onCancel }) => {
    return (
      <div className="flex space-x-2">
        {appointment.status === 'confirmed' && (
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onComplete(appointment);
              }}
              className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
            >
              Complete
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onCancel(appointment.id);
              }}
              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
            >
              Cancel
            </button>
          </>
        )}
        {appointment.status === 'completed' && (
          <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition">
            View Details
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clinic Dashboard</h1>
          {currentClinic && (
            <p className="text-gray-600">
              {currentClinic.name} • {currentClinic.location} • {currentClinic.contact}
            </p>
          )}
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          {currentClinic && (
            <p className="text-sm text-gray-500">
              Open: {currentClinic.openHours}
            </p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <FaCalendarAlt className="text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Today Appointments</p>
            <p className="text-2xl font-bold text-gray-800">{filteredTodayAppointments.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <FaUserMd className="text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Doctors</p>
            <p className="text-2xl font-bold text-gray-800">12</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <FaCheckCircle className="text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Completed Today</p>
            <p className="text-2xl font-bold text-gray-800">
              {todayAppointments.filter(a => a.status === 'completed').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <FaTimesCircle className="text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Cancelled Today</p>
            <p className="text-2xl font-bold text-gray-800">
              {todayAppointments.filter(a => a.status === 'cancelled').length}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search patients or doctors..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Today's Appointments with Scrollable Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FiClock className="mr-2 text-blue-600" />
            Today Appointments
          </h2>
        </div>
        <div className="overflow-x-auto">
          <div className="relative max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTodayAppointments.map((appointment) => (
                  <tr 
                    key={appointment.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setShowPatientModal(true);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <FaUserInjured />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                          <div className="text-sm text-gray-500">#{appointment.queue}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.doctorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={appointment.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <AppointmentActions
                        appointment={appointment}
                        onComplete={(app) => {
                          setSelectedAppointment(app);
                          setShowPatientModal(true);
                        }}
                        onCancel={(id) => {
                          setTodayAppointments(todayAppointments.map(a => 
                            a.id === id ? {...a, status: 'cancelled'} : a
                          ));
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments with Scrollable Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-600" />
            Upcoming Appointments
          </h2>
        </div>
        <div className="overflow-x-auto">
          <div className="relative max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUpcomingAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <FaUserInjured />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                          <div className="text-sm text-gray-500">#{appointment.queue}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.doctorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={appointment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Patient Details Modal */}
      {showPatientModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Patient Details</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-medium">{selectedAppointment.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{selectedAppointment.age}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{selectedAppointment.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedAppointment.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium">{selectedAppointment.doctorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Appointment Time</p>
                  <p className="font-medium">{selectedAppointment.time}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (Rs.)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medication Fee (Rs.)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Total Fee: <span className="text-lg font-bold text-blue-600">Rs. 0.00</span></p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowPatientModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPatientModal(false);
                  setShowReceiptModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Complete Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 text-center">Payment Receipt</h3>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-gray-800">Royal Medical Center</h4>
                <p className="text-sm text-gray-500">123 Medical Street, Colombo</p>
                <p className="text-sm text-gray-500">Tel: 011-2234567</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Receipt #</p>
                  <p className="text-sm font-medium">RC-2023-001</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Patient</p>
                  <p className="text-sm font-medium">{selectedAppointment.patientName}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="text-sm font-medium">{selectedAppointment.doctorName}</p>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4 my-4">
                <div className="flex justify-between mb-2">
                  <p className="text-sm">Consultation Fee</p>
                  <p className="text-sm font-medium">Rs. 1,500.00</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">Medication Fee</p>
                  <p className="text-sm font-medium">Rs. 850.00</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">Total</p>
                <p className="text-2xl font-bold text-blue-600">Rs. 2,350.00</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
              >
                <FaPrint className="mr-2" />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom scrollbar styling */}
      <style jsx>{`
        /* Custom scrollbar for WebKit browsers */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default ClinicalCenterDashboard;