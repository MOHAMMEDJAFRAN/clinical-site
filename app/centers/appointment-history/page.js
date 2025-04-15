'use client';  // Mark the component as client-side

import React, { useState, useEffect } from 'react';
import Header from '../components/Header'; // Import Header Component

// Appointments Dashboard Component
const AppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState(''); // State for the date filter

  // Sample appointment data for testing
  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, []);

  // Filter appointments based on status and date
  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesDate = filterDate === '' || appointment.date === filterDate;
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

  // Get status badge style based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return appointmentStyles.confirmedBadge;
      case 'pending':
        return appointmentStyles.pendingBadge;
      case 'cancelled':
        return appointmentStyles.cancelledBadge;
      default:
        return {};
    }
  };

  return (
    <div style={appointmentStyles.container}>
      <Header />
      <h1 style={appointmentStyles.title}>Appointments Dashboard</h1>
      
      <div style={appointmentStyles.filterContainer}>
        <label style={appointmentStyles.filterLabel}>Filter by Status: </label>
        <select 
          style={appointmentStyles.filterSelect}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Appointments</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        <label style={appointmentStyles.filterLabel}>Filter by Date: </label>
        <input 
          type="date"
          style={appointmentStyles.filterSelect}
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>
      
      <div style={appointmentStyles.stats}>
        <div style={appointmentStyles.statCard}>
          <h3 style={appointmentStyles.statTitle}>Total</h3>
          <p style={appointmentStyles.statNumber}>{appointments.length}</p>
        </div>
        <div style={appointmentStyles.statCard}>
          <h3 style={appointmentStyles.statTitle}>Confirmed</h3>
          <p style={appointmentStyles.statNumber}>{appointments.filter(a => a.status === 'confirmed').length}</p>
        </div>
        <div style={appointmentStyles.statCard}>
          <h3 style={appointmentStyles.statTitle}>Pending</h3>
          <p style={appointmentStyles.statNumber}>{appointments.filter(a => a.status === 'pending').length}</p>
        </div>
        <div style={appointmentStyles.statCard}>
          <h3 style={appointmentStyles.statTitle}>Cancelled</h3>
          <p style={appointmentStyles.statNumber}>{appointments.filter(a => a.status === 'cancelled').length}</p>
        </div>
      </div>
      
      <div style={appointmentStyles.tableContainer}>
        <table style={appointmentStyles.table}>
          <thead style={appointmentStyles.tableHeader}>
            <tr>
              <th style={appointmentStyles.tableHeaderCell}>#</th>
              <th style={appointmentStyles.tableHeaderCell}>Patient Name</th>
              <th style={appointmentStyles.tableHeaderCell}>Doctor</th>
              <th style={appointmentStyles.tableHeaderCell}>Specialization</th>
              <th style={appointmentStyles.tableHeaderCell}>Date</th>
              <th style={appointmentStyles.tableHeaderCell}>Time</th>
              <th style={appointmentStyles.tableHeaderCell}>Status</th>
              <th style={appointmentStyles.tableHeaderCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment, index) => (
              <tr key={appointment.id} style={index % 2 === 0 ? appointmentStyles.evenRow : appointmentStyles.oddRow}>
                <td style={appointmentStyles.tableCell}>{index + 1}</td>
                <td style={appointmentStyles.tableCell}>{appointment.patientName}</td>
                <td style={appointmentStyles.tableCell}>{appointment.doctorName}</td>
                <td style={appointmentStyles.specializationText}>{appointment.specialization}</td>
                <td style={appointmentStyles.tableCell}>{appointment.date}</td>
                <td style={appointmentStyles.tableCell}>{appointment.time}</td>
                <td style={appointmentStyles.tableCell}>
                  <span style={getStatusBadge(appointment.status)}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </td>
                <td style={appointmentStyles.tableCell}>
                  <select 
                    style={appointmentStyles.statusSelect}
                    value={appointment.status}
                    onChange={(e) => handleUpdateStatus(appointment.id, e.target.value)}
                  >
                    <option value="confirmed">Confirm</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancel</option>
                  </select>
                  <button 
                    style={appointmentStyles.button} 
                    onClick={() => handleDelete(appointment.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles for Appointments Dashboard with improved contrast
const appointmentStyles = {
  container: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: '20px',
    color: '#222222',
    fontWeight: '700',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    width: '100%',
    maxWidth: '1200px',
  },
  filterLabel: {
    marginRight: '10px',
    fontWeight: 'bold',
    color: '#222222',
    fontSize: '1rem',
  },
  filterSelect: {
    padding: '8px 12px',
    borderRadius: '5px',
    border: '1px solid #999999',
    backgroundColor: '#ffffff',
    color: '#222222',
    fontSize: '1rem',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1200px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#f5f5f5',
    padding: '18px',
    borderRadius: '8px',
    width: '22%',
    textAlign: 'center',
    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0',
  },
  statTitle: {
    margin: '0 0 10px 0',
    color: '#222222',
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1a1a1a',
    margin: '0',
  },
  tableContainer: {
    width: '100%',
    maxWidth: '1200px',
    overflowX: 'auto',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    color: '#222222',
    border: '1px solid #e0e0e0',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    borderBottom: '2px solid #cccccc',
  },
  tableHeaderCell: {
    padding: '12px 15px',
    textAlign: 'left',
    color: '#222222',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  tableCell: {
    padding: '12px 15px',
    fontSize: '0.95rem',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  specializationText: {
    color: '#0055aa',
    fontWeight: '500',
    padding: '12px 15px',
    fontSize: '0.95rem',
  },
  button: {
    padding: '8px 15px',
    margin: '5px',
    border: 'none',
    backgroundColor: '#0066cc',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '5px',
    fontSize: '0.9rem',
    fontWeight: '500',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  statusSelect: {
    padding: '7px 10px',
    borderRadius: '4px',
    border: '1px solid #999999',
    marginRight: '5px',
    backgroundColor: '#ffffff',
    color: '#222222',
    fontSize: '0.9rem',
  },
  confirmedBadge: {
    backgroundColor: '#1e7e34',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  pendingBadge: {
    backgroundColor: '#d39e00',
    color: '#222222',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  cancelledBadge: {
    backgroundColor: '#c82333',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
};

export default AppointmentsDashboard;
