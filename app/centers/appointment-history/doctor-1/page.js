'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header';

const AppointmentsDashboard = () => {
  const todayDate = new Date().toISOString().split('T')[0];
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [consultationFee, setConsultationFee] = useState('');
  const [drugFee, setDrugFee] = useState('');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const doctorName = "Dr. Vivek Sharma"; // Single doctor for all appointments

  // References for input fields to maintain focus
  const consultationFeeRef = useRef(null);
  const drugFeeRef = useRef(null);

  useEffect(() => {
    // This could be replaced with an API call to fetch actual appointments
    const sampleData = [
      { 
        id: 1, 
        patientName: 'Rahul Sharma', 
        doctorName: doctorName, 
        date: todayDate, // Today's appointment
        time: '09:30 AM', 
        status: 'confirmed',
        gender: 'Male',
        phoneNumber: '9876543210',
        queueNumber: 'A001'
      },
      { 
        id: 2, 
        patientName: 'Priya Patel', 
        doctorName: doctorName, 
        date: todayDate, // Today's appointment
        time: '11:00 AM', 
        status: 'confirmed',
        gender: 'Female',
        phoneNumber: '8765432109',
        queueNumber: 'A002'
      },
      { 
        id: 3, 
        patientName: 'Deepak Verma', 
        doctorName: doctorName, 
        date: todayDate, // Today's appointment
        time: '04:15 PM', 
        status: 'pending',
        gender: 'Male',
        phoneNumber: '7654321098',
        queueNumber: 'A003'
      },
      // Example of a past appointment (yesterday)
      { 
        id: 4, 
        patientName: 'Anita Singh', 
        doctorName: doctorName, 
        date: getPreviousDate(1), // Yesterday's appointment
        time: '10:00 AM', 
        status: 'confirmed',
        gender: 'Female',
        phoneNumber: '6543210987',
        queueNumber: 'A004'
      },
      // Example of a future appointment (tomorrow)
      { 
        id: 5, 
        patientName: 'Vikram Malhotra', 
        doctorName: doctorName, 
        date: getNextDate(1), // Tomorrow's appointment
        time: '02:30 PM', 
        status: 'pending',
        gender: 'Male',
        phoneNumber: '5432109876',
        queueNumber: 'A005'
      }
    ];

    // Filter appointments to show only today's appointments
    const todaysAppointments = sampleData.filter(app => app.date === todayDate);
    setAppointments(todaysAppointments);
    
    // This effect will run whenever the date changes (e.g., at midnight)
    const checkDateInterval = setInterval(() => {
      const newDate = new Date().toISOString().split('T')[0];
      if (newDate !== todayDate) {
        // If date has changed, reload the page to refresh appointments
        window.location.reload();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkDateInterval);
  }, [todayDate, doctorName]);

  // Helper function to get previous date (for sample data)
  function getPreviousDate(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  // Helper function to get next date (for sample data)
  function getNextDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  // Fixed input handling functions to ensure smooth typing
  const handleConsultationFeeChange = (e) => {
    const value = e.target.value;
    setConsultationFee(value);
    // Keep focus on the input
    if (consultationFeeRef.current) {
      setTimeout(() => {
        consultationFeeRef.current.focus();
        // Place cursor at the end
        const len = value.length;
        consultationFeeRef.current.setSelectionRange(len, len);
      }, 0);
    }
  };

  const handleDrugFeeChange = (e) => {
    const value = e.target.value;
    setDrugFee(value);
    // Keep focus on the input
    if (drugFeeRef.current) {
      setTimeout(() => {
        drugFeeRef.current.focus();
        // Place cursor at the end
        const len = value.length;
        drugFeeRef.current.setSelectionRange(len, len);
      }, 0);
    }
  };

  const handlePatientClick = (appointment) => {
    setSelectedAppointment(appointment);
    setConsultationFee('500'); // Default values
    setDrugFee('300');
    setShowPatientModal(true);
  };

  const handleConfirmAppointment = () => {
    // Update appointment status to confirmed
    setAppointments(prev => prev.map(app => 
      app.id === selectedAppointment.id 
        ? { ...app, status: 'confirmed' } 
        : app
    ));
    
    // Close patient details modal and show receipt
    setShowPatientModal(false);
    setShowReceiptModal(true);
  };

  const handleClosePatientModal = () => {
    setShowPatientModal(false);
    setSelectedAppointment(null);
  };

  const handleCloseReceiptModal = () => {
    setShowReceiptModal(false);
  };

  // New function for cancelling appointment
  const handleCancelAppointment = (appointmentId, event) => {
    // Prevent opening the patient modal when clicking the cancel button
    event.stopPropagation();
    
    // Update the appointment status to cancelled
    setAppointments(prev => prev.map(app => 
      app.id === appointmentId 
        ? { ...app, status: 'cancelled' } 
        : app
    ));
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateTotal = () => {
    return parseFloat(consultationFee || 0) + parseFloat(drugFee || 0);
  };

  const totalFee = calculateTotal();

  // Status badge styling function
  const getStatusBadgeStyle = (status) => {
    let bgColor = '#6c757d'; // Default gray
    
    if (status === 'confirmed') {
      bgColor = '#28a745'; // Green
    } else if (status === 'cancelled') {
      bgColor = '#dc3545'; // Red
    } else if (status === 'pending') {
      bgColor = '#ffc107'; // Yellow
    }
    
    return {
      backgroundColor: bgColor,
      color: 'white',
      padding: '4px 10px',
      borderRadius: '4px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
    };
  };

  // Modal component for patient details
  const PatientDetailsModal = () => {
    if (!showPatientModal || !selectedAppointment) return null;
    
    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <h2 style={styles.modalTitle}>Patient Details</h2>
          
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Patient Name:</span>
            <span style={styles.detailValue}>{selectedAppointment.patientName}</span>
          </div>
          
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Phone Number:</span>
            <span style={styles.detailValue}>{selectedAppointment.phoneNumber}</span>
          </div>
          
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Queue Number:</span>
            <span style={styles.detailValue}>{selectedAppointment.queueNumber}</span>
          </div>
          
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Gender:</span>
            <span style={styles.detailValue}>{selectedAppointment.gender}</span>
          </div>
          
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Doctor:</span>
            <span style={styles.detailValue}>{selectedAppointment.doctorName}</span>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Consultation Fee (Rs):</label>
            <input
              ref={consultationFeeRef}
              type="text"
              inputMode="numeric" 
              pattern="[0-9]*"
              value={consultationFee}
              onChange={handleConsultationFeeChange}
              style={styles.input}
              autoComplete="off"
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Drug Fee (Rs):</label>
            <input
              ref={drugFeeRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={drugFee}
              onChange={handleDrugFeeChange}
              style={styles.input}
              autoComplete="off"
            />
          </div>
          
          <div style={styles.totalSection}>
            <span style={styles.totalLabel}>Total Fee:</span>
            <span style={styles.totalValue}>Rs {totalFee}</span>
          </div>
          
          <div style={styles.buttonGroup}>
            <button onClick={handleClosePatientModal} style={styles.cancelButton}>
              Cancel
            </button>
            <button onClick={handleConfirmAppointment} style={styles.confirmButton}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal component for receipt
  const ReceiptModal = () => {
    if (!showReceiptModal || !selectedAppointment) return null;
    
    return (
      <div style={styles.modalOverlay} className="receipt-modal">
        <div style={styles.receiptContent} className="print-receipt">
          <h2 style={styles.receiptTitle}>Payment Receipt</h2>
          
          <div style={styles.receiptHeader}>
            <h3 style={styles.clinicName}>MYO CLINIC</h3>
            <p style={styles.clinicAddress}>123 Medical Center Road, City</p>
            <p style={styles.receiptDate}>Date: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div style={styles.receiptDivider}></div>
          
          <div style={styles.receiptDetails}>
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Patient Name:</span>
              <span style={styles.receiptValue}>{selectedAppointment.patientName}</span>
            </div>
            
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Phone Number:</span>
              <span style={styles.receiptValue}>{selectedAppointment.phoneNumber}</span>
            </div>
            
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Queue Number:</span>
              <span style={styles.receiptValue}>{selectedAppointment.queueNumber}</span>
            </div>
            
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Gender:</span>
              <span style={styles.receiptValue}>{selectedAppointment.gender}</span>
            </div>
            
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Doctor:</span>
              <span style={styles.receiptValue}>{selectedAppointment.doctorName}</span>
            </div>
            
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Appointment Date:</span>
              <span style={styles.receiptValue}>{selectedAppointment.date}</span>
            </div>
            
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Appointment Time:</span>
              <span style={styles.receiptValue}>{selectedAppointment.time}</span>
            </div>
          </div>
          
          <div style={styles.receiptDivider}></div>
          
          <div style={styles.feesSection}>
            <div style={styles.feeItem}>
              <span style={styles.feeLabel}>Consultation Fee:</span>
              <span style={styles.feeAmount}>Rs {consultationFee}</span>
            </div>
            
            <div style={styles.feeItem}>
              <span style={styles.feeLabel}>Drug Fee:</span>
              <span style={styles.feeAmount}>Rs {drugFee}</span>
            </div>
            
            <div style={styles.totalItem}>
              <span style={styles.totalReceiptLabel}>Total:</span>
              <span style={styles.totalReceiptValue}>Rs {totalFee}</span>
            </div>
          </div>
          
          <div style={styles.receiptFooter}>
            <p style={styles.thankYouMessage}>Thank you for your visit!</p>
          </div>
          
          <div style={styles.buttonGroup} className="no-print">
            <button onClick={handleCloseReceiptModal} style={styles.cancelButton}>
              Cancel
            </button>
            <button onClick={handlePrint} style={styles.printButton}>
              Print
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add the print-specific CSS styles
  useEffect(() => {
    // Create style element for print media
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.media = 'print';
    
    // Add CSS rules for printing - optimized to match the receipt in your image
    styleElement.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-receipt, .print-receipt * {
          visibility: visible;
        }
        .no-print {
          display: none !important;
        }
        .print-receipt {
          position: absolute;
          left: 0;
          top: 0;
          width: 210mm;
          height: 148mm; /* A5 size */
          padding: 15mm;
          margin: 0;
          box-sizing: border-box;
          box-shadow: none;
          border-radius: 0;
          background-color: white;
        }
        .receipt-modal {
          position: absolute;
          background-color: white;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
        }
        
        /* Adjust font sizes and spacing for receipt items */
        .print-receipt h2 {
          font-size: 18pt;
          margin-top: 0;
          margin-bottom: 8pt;
        }
        .print-receipt h3 {
          font-size: 16pt;
          margin: 4pt 0;
        }
        .print-receipt p {
          margin: 3pt 0;
          font-size: 10pt;
        }
        .print-receipt .receiptRow {
          padding: 3pt 0;
          font-size: 10pt;
        }
        .print-receipt .feeItem {
          padding: 3pt 0;
          font-size: 10pt;
        }
        .print-receipt .totalItem {
          padding: 5pt 0;
          font-size: 12pt;
        }
        
        /* Ensure receipt fits on one page */
        @page {
          size: A5 landscape;
          margin: 0;
        }
      }
    `;
    
    // Append the style element to head
    document.head.appendChild(styleElement);
    
    // Cleanup function
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div style={styles.root}>
      <div style={styles.fullPageContainer}>
        <Header />
        
        <div style={styles.container}>
          <h1 style={styles.title}>Today Appointments ({new Date().toLocaleDateString()})</h1>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Gender</th>
                  <th style={styles.th}>Doctor</th>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((app, index) => (
                    <tr 
                      key={app.id} 
                      onClick={() => handlePatientClick(app)} 
                      style={styles.tr}
                    >
                      <td style={styles.td}>{index + 1}</td>
                      <td style={styles.td}>{app.patientName}</td>
                      <td style={styles.td}>{app.gender}</td>
                      <td style={styles.td}>{app.doctorName}</td>
                      <td style={styles.td}>{app.time}</td>
                      <td style={styles.td}>
                        <span style={getStatusBadgeStyle(app.status)}>
                          {app.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {app.status !== 'cancelled' && (
                          <button 
                            onClick={(e) => handleCancelAppointment(app.id, e)}
                            style={styles.actionButton}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{...styles.td, textAlign: 'center', padding: '30px'}}>
                      No appointments scheduled for today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Patient Details Modal */}
          <PatientDetailsModal />

          {/* Receipt Modal */}
          <ReceiptModal />
        </div>
      </div>
    </div>
  );
};

// Updated styling with full white background and new styles
const styles = {
  root: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: 0,
  },
  fullPageContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    margin: '0 auto',
  },
  container: {
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: '20px 30px 40px',
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#000000',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
    marginBottom: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    borderRadius: '8px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
  },
  th: {
    textAlign: 'left',
    padding: '15px',
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    borderBottom: '2px solid #ccc',
    color: '#000',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    color: '#000',
  },
  tr: {
    backgroundColor: '#ffffff',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#f5f5f5',
    }
  },
  actionButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    position: 'relative',
  },
  modalTitle: {
    color: '#2c3e50',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginBottom: '20px',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
  },
  detailRow: {
    display: 'flex',
    marginBottom: '12px',
  },
  detailLabel: {
    fontWeight: 'bold',
    width: '140px',
    color: '#555',
  },
  detailValue: {
    flex: '1',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '5px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  totalSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: '12px 15px',
    borderRadius: '5px',
    marginTop: '20px',
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: '18px',
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#28a745',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '25px',
    gap: '15px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  confirmButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  printButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  
  // Receipt Styles - Optimized for single-page printing like in the image
  receiptContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '550px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
  },
  receiptTitle: {
    textAlign: 'center',
    color: '#2c3e50',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginBottom: '10px',
  },
  receiptHeader: {
    textAlign: 'center',
    marginBottom: '15px',
  },
  clinicName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    margin: '3px 0',
  },
  clinicAddress: {
    margin: '3px 0',
    color: '#555',
    fontSize: '0.9rem',
  },
  receiptDate: {
    fontStyle: 'italic',
    marginTop: '5px',
    fontSize: '0.9rem',
  },
  receiptDivider: {
    height: '1px',
    backgroundColor: '#ddd',
    margin: '10px 0',
  },
  receiptDetails: {
    marginBottom: '15px',
  },
  receiptRow: {
    display: 'flex',
    padding: '6px 0',
    fontSize: '0.95rem',
  },
  receiptLabel: {
    fontWeight: 'bold',
    width: '150px',
    color: '#555',
  },
  receiptValue: {
    flex: '1',
  },
  feesSection: {
    backgroundColor: '#f8f9fa',
    padding: '12px',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  feeItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: '1px dashed #ddd',
    fontSize: '0.95rem',
  },
  feeLabel: {
    color: '#555',
  },
  feeAmount: {
    fontWeight: '500',
  },
  totalItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    marginTop: '6px',
  },
  totalReceiptLabel: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  totalReceiptValue: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#28a745',
  },
  receiptFooter: {
    textAlign: 'center',
    marginTop: '15px',
    paddingTop: '10px',
    borderTop: '1px solid #eee',
  },
  thankYouMessage: {
    fontStyle: 'italic',
    color: '#555',
    fontSize: '0.9rem',
  }
};

export default AppointmentsDashboard;