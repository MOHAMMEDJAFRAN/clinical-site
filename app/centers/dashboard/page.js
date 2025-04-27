'use client';

import React, { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
import Header from '../components/Header';

const ClinicalCenterDashboard = () => {
  const todayDate = new Date().toISOString().split('T')[0];
  const [, setCenters] = useState([]);
  const [currentClinic, setCurrentClinic] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [filteredTodayAppointments, setFilteredTodayAppointments] = useState([]);
  const [filteredUpcomingAppointments, setFilteredUpcomingAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [consultationFee, setConsultationFee] = useState('');
  const [drugFee, setDrugFee] = useState('');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [todayDoctorFilter, setTodayDoctorFilter] = useState('');
  const [upcomingDoctorFilter, setUpcomingDoctorFilter] = useState('');
  const [dataTablesInitialized, setDataTablesInitialized] = useState(false);
  const [sortField, setSortField] = useState(''); // New state for sorting field
  const [sortDirection, setSortDirection] = useState('asc'); // New state for sort direction

  // References for input fields to maintain focus
  const consultationFeeRef = useRef(null);
  const drugFeeRef = useRef(null);
  const todayTableRef = useRef(null);
  const upcomingTableRef = useRef(null);
  const searchInputRef = useRef(null); // New ref for search input

  useEffect(() => {
    const loggedInClinicId = 1;

    const sampleCenters = [
      { id: 1, name: 'Downtown Medical Center', location: 'Kandy', type: 'Hospital', status: 'Active', contactEmail: 'downtown@medical.com', contactPhone: '011-2234567', openTime: '08:00 AM', closeTime: '06:00 PM' },
      { id: 2, name: 'Westside Clinic', location: 'Ampara', type: 'Clinic', status: 'Active', contactEmail: 'west@clinic.com', contactPhone: '033-2245678', openTime: '09:00 AM', closeTime: '05:00 PM' },
      { id: 3, name: 'Southgate Health Center', location: 'Colombo', type: 'Health Center', status: 'Inactive', contactEmail: 'south@health.com', contactPhone: '011-2876543', openTime: '10:00 AM', closeTime: '04:00 PM' },
      { id: 4, name: 'Eastern Medical Facility', location: 'Galle', type: 'Hospital', status: 'Active', contactEmail: 'eastern@medical.com', contactPhone: '091-2298765', openTime: '07:00 AM', closeTime: '07:00 PM' }
    ];

    const loggedInClinic = sampleCenters.find(center => center.id === loggedInClinicId);
    setCenters(sampleCenters);
    setCurrentClinic(loggedInClinic);

    // Function to generate a date string for a future date
    const getFutureDate = (daysToAdd) => {
      const date = new Date();
      date.setDate(date.getDate() + daysToAdd);
      return date.toISOString().split('T')[0];
    };

    // Sample appointments data for today - initially all Confirm
    const sampleTodayAppointments = [
      { 
        id: 1, 
        patientName: 'Rahul Sharma', 
        doctorName: 'Dr. Vivek Sharma', 
        date: todayDate, 
        time: '08:00 AM to 11:30 AM', 
        status: 'Confirm',
        gender: 'Male',
        phoneNumber: '9876543210',
        queueNumber: 'A001',
        age: 32,
        shiftTime: '08:00 AM to 11:30 AM'
      },
      { 
        id: 2, 
        patientName: 'Priya Patel', 
        doctorName: 'Dr. Vivek Sharma', 
        date: todayDate,
        time: '08:00 AM to 11:30 AM', 
        status: 'Confirm',
        gender: 'Female',
        phoneNumber: '8765432109',
        queueNumber: 'A002',
        age: 28,
        shiftTime: '08:00 AM to 11:30 AM'
      },
      { 
        id: 3, 
        patientName: 'Deepak Verma', 
        doctorName: 'Dr. Perera', 
        date: todayDate,
        time: '12:30 PM to 4:30 PM', 
        status: 'Confirm',
        gender: 'Male',
        phoneNumber: '7654321098',
        queueNumber: 'A003',
        age: 45,
        shiftTime: '12:30 PM to 4:30 PM'
      },
      { 
        id: 4, 
        patientName: 'Anita Singh', 
        doctorName: 'Dr. Fernando', 
        date: todayDate,
        time: '08:00 AM to 11:30 AM', 
        status: 'Confirm',
        gender: 'Female',
        phoneNumber: '6543210987',
        queueNumber: 'A004',
        age: 39,
        shiftTime: '08:00 AM to 11:30 AM'
      },
      { 
        id: 5, 
        patientName: 'Vikram Malhotra', 
        doctorName: 'Dr. Gunawardena', 
        date: todayDate,
        time: '06:00 PM to 11:30 PM', 
        status: 'Confirm',
        gender: 'Male',
        phoneNumber: '5432109876',
        queueNumber: 'A005',
        age: 52,
        shiftTime: '06:00 PM to 11:30 PM'
      }
    ];

    // Sample appointments data for upcoming days
    const sampleUpcomingAppointments = [
      { 
        id: 6, 
        patientName: 'Maya Jayasuriya', 
        doctorName: 'Dr. Perera', 
        date: getFutureDate(1), 
        time: '08:00 AM to 11:30 AM', 
        status: 'Confirm',
        gender: 'Female',
        phoneNumber: '7123456789',
        queueNumber: 'B001',
        age: 29,
        shiftTime: '08:00 AM to 11:30 AM'
      },
      { 
        id: 7, 
        patientName: 'Harsha Fernando', 
        doctorName: 'Dr. Gunawardena', 
        date: getFutureDate(1),
        time: '12:30 PM to 4:30 PM', 
        status: 'Confirm',
        gender: 'Male',
        phoneNumber: '7234567890',
        queueNumber: 'B002',
        age: 42,
        shiftTime: '12:30 PM to 4:30 PM'
      },
      { 
        id: 8, 
        patientName: 'Nimal Perera', 
        doctorName: 'Dr. Vivek Sharma', 
        date: getFutureDate(2),
        time: '08:00 AM to 11:30 AM', 
        status: 'Confirm',
        gender: 'Male',
        phoneNumber: '7345678901',
        queueNumber: 'C001',
        age: 58,
        shiftTime: '08:00 AM to 11:30 AM'
      },
      { 
        id: 9, 
        patientName: 'Kumari Silva', 
        doctorName: 'Dr. Fernando', 
        date: getFutureDate(2),
        time: '12:30 PM to 4:30 PM', 
        status: 'Confirm',
        gender: 'Female',
        phoneNumber: '7456789012',
        queueNumber: 'C002',
        age: 35,
        shiftTime: '12:30 PM to 4:30 PM'
      },
      { 
        id: 10, 
        patientName: 'Rajiv Patel', 
        doctorName: 'Dr. Perera', 
        date: getFutureDate(3),
        time: '08:00 AM to 11:30 AM', 
        status: 'Confirm',
        gender: 'Male',
        phoneNumber: '7567890123',
        queueNumber: 'D001',
        age: 47,
        shiftTime: '08:00 AM to 11:30 AM'
      },
      { 
        id: 11, 
        patientName: 'Lakshmi Devi', 
        doctorName: 'Dr. Gunawardena', 
        date: getFutureDate(3),
        time: '12:30 PM to 4:30 PM', 
        status: 'Confirm',
        gender: 'Female',
        phoneNumber: '7678901234',
        queueNumber: 'D002',
        age: 61,
        shiftTime: '12:30 PM to 4:30 PM'
      },
      { 
        id: 12, 
        patientName: 'Amal Jayasinghe', 
        doctorName: 'Dr. Fernando', 
        date: getFutureDate(4),
        time: '08:00 AM to 11:30 AM', 
        status: 'Confirm',
        gender: 'Male',
        phoneNumber: '7789012345',
        queueNumber: 'E001',
        age: 33,
        shiftTime: '08:00 AM to 11:30 AM'
      }
    ];

    setTodayAppointments(sampleTodayAppointments);
    setFilteredTodayAppointments(sampleTodayAppointments);
    setUpcomingAppointments(sampleUpcomingAppointments);
    setFilteredUpcomingAppointments(sampleUpcomingAppointments);
  }, [todayDate]);

  // Initialize jQuery DataTables with additional features
  useEffect(() => {
    if (typeof window !== 'undefined' && 
        filteredTodayAppointments.length && 
        filteredUpcomingAppointments.length && 
        !dataTablesInitialized) {
      
      // Add DataTables script dynamically
      const loadDataTablesScript = () => {
        // Check if jQuery is loaded
        if (!window.jQuery) {
          const jqueryScript = document.createElement('script');
          jqueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
          jqueryScript.onload = loadDataTables;
          document.head.appendChild(jqueryScript);
        } else {
          loadDataTables();
        }
      };

      const loadDataTables = () => {
        if (!window.$.fn.DataTable) {
          const datatableScript = document.createElement('script');
          datatableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.21/js/jquery.dataTables.min.js';
          datatableScript.onload = () => {
            // Load DataTables Buttons extension
            const buttonScript = document.createElement('script');
            buttonScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/datatables.net-buttons/2.2.3/js/dataTables.buttons.min.js';
            buttonScript.onload = () => {
              // Load additional button functionality
              const buttonsHtmlScript = document.createElement('script');
              buttonsHtmlScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/datatables.net-buttons/2.2.3/js/buttons.html5.min.js';
              buttonsHtmlScript.onload = () => {
                const buttonsPrintScript = document.createElement('script');
                buttonsPrintScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/datatables.net-buttons/2.2.3/js/buttons.print.min.js';
                buttonsPrintScript.onload = initializeTables;
                document.head.appendChild(buttonsPrintScript);
              };
              document.head.appendChild(buttonsHtmlScript);
            };
            document.head.appendChild(buttonScript);
          };
          document.head.appendChild(datatableScript);
          
          // Add DataTables CSS
          const datatableCSS = document.createElement('link');
          datatableCSS.rel = 'stylesheet';
          datatableCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.21/css/jquery.dataTables.min.css';
          document.head.appendChild(datatableCSS);
          
          // Add DataTables Buttons CSS
          const buttonsCSS = document.createElement('link');
          buttonsCSS.rel = 'stylesheet';
          buttonsCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/datatables.net-buttons/2.2.3/css/buttons.dataTables.min.css';
          document.head.appendChild(buttonsCSS);
        } else {
          initializeTables();
        }
      };

      const initializeTables = () => {
        // Initialize Today's Appointments table
        if (todayTableRef.current && !$.fn.DataTable.isDataTable('#todayTable')) {
          $(todayTableRef.current).DataTable({
            responsive: true,
            paging: true,
            searching: false, // Disable default search as we'll implement our own
            ordering: true,
            info: true,
            pageLength: 5,
            lengthMenu: [5, 10, 25],
            language: {
              lengthMenu: "Show _MENU_ entries",
              info: "Showing _START_ to _END_ of _TOTAL_ appointments"
            },
            dom: 'Bfrtip',
            buttons: [
              'copy', 'csv', 'excel', 'pdf', 'print'
            ],
            scrollX: true, // Enable horizontal scrolling
            scrollY: '400px', // Enable vertical scrolling with fixed height
            scrollCollapse: true
          });
        }

        // Initialize Upcoming Appointments table
        if (upcomingTableRef.current && !$.fn.DataTable.isDataTable('#upcomingTable')) {
          $(upcomingTableRef.current).DataTable({
            responsive: true,
            paging: true,
            searching: true,
            ordering: true,
            info: true,
            pageLength: 5,
            lengthMenu: [5, 10, 25],
            language: {
              search: "Filter doctor name:",
              lengthMenu: "Show _MENU_ entries",
              info: "Showing _START_ to _END_ of _TOTAL_ appointments"
            },
            dom: 'Bfrtip',
            buttons: [
              'copy', 'csv', 'excel', 'pdf', 'print'
            ],
            initComplete: function() {
              // Replace the default search input with our filter input
              $('#upcomingTable_filter input').on('keyup', function() {
                setUpcomingDoctorFilter($(this).val());
              });
            },
            scrollX: true, // Enable horizontal scrolling
            scrollY: '400px', // Enable vertical scrolling with fixed height
            scrollCollapse: true
          });
        }

        setDataTablesInitialized(true);
      };

      loadDataTablesScript();

      // Cleanup function to destroy DataTables when component unmounts
      return () => {
        if (typeof window !== 'undefined' && window.jQuery && $.fn.DataTable.isDataTable('#todayTable')) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          $(todayTableRef.current).DataTable().destroy();
        }
        if (typeof window !== 'undefined' && window.jQuery && $.fn.DataTable.isDataTable('#upcomingTable')) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          $(upcomingTableRef.current).DataTable().destroy();
        }
      };
    }
  }, [filteredTodayAppointments, filteredUpcomingAppointments, dataTablesInitialized]);

  // Effect to filter today's appointments based on doctor name
  useEffect(() => {
    if (todayDoctorFilter === '') {
      setFilteredTodayAppointments(todayAppointments);
    } else {
      const filtered = todayAppointments.filter(app => 
        app.doctorName.toLowerCase().includes(todayDoctorFilter.toLowerCase())
      );
      setFilteredTodayAppointments(filtered);
    }
  }, [todayDoctorFilter, todayAppointments]);

  // Effect to filter upcoming appointments based on doctor name
  useEffect(() => {
    if (upcomingDoctorFilter === '') {
      setFilteredUpcomingAppointments(upcomingAppointments);
    } else {
      const filtered = upcomingAppointments.filter(app => 
        app.doctorName.toLowerCase().includes(upcomingDoctorFilter.toLowerCase())
      );
      setFilteredUpcomingAppointments(filtered);
    }
  }, [upcomingDoctorFilter, upcomingAppointments]);

  // New function to handle search input changes
  const handleSearchChange = (e) => {
    setTodayDoctorFilter(e.target.value);
  };

  // New function to handle sorting
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
    
    const sortedAppointments = [...filteredTodayAppointments].sort((a, b) => {
      if (a[field] < b[field]) {
        return isAsc ? 1 : -1;
      }
      if (a[field] > b[field]) {
        return isAsc ? -1 : 1;
      }
      return 0;
    });
    
    setFilteredTodayAppointments(sortedAppointments);
  };

  // Function to render sort arrow
  const renderSortArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

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

  // Function to handle clicking on "Confirm" button
  const handleConfirmClick = (appointmentId, event) => {
    // Prevent parent row click event
    event.stopPropagation();
    
    // Find the selected appointment
    const appointment = todayAppointments.find(app => app.id === appointmentId);
      
    if (appointment) {
      setSelectedAppointment(appointment);
      setConsultationFee(''); // Empty values by default
      setDrugFee('');
      setShowPatientModal(true);
    }
  };

  // Function to handle clicking on "Cancel" button
  const handleCancelAppointment = (appointmentId, event) => {
    // Prevent parent row click event
    event.stopPropagation();
    
    // Update today's appointment status to cancelled
    const updatedAppointments = todayAppointments.map(app => 
      app.id === appointmentId 
        ? { ...app, status: 'cancelled' } 
        : app
    );
    
    setTodayAppointments(updatedAppointments);
    setFilteredTodayAppointments(
      todayDoctorFilter === '' 
        ? updatedAppointments 
        : updatedAppointments.filter(app => 
            app.doctorName.toLowerCase().includes(todayDoctorFilter.toLowerCase())
          )
    );
  };

  // Confirm appointment after filling in patient details
  const handleConfirmAppointment = () => {
    // Update today's appointment status to completed
    const updatedAppointments = todayAppointments.map(app => 
      app.id === selectedAppointment.id 
        ? { ...app, status: 'completed' } 
        : app
    );
    
    setTodayAppointments(updatedAppointments);
    setFilteredTodayAppointments(
      todayDoctorFilter === '' 
        ? updatedAppointments 
        : updatedAppointments.filter(app => 
            app.doctorName.toLowerCase().includes(todayDoctorFilter.toLowerCase())
          )
    );
    
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

  const handlePrint = () => {
    window.print();
  };

  const calculateTotal = () => {
    return parseFloat(consultationFee || 0) + parseFloat(drugFee || 0);
  };

  const totalFee = calculateTotal();

  // Status badge styling function - improved contrast and larger text
  const getStatusBadgeStyle = (status) => {
    let badgeStyle = {
      badge: {
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        display: 'inline-block',
        textAlign: 'center',
        minWidth: '80px',
        color: 'white'
      },
      text: status.charAt(0).toUpperCase() + status.slice(1)
    };
    
    // Set color based on status
    switch(status) {
      case 'completed':
        badgeStyle.badge.backgroundColor = '#28a745';
        break;
      case 'cancelled':
        badgeStyle.badge.backgroundColor = '#dc3545';
        break;
      default: // Confirm
        badgeStyle.badge.backgroundColor = '#ffc107';
        badgeStyle.badge.color = '#000';
    }
    
    return badgeStyle;
  };
  // Modal component for patient details
  const PatientDetailsModal = () => {
    if (!showPatientModal || !selectedAppointment) return null;
    
    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <h2 style={{...styles.modalTitle, color: '#000000'}}>Patient Details</h2>
          
          <div style={styles.patientModalGrid}>
            <div style={styles.patientDetailsSection}>
              <div style={styles.detailRow}>
                <span style={{...styles.detailLabel, color: '#000000'}}>Patient Name:</span>
                <span style={{...styles.detailValue, color: '#000000'}}>{selectedAppointment.patientName}</span>
              </div>
              
              <div style={styles.detailRow}>
                <span style={{...styles.detailLabel, color: '#000000'}}>Phone Number:</span>
                <span style={{...styles.detailValue, color: '#000000'}}>{selectedAppointment.phoneNumber}</span>
              </div>
              
              <div style={styles.detailRow}>
                <span style={{...styles.detailLabel, color: '#000000'}}>Age:</span>
                <span style={{...styles.detailValue, color: '#000000'}}>{selectedAppointment.age}</span>
              </div>
              
              <div style={styles.detailRow}>
                <span style={{...styles.detailLabel, color: '#000000'}}>Gender:</span>
                <span style={{...styles.detailValue, color: '#000000'}}>{selectedAppointment.gender}</span>
              </div>
              
              <div style={styles.detailRow}>
                <span style={{...styles.detailLabel, color: '#000000'}}>Doctor:</span>
                <span style={{...styles.detailValue, color: '#000000'}}>{selectedAppointment.doctorName}</span>
              </div>
              
              <div style={styles.detailRow}>
                <span style={{...styles.detailLabel, color: '#000000'}}>Time:</span>
                <span style={{...styles.detailValue, color: '#000000'}}>{selectedAppointment.shiftTime}</span>
              </div>
            </div>
            
            <div style={styles.feesSection}>
              <div style={styles.feeInputRow}>
                <span style={{...styles.feeLabel, color: '#000000'}}>Consultation Fee (Rs):</span>
                <div style={styles.feeInputContainer}>
                  <input
                    ref={consultationFeeRef}
                    type="text"
                    inputMode="numeric" 
                    pattern="[0-9]*"
                    value={consultationFee}
                    onChange={handleConsultationFeeChange}
                    style={{...styles.feeInput, color: '#000000'}}
                    autoComplete="off"
                    placeholder="Enter consultation fee"
                  />
                </div>
              </div>
              
              <div style={styles.feeInputRow}>
                <span style={{...styles.feeLabel, color: '#000000'}}>Drug Fee (Rs):</span>
                <div style={styles.feeInputContainer}>
                  <input
                    ref={drugFeeRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={drugFee}
                    onChange={handleDrugFeeChange}
                    style={{...styles.feeInput, color: '#000000'}}
                    autoComplete="off"
                    placeholder="Enter drug fee"
                  />
                </div>
              </div>
              
              <div style={styles.totalRow}>
                <span style={{...styles.totalLabel, color: '#000000'}}>Total Fee:</span>
                <span style={styles.totalValue}>Rs {totalFee}</span>
              </div>
            </div>
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

  // Modal component for receipt - reduced size and made scrollable
  const ReceiptModal = () => {
    if (!showReceiptModal || !selectedAppointment) return null;
    
    return (
      <div style={styles.modalOverlay} className="receipt-modal">
        <div style={styles.receiptContent} className="print-receipt">
          <div style={styles.receiptHeader}>
            <h2 style={styles.clinicName}>MYO CLINIC</h2>
            <p style={styles.clinicAddress}>123 Medical Center Road, City</p>
            <p style={styles.clinicPhone}>Tel: 011-7654321</p>
          </div>
          
          <div style={styles.receiptDivider}></div>
          
          <h2 style={styles.receiptTitle}>Payment Receipt</h2>
          <p style={styles.receiptDate}>Date: {new Date().toLocaleDateString()}</p>
          
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
              <span style={styles.receiptLabel}>Age:</span>
              <span style={styles.receiptValue}>{selectedAppointment.age}</span>
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
              <span style={styles.receiptLabel}>Time:</span>
              <span style={styles.receiptValue}>{selectedAppointment.shiftTime}</span>
            </div>
            
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Appointment Date:</span>
              <span style={styles.receiptValue}>{selectedAppointment.date}</span>
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
            
            <div style={styles.feeItem}>
              <span style={styles.feeTotalLabel}>Total Amount:</span>
              <span style={styles.feeTotalAmount}>Rs {totalFee}</span>
            </div>
          </div>
          
          <div style={styles.receiptDivider}></div>
          
          <div style={styles.receiptFooter}>
            <p style={styles.footerText}>Thank you for visiting MYO CLINIC!</p>
            <p style={styles.footerSubtext}>For any inquiries, please contact us at myoclinic@example.com</p>
          </div>
          
          <div style={styles.receiptActionButtons}>
            <button onClick={handleCloseReceiptModal} style={styles.closeReceiptButton}>
              Close
            </button>
            <button onClick={handlePrint} style={styles.printReceiptButton}>
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <Header />
      
      {/* Dashboard Header */}
      <div style={styles.dashboardHeader}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Clinical Center Dashboard</h1>
          {currentClinic && (
            <h2 style={styles.clinicSubtitle}>{currentClinic.name} - {currentClinic.location}</h2>
          )}
        </div>
        <div style={styles.headerRight}>
          <p style={styles.dateDisplay}>{new Date().toLocaleDateString()}</p>
          {currentClinic && (
            <p style={styles.clinicStatus}>
              Status: <span style={{
                color: currentClinic.status === 'Active' ? '#28a745' : '#dc3545',
                fontWeight: 'bold'
              }}>{currentClinic.status}</span>
            </p>
          )}
        </div>
      </div>
      
      {/* Quick Stats */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <span style={styles.icon}>👥</span>
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>{filteredTodayAppointments.length}</span>
            <span style={styles.statLabel}>Today Appointments</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <span style={styles.icon}>📅</span>
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>{filteredUpcomingAppointments.length}</span>
            <span style={styles.statLabel}>Upcoming Appointments</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <span style={styles.icon}>✅</span>
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>
              {todayAppointments.filter(app => app.status === 'completed').length}
            </span>
            <span style={styles.statLabel}>Completed Today</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <span style={styles.icon}>❌</span>
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>
              {todayAppointments.filter(app => app.status === 'cancelled').length}
            </span>
            <span style={styles.statLabel}>Cancelled Today</span>
          </div>
        </div>
      </div>
      
      {/* Today's Appointments */}
      <div style={styles.sectionContainer}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Today Appointments</h2>
          <div style={styles.searchContainer}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Filter by doctor name..."
              value={todayDoctorFilter}
              onChange={handleSearchChange}
              style={styles.searchInput}
              color='#111112'
            />
          </div>
        </div>
        
        <div style={styles.tableContainer}>
          <table id="todayTable" ref={todayTableRef} style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader} onClick={() => handleSort('patientName')}>
                  Patient Name {renderSortArrow('patientName')}
                </th>
                <th style={styles.tableHeader} onClick={() => handleSort('doctorName')}>
                  Doctor Name {renderSortArrow('doctorName')}
                </th>
                <th style={styles.tableHeader} onClick={() => handleSort('time')}>
                  Time {renderSortArrow('time')}
                </th>
                <th style={styles.tableHeader} onClick={() => handleSort('queueNumber')}>
                  Queue No. {renderSortArrow('queueNumber')}
                </th>
                <th style={styles.tableHeader} onClick={() => handleSort('status')}>
                  Status {renderSortArrow('status')}
                </th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTodayAppointments.map((appointment) => {
                const statusBadge = getStatusBadgeStyle(appointment.status);
                
                return (
                  <tr key={appointment.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{appointment.patientName}</td>
                    <td style={styles.tableCell}>{appointment.doctorName}</td>
                    <td style={styles.tableCell}>{appointment.time}</td>
                    <td style={styles.tableCell}>{appointment.queueNumber}</td>
                    <td style={styles.tableCell}>
                      <span style={statusBadge.badge}>{statusBadge.text}</span>
                    </td>
                    <td style={styles.tableCellActions}>
                      {appointment.status === 'Confirm' && (
                        <>
                          <button
                            onClick={(e) => handleConfirmClick(appointment.id, e)}
                            style={styles.actionButton}
                          >
                            completed
                          </button>
                          <button
                            onClick={(e) => handleCancelAppointment(appointment.id, e)}
                            style={styles.cancelButton}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {appointment.status === 'completed' && (
                        <button style={{...styles.actionButton, backgroundColor: '#28a745'}}>
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Upcoming Appointments */}
      
      <div style={styles.sectionContainer}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Upcoming Appointments</h2>
        </div>
        
        <div style={styles.tableContainer}>
          <table id="upcomingTable" ref={upcomingTableRef} style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Patient Name</th>
                <th style={styles.tableHeader}>Doctor Name</th>
                <th style={styles.tableHeader}>Date</th>
                <th style={styles.tableHeader}>Time</th>
                <th style={styles.tableHeader}>Queue No.</th>
                <th style={styles.tableHeader}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUpcomingAppointments.map((appointment) => {
                const statusBadge = getStatusBadgeStyle(appointment.status);
                
                return (
                  <tr key={appointment.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{appointment.patientName}</td>
                    <td style={styles.tableCell}>{appointment.doctorName}</td>
                    <td style={styles.tableCell}>{appointment.date}</td>
                    <td style={styles.tableCell}>{appointment.time}</td>
                    <td style={styles.tableCell}>{appointment.queueNumber}</td>
                    <td style={styles.tableCell}>
                      <span style={statusBadge.badge}>{statusBadge.text}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Render modals */}
      <PatientDetailsModal />
      <ReceiptModal />
      
      {/* Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-receipt, .print-receipt * {
            visibility: visible;
          }
          .print-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .receipt-modal {
            position: absolute;
            background: white;
            padding: 20px;
            left: 0;
            top: 0;
          }
          .receipt-action-buttons {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

// Styles object
const styles = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: '#f5f8fa',
    minHeight: '100vh'
  },
  dashboardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '15px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  headerLeft: {
    flex: '2'
  },
  headerRight: {
    flex: '1',
    textAlign: 'right'
  },
  title: {
    margin: '0',
    color: '#2c3e50',
    fontSize: '24px',
    fontWeight: '600'
  },
  clinicSubtitle: {
    margin: '5px 0 0',
    color: '#3498db',
    fontSize: '18px',
    fontWeight: '500'
  },
  dateDisplay: {
    margin: '0',
    fontSize: '16px',
    color: '#7f8c8d'
  },
  clinicStatus: {
    margin: '5px 0 0',
    fontSize: '16px'
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    flex: '1',
    minWidth: '200px',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center'
  },
  statIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#e3f2fd',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '15px'
  },
  icon: {
    fontSize: '24px'
  },
  statInfo: {
    flex: '1'
  },
  statValue: {
    display: 'block',
    fontSize: '24px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '5px'
  },
  statLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#7f8c8d'
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: {
    margin: '0',
    color: '#2c3e50',
    fontSize: '20px',
    fontWeight: '600'
  },
  searchContainer: {
    width: '300px',
    color: '#111112',
    
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    color: '#111112'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '1px solid #e0e0e0'
  },
  tableHeader: {
    backgroundColor: '#f2f6f9',
    padding: '12px 15px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#2c3e50',
    borderBottom: '2px solid #e0e0e0',
    cursor: 'pointer'
  },
  tableRow: {
    borderBottom: '1px solid #e0e0e0'
  },
  tableCell: {
    padding: '12px 15px',
    fontSize: '14px',
    color: '#4a4a4a'
  },
  tableCellActions: {
    padding: '12px 15px',
    display: 'flex',
    gap: '8px'
  },
  actionButton: {
    padding: '6px 12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500'
  },
  cancelButton: {
    padding: '6px 12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500'
  },
  confirmButton: {
    padding: '10px 15px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  modalOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000'
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '8px',
    width: '600px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  receiptContent: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '8px',
    width: '400px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalTitle: {
    margin: '0 0 20px',
    color: '#2c3e50',
    fontSize: '20px',
    fontWeight: '600',
    textAlign: 'center'
  },
  patientModalGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px'
  },
  patientDetailsSection: {
    borderRight: '1px solid #e0e0e0',
    paddingRight: '15px'
  },
  detailRow: {
    marginBottom: '10px'
  },
  detailLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#7f8c8d',
    marginBottom: '5px'
  },
  detailValue: {
    display: 'block',
    fontSize: '16px',
    color: '#2c3e50',
    fontWeight: '500'
  },
  feesSection: {
    paddingLeft: '15px'
  },
  feeInputRow: {
    marginBottom: '15px'
  },
  feeLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#7f8c8d',
    marginBottom: '5px'
  },
  feeInputContainer: {
    position: 'relative'
  },
  feeInput: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px'
  },
  totalRow: {
    marginTop: '20px',
    paddingTop: '10px',
    borderTop: '1px solid #e0e0e0'
  },
  totalLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  totalValue: {
    display: 'block',
    fontSize: '18px',
    fontWeight: '700',
    color: '#2c3e50',
    marginTop: '5px'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '20px'
  },
  receiptHeader: {
    textAlign: 'center',
    marginBottom: '15px'
  },
  clinicName: {
    fontSize: '22px',
    fontWeight: '700',
    margin: '0 0 5px',
    color: '#2c3e50'
  },
  clinicAddress: {
    margin: '0 0 3px',
    fontSize: '14px',
    color: '#7f8c8d'
  },
  clinicPhone: {
    margin: '0',
    fontSize: '14px',
    color: '#7f8c8d'
  },
  receiptDivider: {
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '15px 0'
  },
  receiptTitle: {
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 10px',
    color: '#2c3e50'
  },
  receiptDate: {
    textAlign: 'right',
    fontSize: '14px',
    margin: '0',
    color: '#7f8c8d'
  },
  receiptDetails: {
    marginBottom: '15px'
  },
  receiptRow: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '8px 0'
  },
  receiptLabel: {
    fontSize: '14px',
    color: '#7f8c8d',
    flex: '1'
  },
  receiptValue: {
    fontSize: '14px',
    color: '#2c3e50',
    fontWeight: '500',
    flex: '1',
    textAlign: 'right'
  },
  feeItem: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '8px 0'
  },
  feeAmount: {
    fontSize: '14px',
    color: '#2c3e50',
    fontWeight: '500'
  },
  feeTotalLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  feeTotalAmount: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2c3e50'
  },
  receiptFooter: {
    textAlign: 'center',
    marginTop: '20px'
  },
  footerText: {
    margin: '0 0 5px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#2c3e50'
  },
  footerSubtext: {
    margin: '0',
    fontSize: '12px',
    color: '#7f8c8d'
  },
  receiptActionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px'
  },
  closeReceiptButton: {
    padding: '8px 15px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  printReceiptButton: {
    padding: '8px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default ClinicalCenterDashboard;