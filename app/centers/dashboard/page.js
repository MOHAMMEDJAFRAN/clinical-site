'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaCalendarAlt, FaUserMd, FaUserInjured, FaCheckCircle, FaTimesCircle, FaSearch, FaPrint } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import merchantDashboardService from '../services/dashboardService';
import { toast } from 'react-toastify';

const StatusBadge = ({ status }) => {
  const statusMap = useMemo(() => ({
    'confirm': { class: 'bg-green-100 text-green-800', label: 'Confirmed' },
    'completed': { class: 'bg-blue-100 text-blue-800', label: 'Completed' },
    'cancelled': { class: 'bg-red-100 text-red-800', label: 'Cancelled' },
    'pending': { class: 'bg-yellow-100 text-yellow-800', label: 'Pending' }
  }), []);

  const normalizedStatus = status?.toLowerCase();
  const statusInfo = statusMap[normalizedStatus] || statusMap.pending;
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.class}`}>
      {statusInfo.label}
    </span>
  );
};

const AppointmentActions = ({ appointment, onComplete, onCancel, setSelectedAppointment, setShowDetailsModal }) => {
  if (!appointment?.status) return null;

  const status = appointment.status.toLowerCase();

  return (
    <div className="flex space-x-2">
      {status === 'confirm' && (
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
              onCancel(appointment._id);
            }}
            className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
          >
            Cancel
          </button>
        </>
      )}
      {(status === 'completed' || status === 'cancelled') && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedAppointment(appointment);
            setShowDetailsModal(true);
          }}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
          data-testid="view-details-button"
        >
          View Details
        </button>
      )}
    </div>
  );
};

const AppointmentsTable = ({ 
  title, 
  icon, 
  appointments, 
  columns, 
  onRowClick, 
  renderActions, 
  emptyMessage 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          {icon}
          {title}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <div className="relative max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr 
                    key={appointment._id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onRowClick?.(appointment)}
                    data-testid="appointment-row"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <FaUserInjured />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                          <div className="text-sm text-gray-500">#{appointment.queueNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.doctor?.name || 'N/A'}</div>
                    </td>
                    {columns.includes('Shift Time') && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.appointmentTime || 'N/A'}</div>
                      </td>
                    )}
                    {columns.includes('Date') && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={appointment.status} />
                    </td>
                    {renderActions && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderActions(appointment)}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                    {emptyMessage}
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

const PatientModal = ({ 
  appointment, 
  onClose, 
  consultationFee, 
  setConsultationFee, 
  medicationFee, 
  setMedicationFee, 
  onComplete
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Payment Details</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-800 font-semibold">Patient Name</p>
              <p className="font-extralight text-sm text-gray-500">{appointment.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-800 font-semibold">Age</p>
              <p className="font-extralight text-sm text-gray-500">{appointment.patientAge || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-800 font-semibold">Gender</p>
              <p className="font-extralight text-sm text-gray-500">{appointment.patientGender || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-800 font-semibold">Phone</p>
              <p className="font-extralight text-sm text-gray-500">{appointment.patientContact || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-800 font-semibold">Doctor</p>
              <p className="font-extralight text-sm text-gray-500">{appointment.doctor?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-800 font-semibold">Appointment Time</p>
              <p className="font-extralight text-sm text-gray-500">{appointment.appointmentTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-800 font-semibold">Status</p>
              <p className="font-medium">
                <StatusBadge status={appointment.status} />
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (Rs.)</label>
              <input
                type="number"
                className="w-full px-3 text-gray-500 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                value={consultationFee}
                onChange={(e) => setConsultationFee(parseFloat(e.target.value) || 0)}
                min="0"
                data-testid="consultation-fee-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medication Fee (Rs.)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                value={medicationFee}
                onChange={(e) => setMedicationFee(parseFloat(e.target.value) || 0)}
                min="0"
                data-testid="medication-fee-input"
              />
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700">
                Total Fee: <span className="text-lg font-bold text-blue-600">
                  Rs. {(consultationFee + medicationFee).toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            data-testid="cancel-payment-button"
          >
            Cancel
          </button>
          <button
            onClick={onComplete}
            disabled={consultationFee <= 0}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 ${
              consultationFee <= 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            data-testid="complete-appointment-button"
          >
            Complete Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailsModal = ({ appointment, onClose }) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Appointment Details</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold text-gray-800">Patient Name</p>
              <p className="font-light text-sm text-gray-500">{appointment.patientName}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Doctor</p>
              <p className="font-light text-sm text-gray-500">{appointment.doctor?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Appointment Date</p>
              <p className="font-light text-sm text-gray-500">
                {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Appointment Time</p>
              <p className="font-light text-sm text-gray-500">{appointment.appointmentTime}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Status</p>
              <p className="font-medium">
                <StatusBadge status={appointment.status} />
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ReceiptModal = ({ receiptData, clinic, onClose }) => {
  const totalAmount = receiptData.totalAmount || 
                     (receiptData.consultationFee || 0) + (receiptData.medicationFee || 0);

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Receipt - ${receiptData.referenceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .clinic-name { font-size: 18px; font-weight: bold; }
            .receipt-title { margin: 15px 0; font-size: 16px; }
            .details { margin-bottom: 20px; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total { font-weight: bold; margin-top: 10px; }
            @media print { 
              body { -webkit-print-color-adjust: exact; } 
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="clinic-name">${clinic?.name || 'Medical Clinic'}</div>
            <div>${clinic?.address || ''}</div>
            <div>Tel: ${clinic?.phoneNumber || ''}</div>
            <div class="receipt-title">Payment Receipt</div>
          </div>
          <div class="details">
            <div class="detail-row">
              <span>Receipt #:</span>
              <span>${receiptData.referenceNumber}</span>
            </div>
            <div class="detail-row">
              <span>Date:</span>
              <span>${new Date(receiptData.paymentDate).toLocaleString()}</span>
            </div>
            <div class="detail-row">
              <span>Patient:</span>
              <span>${receiptData.patientName}</span>
            </div>
            <div class="detail-row">
              <span>Doctor:</span>
              <span>${receiptData.doctor?.name || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span>Status:</span>
              <span>Completed</span>
            </div>
          </div>
          <div class="details">
            <div class="detail-row">
              <span>Consultation Fee:</span>
              <span>Rs. ${(receiptData.consultationFee || 0).toFixed(2)}</span>
            </div>
            <div class="detail-row">
              <span>Medication Fee:</span>
              <span>Rs. ${(receiptData.medicationFee || 0).toFixed(2)}</span>
            </div>
          </div>
          <div class="total">
            <div class="detail-row">
              <span>Total:</span>
              <span>Rs. ${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 200);
            }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Payment Receipt</h3>
        </div>
        <div className="p-6">
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold text-gray-800">{clinic?.name}</h4>
            <p className="text-sm text-gray-500">{clinic?.address}</p>
            <p className="text-sm text-gray-500">Tel: {clinic?.phoneNumber}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Receipt #</p>
              <p className="text-sm font-medium">{receiptData.referenceNumber}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-sm font-medium">
                {new Date(receiptData.paymentDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Patient</p>
              <p className="text-sm font-medium">{receiptData.patientName}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Doctor</p>
              <p className="text-sm font-medium">{receiptData.doctor?.name || 'N/A'}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-sm font-medium">
                <StatusBadge status={receiptData.status} />
              </p>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-4 my-4">
            <div className="flex justify-between mb-2">
              <p className="text-sm">Consultation Fee</p>
              <p className="text-sm font-medium">
                Rs. {(receiptData.consultationFee || 0).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">Medication Fee</p>
              <p className="text-sm font-medium">
                Rs. {(receiptData.medicationFee || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">Total</p>
            <p className="text-2xl font-bold text-blue-600">
              Rs. {totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
          >
            <FaPrint className="mr-2" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

const ClinicalCenterDashboard = () => {
  const router = useRouter();
  const [currentClinic, setCurrentClinic] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [consultationFee, setConsultationFee] = useState(0);
  const [medicationFee, setMedicationFee] = useState(0);
  const [stats, setStats] = useState({
    todayCount: 0,
    doctorsCount: 0,
    completedCount: 0,
    cancelledCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const getClinicData = useCallback(() => {
    try {
      const profileData = localStorage.getItem('profileData');
      if (!profileData) {
        toast.error('No clinic data found');
        return null;
      }
      
      const parsedData = JSON.parse(profileData);
      const clinicData = {
        id: parsedData.id || parsedData._id,
        name: parsedData.clinicName || parsedData.clinicname,
        address: parsedData.address,
        city: parsedData.city,
        phoneNumber: parsedData.phoneNumber,
        isApproved: parsedData.isApproved || parsedData.status === 'Approved'
      };

      localStorage.setItem('clinicId', clinicData.id);
      return clinicData;
    } catch (err) {
      console.error('Error parsing clinic data:', err);
      toast.error('Error loading clinic data');
      return null;
    }
  }, []);

  useEffect(() => {
    const clinicData = getClinicData();
    
    if (!clinicData) {
      router.push('/login');
      return;
    }

    if (!clinicData.isApproved) {
      router.push('/pending-approval');
      return;
    }

    setCurrentClinic(clinicData);
    setAuthChecked(true);
  }, [router, getClinicData]);

  useEffect(() => {
    if (!authChecked) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await merchantDashboardService.getDashboardData();
        
        if (!data) {
          throw new Error('No data received');
        }

        const transformAppointments = (appointments) => {
          return appointments?.map(app => ({
            ...app,
            status: app.status || 'pending',
            doctor: { name: app.doctor?.name || app.doctorName || 'N/A' },
            shiftTime: app.shiftTime?.timeRange || 'N/A'
          })) || [];
        };

        setTodayAppointments(transformAppointments(data.todayAppointments));
        setUpcomingAppointments(transformAppointments(data.upcomingAppointments));
        
        setStats({
          todayCount: data.todayAppointments?.length || 0,
          doctorsCount: data.doctorsCount || 0,
          completedCount: data.completedCount || 0,
          cancelledCount: data.cancelledCount || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        
        if (error.response?.status === 404) {
          toast.error('Dashboard endpoint not found. Please contact support.');
        } else if (error.response?.status === 401) {
          toast.error('Session expired. Please login again');
          localStorage.removeItem('profileData');
          localStorage.removeItem('clinicId');
          router.push('/login');
        } else {
          toast.error('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authChecked, router]);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const response = await merchantDashboardService.updateAppointmentStatus(appointmentId, status);
      
      setTodayAppointments(prev => 
        prev.map(app => 
          app._id === appointmentId ? { 
            ...app, 
            status: response.appointment.status || status.toLowerCase(),
            payment: status.toLowerCase() === 'completed' ? response.appointment.payment : app.payment
          } : app
        )
      );
      
      toast.success(`Appointment ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error(`Failed to ${status.toLowerCase()} appointment`);
    }
  };

  const handleCompleteAppointment = async () => {
    if (consultationFee <= 0) {
      toast.error('Please enter a valid consultation fee');
      return;
    }

    try {
      const response = await merchantDashboardService.createPayment(
        selectedAppointment._id,
        {
          consultationFee: Number(consultationFee),
          medicationFee: Number(medicationFee),
          paymentMethod: 'Cash'
        }
      );

      if (!response.success) {
        throw new Error(response.message || 'Payment creation failed');
      }

      // Update local state with the new payment data
      setTodayAppointments(prev => 
        prev.map(app => 
          app._id === selectedAppointment._id ? { 
            ...app, 
            status: 'completed',
            payment: response.payment
          } : app
        )
      );

      // Prepare receipt data
      setReceiptData({
        ...response.payment,
        patientName: selectedAppointment.patientName,
        doctor: selectedAppointment.doctor,
        status: 'completed',
        paymentDate: new Date(),
        referenceNumber: response.payment.receiptNumber || `PAY-${Date.now().toString().slice(-8)}`,
        totalAmount: response.payment.consultationFee + response.payment.medicationFee
      });

      // Reset form and show receipt
      setShowPatientModal(false);
      setShowReceiptModal(true);
      setConsultationFee(0);
      setMedicationFee(0);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        completedCount: prev.completedCount + 1
      }));

      toast.success('Appointment completed successfully');
    } catch (error) {
      console.error('Error completing appointment:', {
        error: error.message,
        appointmentId: selectedAppointment?._id,
        fees: { consultationFee, medicationFee }
      });
      
      toast.error(error.message || 'Failed to complete appointment');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await handleStatusUpdate(appointmentId, 'Cancelled');
      setStats(prev => ({
        ...prev,
        cancelledCount: prev.cancelledCount + 1
      }));
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const filteredTodayAppointments = useMemo(() => 
    todayAppointments.filter(app => 
      app.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.doctor?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [todayAppointments, searchQuery]
  );

  const filteredUpcomingAppointments = useMemo(() =>
    upcomingAppointments.filter(app => 
      app.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.doctor?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [upcomingAppointments, searchQuery]
  );

  const formatTime = useCallback((timeString) => {
    if (!timeString) return 'N/A';
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }, []);

  if (!authChecked || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clinic Dashboard</h1>
          {currentClinic && (
            <p className="text-gray-600">
              {currentClinic.name} • {currentClinic.city} • {currentClinic.phoneNumber}
            </p>
          )}
        </div>
        <div className="mt-4 md:mt-0 flex flex-col items-end">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              {formatDate(new Date())}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <FaCalendarAlt className="text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Today Appointments</p>
            <p className="text-2xl font-bold text-gray-800">{stats.todayCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <FaUserMd className="text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Doctors</p>
            <p className="text-2xl font-bold text-gray-800">{stats.doctorsCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <FaCheckCircle className="text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Completed Today</p>
            <p className="text-2xl font-bold text-gray-800">{stats.completedCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <FaTimesCircle className="text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Cancelled Today</p>
            <p className="text-2xl font-bold text-gray-800">{stats.cancelledCount}</p>
          </div>
        </div>
      </div>

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
            aria-label="Search appointments"
            data-testid="search-input"
          />
        </div>
      </div>

      <AppointmentsTable
        title="Today Appointments"
        icon={<FiClock className="mr-2 text-blue-600" />}
        appointments={filteredTodayAppointments}
        columns={['Patient', 'Doctor', 'Shift Time', 'Status', 'Actions']}
        onRowClick={(appointment) => {
          setSelectedAppointment(appointment);
          setShowPatientModal(true);
        }}
        renderActions={(appointment) => (
          <AppointmentActions
            appointment={appointment}
            onComplete={(app) => {
              setSelectedAppointment(app);
              setShowPatientModal(true);
            }}
            onCancel={handleCancelAppointment}
            setSelectedAppointment={setSelectedAppointment}
            setShowDetailsModal={setShowDetailsModal}
          />
        )}
        emptyMessage="No appointments found for today"
      />

      <AppointmentsTable
        title="Upcoming Appointments"
        icon={<FaCalendarAlt className="mr-2 text-blue-600" />}
        appointments={filteredUpcomingAppointments}
        columns={['Patient', 'Doctor', 'Shift Time', 'Date', 'Status']}
        emptyMessage="No upcoming appointments found"
      />

      {showPatientModal && selectedAppointment && (
        <PatientModal
          appointment={selectedAppointment}
          onClose={() => setShowPatientModal(false)}
          consultationFee={consultationFee}
          setConsultationFee={setConsultationFee}
          medicationFee={medicationFee}
          setMedicationFee={setMedicationFee}
          onComplete={handleCompleteAppointment}
        />
      )}

      {showDetailsModal && selectedAppointment && (
        <DetailsModal
          appointment={selectedAppointment}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showReceiptModal && receiptData && (
        <ReceiptModal
          receiptData={receiptData}
          clinic={currentClinic}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};

export default ClinicalCenterDashboard;