'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaCalendarAlt, FaUserInjured, FaCheckCircle, FaSpinner, FaTimesCircle, FaSearch, FaPrint } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import merchantDashboardService from '../services/dashboardService';
import { toast } from 'react-toastify';

// StatusBadge component
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

// ConfirmationModal component
const ConfirmationModal = ({ 
  message, 
  onConfirm, 
  onCancel,
  confirmText = 'Yes',
  cancelText = 'No'
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <p className="text-gray-800 mb-6 text-center">{message}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// AppointmentActions component
const AppointmentActions = ({ 
  appointment, 
  onComplete, 
  onCancel, 
  setSelectedAppointment, 
  setShowDetailsModal,
  setShowPatientModal, // Add this prop
  isLoading 
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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
            className={`px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Complete'}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowCancelConfirm(true);
            }}
            className={`px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
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

      {showCancelConfirm && (
        <ConfirmationModal
          message="Are you sure you want to cancel this appointment?"
          onConfirm={() => {
            onCancel(appointment._id);
            setShowCancelConfirm(false);
            setShowPatientModal(false); // Close patient modal if open
          }}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}
    </div>
  );
};

// AppointmentsTable component
const AppointmentsTable = ({ 
  title, 
  icon, 
  appointments, 
  columns, 
  onRowClick, 
  renderActions, 
  emptyMessage,
  isLoading = false
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          {icon}
          {title}
        </h2>
        {isLoading && (
          <span className="text-sm text-gray-500">Loading...</span>
        )}
      </div>
      <div className="overflow-x-auto">
        <div className="relative max-h-96 overflow-y-auto">
          {isLoading && appointments.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Loading appointments...</div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

// PatientModal component
const PatientModal = ({ 
  appointment, 
  onClose, 
  consultationFee, 
  setConsultationFee, 
  medicationFee, 
  setMedicationFee, 
  onComplete,
  isLoading = false
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
                value={consultationFee || ''}
                onChange={(e) => setConsultationFee(parseFloat(e.target.value) || '')}
                min="0"
                data-testid="consultation-fee-input"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medication Fee (Rs.)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                value={medicationFee || ''}
                onChange={(e) => setMedicationFee(parseFloat(e.target.value)) || ''}
                min="0"
                data-testid="medication-fee-input"
                disabled={isLoading}
              />
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700">
                Total Fee: <span className="text-lg font-bold text-blue-600">
                  Rs. {((consultationFee || 0) + (medicationFee || 0)).toFixed(2)}
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
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onComplete}
            disabled={!consultationFee || isLoading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 ${
              !consultationFee || isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            data-testid="complete-appointment-button"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Complete Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
};

// DetailsModal component
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

// ReceiptModal component with improved design
const ReceiptModal = ({ receiptData, clinic, onClose }) => {
  const totalAmount = receiptData.totalAmount || 
                     (receiptData.consultationFee || 0) + (receiptData.medicationFee || 0);

  const handlePrint = useCallback(() => {
    const printContent = `
      <html>
        <head>
          <title>Receipt - ${receiptData.referenceNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
            
            body { 
              font-family: 'Roboto', sans-serif; 
              margin: 0;
              padding: 20px;
              color: #333;
            }
            
            .receipt-container {
              max-width: 400px;
              margin: 0 auto;
              border: 1px solid #eee;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0,0,0,0.05);
            }
            
            .header { 
              text-align: center; 
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 1px dashed #ddd;
            }
            
            .clinic-name { 
              font-size: 20px; 
              font-weight: 700;
              color: #1a365d;
              margin-bottom: 5px;
            }
            
            .clinic-info {
              font-size: 12px;
              color: #666;
              margin-bottom: 5px;
            }
            
            .receipt-title { 
              margin: 15px 0; 
              font-size: 18px;
              font-weight: 600;
              color: #2d3748;
            }
            
            .receipt-details {
              margin-bottom: 20px;
            }
            
            .detail-row { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 8px;
              font-size: 14px;
            }
            
            .detail-label {
              font-weight: 500;
              color: #4a5568;
            }
            
            .detail-value {
              font-weight: 400;
              color: #2d3748;
            }
            
            .amounts-section {
              margin: 20px 0;
              padding: 15px 0;
              border-top: 1px dashed #ddd;
              border-bottom: 1px dashed #ddd;
            }
            
            .amount-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            
            .total-section {
              margin-top: 20px;
              padding-top: 10px;
              border-top: 2px solid #2d3748;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              font-size: 16px;
              font-weight: 700;
            }
            
            .thank-you {
              text-align: center;
              margin-top: 20px;
              font-style: italic;
              color: #4a5568;
              font-size: 14px;
            }
            
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #718096;
            }
            
            @media print { 
              body { 
                -webkit-print-color-adjust: exact;
                padding: 0;
              }
              
              .receipt-container {
                box-shadow: none;
                border: none;
                padding: 10px;
              }
              
              button { 
                display: none; 
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <div class="clinic-name">${clinic?.clinicName || 'Medical Clinic'}</div>
              <div class="clinic-info">${clinic?.address || ''}</div>
              <div class="clinic-info">Tel: ${clinic?.phoneNumber || 'N/A'}</div>
              <div class="receipt-title">PAYMENT RECEIPT</div>
            </div>
            
            <div class="receipt-details">
              <div class="detail-row">
                <span class="detail-label">Receipt No:</span>
                <span class="detail-value">${receiptData.referenceNumber}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${new Date(receiptData.paymentDate).toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Patient:</span>
                <span class="detail-value">${receiptData.patientName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Doctor:</span>
                <span class="detail-value">${receiptData.doctor?.name || 'N/A'}</span>
              </div>
            </div>
            
            <div class="amounts-section">
              <div class="amount-row">
                <span class="detail-label">Consultation Fee:</span>
                <span class="detail-value">Rs. ${(receiptData.consultationFee || 0).toFixed(2)}</span>
              </div>
              <div class="amount-row">
                <span class="detail-label">Medication Fee:</span>
                <span class="detail-value">Rs. ${(receiptData.medicationFee || 0).toFixed(2)}</span>
              </div>
            </div>
            
            <div class="total-section">
              <div class="total-row">
                <span>TOTAL:</span>
                <span>Rs. ${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div class="thank-you">
              Thank you for your visit!
            </div>
            
            <div class="footer">
              This is a computer generated receipt
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiptData, clinic]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Payment Receipt</h3>
        </div>
        <div className="p-6">
          <div className="text-center mb-6">
            <h4 className="text-md font-bold text-gray-800">{clinic?.clinicName}</h4>
            <p className="text-sm text-gray-500">{clinic?.address}</p>
            <p className="text-sm text-gray-500">Tel: {clinic?.phoneNumber || 'N/A'}</p>
            <div className="my-3 border-t border-gray-200 pt-3">
              <p className="text-md font-semibold text-gray-700">PAYMENT RECEIPT</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <p className="text-sm font-medium text-gray-700">Receipt No:</p>
              <p className="text-sm text-gray-600">{receiptData.referenceNumber}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-medium text-gray-700">Date:</p>
              <p className="text-sm text-gray-600">
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
              <p className="text-sm font-medium text-gray-700">Patient:</p>
              <p className="text-sm text-gray-600">{receiptData.patientName}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-medium text-gray-700">Doctor:</p>
              <p className="text-sm text-gray-600">{receiptData.doctor?.name || 'N/A'}</p>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-4 my-4">
            <div className="flex justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">Consultation Fee</p>
              <p className="text-sm text-gray-600">
                Rs. {(receiptData.consultationFee || 0).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-medium text-gray-700">Medication Fee</p>
              <p className="text-sm text-gray-600">
                Rs. {(receiptData.medicationFee || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="border-t-2 border-gray-300 pt-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-gray-800">TOTAL</p>
              <p className="text-xl font-bold text-blue-700">
                Rs. {totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="text-center mt-6 italic text-gray-500 text-sm">
            Thank you for your visit!
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

// Main ClinicalCenterDashboard component
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
  const [consultationFee, setConsultationFee] = useState(null);
  const [medicationFee, setMedicationFee] = useState(null);
  const [stats, setStats] = useState({
    todayCount: 0,
    doctorsCount: 0,
    completedCount: 0,
    cancelledCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Memoized clinic data retrieval
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

  // Check authentication and clinic approval status
  useEffect(() => {
    const clinicData = getClinicData();
    
    if (!clinicData) {
      router.push('/login');
      return;
    }

    if (!clinicData.isApproved) {
      router.push('/login');
      return;
    }

    setCurrentClinic(clinicData);
    setAuthChecked(true);
  }, [router, getClinicData]);

  // Fetch dashboard data when authenticated
  useEffect(() => {
    if (!authChecked) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await merchantDashboardService.getDashboardData();
        
        if (!data) {
          throw new Error('No data received');
        }

        setCurrentClinic(data.clinic);

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

  // Handle appointment completion and payment
  const handleCompleteAppointment = async () => {
    if (!consultationFee) {
      toast.error('Please enter a valid consultation fee');
      return;
    }
  
    try {
      setIsProcessing(true);
      
      // Create payment
      const paymentResponse = await merchantDashboardService.createPayment(
        selectedAppointment._id,
        {
          consultationFee: Number(consultationFee),
          medicationFee: Number(medicationFee || 0),
          paymentMethod: 'Cash'
        }
      );

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message || 'Payment creation failed');
      }

      if (!paymentResponse.payment) {
        throw new Error('Payment data not received from server');
      }

      // Use the payment data directly from the createPayment response
      const paymentDetails = paymentResponse.payment;
      
      // Prepare receipt data
      const receiptData = {
        ...paymentDetails,
        patientName: selectedAppointment.patientName,
        doctor: selectedAppointment.doctor,
        status: 'completed',
        paymentDate: paymentDetails.createdAt || new Date(),
        totalAmount: paymentDetails.totalAmount || 
                   (paymentDetails.consultationFee + (paymentDetails.medicationFee || 0))
      };

      // Update local state
      setTodayAppointments(prev => 
        prev.map(app => 
          app._id === selectedAppointment._id ? { 
            ...app, 
            status: 'completed',
            payment: paymentDetails
          } : app
        )
      );

      // Show receipt
      setReceiptData(receiptData);
      setShowPatientModal(false);
      setShowReceiptModal(true);
      
      // Reset form
      setConsultationFee(null);
      setMedicationFee(null);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        completedCount: prev.completedCount + 1
      }));

      toast.success('Appointment completed and payment recorded successfully');
    } catch (error) {
      console.error('Error completing appointment:', {
        error: error.message,
        details: error.details,
        status: error.status,
        appointmentId: selectedAppointment?._id,
        fees: { consultationFee, medicationFee }
      });
      
      toast.error(error.message || 'Failed to complete appointment');
      
      if (error.details) {
        Object.values(error.details).forEach(detail => {
          toast.error(detail);
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle canceling an appointment
  const handleCancelAppointment = async (appointmentId) => {
    try {
      setIsProcessing(true);
      await merchantDashboardService.updateAppointmentStatus(appointmentId, 'Cancelled');
      
      setTodayAppointments(prev => 
        prev.map(app => 
          app._id === appointmentId ? { ...app, status: 'cancelled' } : app
        )
      );
      
      setStats(prev => ({
        ...prev,
        cancelledCount: prev.cancelledCount + 1
      }));
      
      toast.success('Appointment cancelled successfully');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.message || 'Failed to cancel appointment');
    } finally {
      setIsProcessing(false);
      setShowPatientModal(false); // Ensure patient modal is closed
    }
  };

  // Filter appointments based on search query
  const filteredTodayAppointments = useMemo(() => 
    todayAppointments.filter(app => 
      app.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.doctor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.queueNumber?.toString().includes(searchQuery)
    ), [todayAppointments, searchQuery]
  );

  const filteredUpcomingAppointments = useMemo(() =>
    upcomingAppointments.filter(app => 
      app.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.doctor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.queueNumber?.toString().includes(searchQuery)
    ), [upcomingAppointments, searchQuery]
  );

  // Format date for display
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

  // Loading state
  if (!authChecked || loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
                          <div className="flex flex-col items-center">
                            <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
                            <p className="text-gray-600">Loading dashboard...</p>
                          </div>
                        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-800">Clinic Dashboard</h1> */}
          {currentClinic  && (
            <div className="text-gray-600">
              <h1 className="text-2xl font-bold text-gray-800">{currentClinic.clinicName} • {currentClinic.city} </h1>
              <p>{currentClinic.address}</p>
              <p>{currentClinic.phoneNumber}</p>
            </div>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search patients, doctors, or queue numbers..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search appointments"
            data-testid="search-input"
          />
        </div>
      </div>

      {/* Today's Appointments Table */}
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
            setShowPatientModal={setShowPatientModal} // Add this
            isLoading={isProcessing}
          />
        )}
        emptyMessage="No appointments found for today"
        isLoading={loading}
      />

      {/* Upcoming Appointments Table */}
      <AppointmentsTable
        title="Upcoming Appointments"
        icon={<FaCalendarAlt className="mr-2 text-blue-600" />}
        appointments={filteredUpcomingAppointments}
        columns={['Patient', 'Doctor', 'Shift Time', 'Date', 'Status']}
        emptyMessage="No upcoming appointments found"
        isLoading={loading}
      />

      {/* Modals */}
      {showPatientModal && selectedAppointment && (
        <PatientModal
          appointment={selectedAppointment}
          onClose={() => setShowPatientModal(false)}
          consultationFee={consultationFee}
          setConsultationFee={setConsultationFee}
          medicationFee={medicationFee}
          setMedicationFee={setMedicationFee}
          onComplete={handleCompleteAppointment}
          isLoading={isProcessing}
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