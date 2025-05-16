'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FiCalendar, 
  FiUser, 
  FiClock, 
  FiFilter, 
  FiCheckCircle, 
  FiXCircle,
  FiChevronDown,
  FiChevronUp,
  FiArrowLeft
} from 'react-icons/fi';
import axios from 'axios';
import Link from 'next/link';

export default function ClinicAppointments() {
  const router = useRouter();
  const params = useParams();
  const clinicId = params?.id;

  const [appointments, setAppointments] = useState([]);
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedAppointments, setExpandedAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });

  // Redirect if no clinicId
  useEffect(() => {
    if (!clinicId) {
      router.push('/admin/appointments');
    }
  }, [clinicId, router]);

  // Fetch clinic and appointments data
  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        // Fetch clinic details
        const clinicRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/allClinicAppointments/clinics/${clinicId}/appointments`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Fetch appointments with filters
        const params = new URLSearchParams();
        if (filterStatus !== 'all') params.append('status', filterStatus);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const appointmentsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/allClinicAppointments/clinics/${clinicId}/filter?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setClinic(clinicRes.data.data.clinic);
        setAppointments(appointmentsRes.data.data.appointments);
        setStats(appointmentsRes.data.data.stats);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
        setAppointments([]);
        setStats({
          total: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0
        });
      } finally {
        setLoading(false);
      }
    };

    if (clinicId) {
      fetchData();
    }
  }, [clinicId, filterStatus, startDate, endDate]);

  const toggleAppointmentExpansion = (id) => {
    setExpandedAppointments(prev => 
      prev.includes(id) 
        ? prev.filter(apptId => apptId !== id) 
        : [...prev, id]
    );
  };

  const clearFilters = () => {
    setFilterStatus('all');
    setStartDate('');
    setEndDate('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirm': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirm': return <FiCheckCircle className="mr-1 inline" />;
      case 'Completed': return <FiCheckCircle className="mr-1 inline" />;
      case 'Cancelled': return <FiXCircle className="mr-1 inline" />;
      default: return null;
    }
  };

  if (!clinicId) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Clinic ID is missing. Redirecting...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Try again
          </button>
          <div className="mt-4">
            <Link href="/admin/appointments" className="text-blue-600 hover:text-blue-800">
              Back to clinics list
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center">
            <Link href="/admin/appointments" className="mr-4 text-blue-600 hover:text-blue-800">
              <FiArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {clinic?.clinicname || 'Clinic'} Appointments
              </h1>
              <p className="text-gray-600 mt-1">
                {clinic?.city && `${clinic.city} • `}
                {clinic?.in_chargename && `${clinic.in_chargename} • `}
                {clinic?.phoneNumber || ''}
              </p>
            </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full p-2 text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Appointments</option>
                  <option value="Confirm">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
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
          {[
            { title: 'Total', value: stats.total, color: 'blue' },
            { title: 'Confirmed', value: stats.confirmed, color: 'blue' },
            { title: 'Completed', value: stats.completed, color: 'green' },
            { title: 'Cancelled', value: stats.cancelled, color: 'red' }
          ].map((stat, index) => (
            <div key={index} className={`bg-white p-3 md:p-4 rounded-xl shadow-sm border-l-4 border-${stat.color}-500`}>
              <h3 className="text-xs md:text-sm font-medium text-gray-500">{stat.title}</h3>
              <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Appointments List */}
        {appointments.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment, index) => (
                    <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiUser className="text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                            <div className="text-sm text-gray-500">
                              {appointment.patientGender}, {appointment.patientAge} yrs
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.doctor?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FiCalendar className="mr-1 text-gray-500" />
                          {appointment.appointmentDate}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiClock className="mr-1 text-gray-500" />
                          {appointment.appointmentTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List */}
            <div className="md:hidden divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="p-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleAppointmentExpansion(appointment._id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <FiUser className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
                        <p className="text-xs text-gray-500">{appointment.doctor?.name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      {expandedAppointments.includes(appointment._id) ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  </div>
                  
                  {expandedAppointments.includes(appointment._id) && (
                    <div className="mt-3 pl-11 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Patient:</span>
                        <span className="text-sm text-gray-900">
                          {appointment.patientGender}, {appointment.patientAge} yrs
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Contact:</span>
                        <span className="text-sm text-gray-900">{appointment.patientContact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Date:</span>
                        <span className="text-sm text-gray-900 flex items-center">
                          <FiCalendar className="mr-1 text-gray-500" />
                          {appointment.appointmentDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Time:</span>
                        <span className="text-sm text-gray-900 flex items-center">
                          <FiClock className="mr-1 text-gray-500" />
                          {appointment.appointmentTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Queue:</span>
                        <span className="text-sm text-gray-900">#{appointment.queueNumber}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FiCalendar size={48} className="mx-auto" />
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
    </div>
  );
}