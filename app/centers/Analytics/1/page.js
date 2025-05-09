'use client';

import React, { useState, useEffect } from 'react';

const ManageAppointmentsReport = () => {
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

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Sample appointment data
  useEffect(() => {
    const fetchData = async () => {
      const sampleAppointments = [
        { id: 1, doctorName: 'Dr. John Doe', patientName: 'Alice', patientContact: '123-456-7890', patientGender: 'Female', appointmentDate: '2025-04-21', shiftTime: '08:00 AM to 11:30 AM', status: 'Confirm' },
        { id: 2, doctorName: 'Dr. Jane Smith', patientName: 'Bob', patientContact: '987-654-3210', patientGender: 'Male', appointmentDate: '2025-04-21', shiftTime: '08:00 AM to 11:30 AM', status: 'Complete' },
        { id: 3, doctorName: 'Dr. Mohan', patientName: 'Charlie', patientContact: '654-321-0987', patientGender: 'Male', appointmentDate: '2025-04-21', shiftTime: '12:30 PM to 4:30 PM', status: 'Cancel' },
        { id: 4, doctorName: 'Dr. Shilpa', patientName: 'David', patientContact: '321-654-9870', patientGender: 'Male', appointmentDate: '2025-04-22', shiftTime: '08:00 AM to 11:30 AM', status: 'Confirm' },
        { id: 5, doctorName: 'Dr. Archana', patientName: 'Eva', patientContact: '765-432-1098', patientGender: 'Female', appointmentDate: '2025-04-22', shiftTime: '06:00 PM to 11:30 PM', status: 'Complete' },
        { id: 6, doctorName: 'Dr. Sahan', patientName: 'Frank', patientContact: '765-432-1098', patientGender: 'Male', appointmentDate: '2025-04-23', shiftTime: '08:00 AM to 11:30 AM', status: 'Confirm' },
        { id: 7, doctorName: 'Dr. Himas', patientName: 'Gloria', patientContact: '765-432-1098', patientGender: 'Female', appointmentDate: '2025-04-24', shiftTime: '12:30 PM to 4:30 PM', status: 'Confirm' }
      ];
      
      setAppointments(sampleAppointments);
      setFilteredAppointments(sampleAppointments);
      
      // Calculate dashboard metrics
      updateDashboardMetrics(sampleAppointments);
      
      // Extract unique doctor names for the doctor filter
      const uniqueDoctors = [...new Set(sampleAppointments.map(app => app.doctorName))];
      setDoctorsList(uniqueDoctors);
    };
    fetchData();
  }, []);

  const updateDashboardMetrics = (appointmentsData) => {
    // Count total appointments
    setTotalAppointments(appointmentsData.length);
    
    // Count complete appointments
    const completeCount = appointmentsData.filter(app => app.status === 'Complete').length;
    setCompleteAppointments(completeCount);
    
    // Count confirm appointments
    const confirmCount = appointmentsData.filter(app => app.status === 'Confirm').length;
    setConfirmAppointments(confirmCount);
    
    // Count cancel appointments
    const cancelCount = appointmentsData.filter(app => app.status === 'Cancel').length;
    setCancelAppointments(cancelCount);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    filterAppointments(e.target.value, endDate, statusFilter, doctorFilter);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    filterAppointments(startDate, e.target.value, statusFilter, doctorFilter);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    filterAppointments(startDate, endDate, e.target.value, doctorFilter);
  };

  const handleDoctorChange = (e) => {
    setDoctorFilter(e.target.value);
    filterAppointments(startDate, endDate, statusFilter, e.target.value);
  };

  const filterAppointments = (start, end, status, doctor) => {
    let filtered = appointments;

    if (start && end) {
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate >= new Date(start) && appointmentDate <= new Date(end);
      });
    }

    if (status) {
      filtered = filtered.filter(appointment => appointment.status === status);
    }

    if (doctor) {
      filtered = filtered.filter(appointment => appointment.doctorName === doctor);
    }

    setFilteredAppointments(filtered);
    
    // Update dashboard metrics based on filtered data
    updateDashboardMetrics(filtered);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={styles.container}>
      <div style={styles.reportHeader}>
        <h2 style={styles.reportTitle}>Appointments Report</h2>
        <div style={styles.currentTime}>
          Current Time: {currentTime.toLocaleTimeString()}
        </div>
      </div>

      {/* Dashboard Metrics */}
      <div style={styles.metricsContainer}>
        <div style={styles.metricCard}>
          <div style={styles.metricIconTotal}>👥</div>
          <div style={styles.metricContent}>
            <h2 style={styles.metricNumber}>{totalAppointments}</h2>
            <p style={styles.metricLabel}>All Appointments</p>
          </div>
        </div>
        
        <div style={styles.metricCard}>
          <div style={styles.metricIconConfirm}>⏳</div>
          <div style={styles.metricContent}>
            <h2 style={styles.metricNumber}>{confirmAppointments}</h2>
            <p style={styles.metricLabel}>Confirm Appointments</p>
          </div>
        </div>
        
        <div style={styles.metricCard}>
          <div style={styles.metricIconComplete}>✓</div>
          <div style={styles.metricContent}>
            <h2 style={styles.metricNumber}>{completeAppointments}</h2>
            <p style={styles.metricLabel}>Complete Appointments</p>
          </div>
        </div>
        
        <div style={styles.metricCard}>
          <div style={styles.metricIconCancel}>✗</div>
          <div style={styles.metricContent}>
            <h2 style={styles.metricNumber}>{cancelAppointments}</h2>
            <p style={styles.metricLabel}>Cancel Appointments</p>
          </div>
        </div>
      </div>
      
      {/* Date Range Heading */}
      <div style={styles.reportHeadingContainer}>
        <h2 style={styles.reportHeading}>
          {startDate && endDate ? `Report from ${formatDate(startDate)} to ${formatDate(endDate)}` : 'Select Date Range'}
        </h2>
      </div>

      {/* Filters Container */}
      <div style={styles.filtersContainer}>
        <div style={styles.dateRangeSection}>
          <label style={styles.dateLabel}>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            style={styles.dateInput}
          />
        </div>
        <div style={styles.dateRangeSection}>
          <label style={styles.dateLabel}>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            style={styles.dateInput}
          />
        </div>
        <div style={styles.statusSection}>
          <label style={styles.dateLabel}>Status:</label>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            style={styles.statusSelect}
          >
            <option value="">All Status</option>
            <option value="Confirm">Confirm</option>
            <option value="Complete">Complete</option>
            <option value="Cancel">Cancel</option>
          </select>
        </div>
        <div style={styles.statusSection}>
          <label style={styles.dateLabel}>Doctor:</label>
          <select
            value={doctorFilter}
            onChange={handleDoctorChange}
            style={styles.statusSelect}
          >
            <option value="">All Doctors</option>
            {doctorsList.map((doctor, index) => (
              <option key={index} value={doctor}>{doctor}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Doctor Name</th>
              <th style={styles.th}>Patient Name</th>
              <th style={styles.th}>Patient Contact</th>
              <th style={styles.th}>Patient Gender</th>
              <th style={styles.th}>Appointment Date</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody style={styles.tableBody}>
            {filteredAppointments.map((appointment, index) => (
              <tr key={appointment.id} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{appointment.doctorName}</td>
                <td style={styles.td}>{appointment.patientName}</td>
                <td style={styles.td}>{appointment.patientContact}</td>
                <td style={styles.td}>{appointment.patientGender}</td>
                <td style={styles.td}>{appointment.appointmentDate}</td>
                <td style={styles.td}>{appointment.shiftTime}</td>
                <td style={styles.td}>
                  <span style={appointment.status === 'Confirm' ? styles.confirm : 
                               appointment.status === 'Complete' ? styles.complete : 
                               appointment.status === 'Cancel' ? styles.cancel : styles.defaultStatus}>
                    {appointment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    fontFamily: 'Arial, sans-serif',
  },
  clinicHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    width: '100%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    marginRight: '15px',
    cursor: 'pointer',
    color: '#333',
  },
  clinicTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  clinicCender: {
    color: '#666',
    fontSize: '16px',
  },
  cender: {
    color: '#333',
    fontSize: '16px',
  },
  profileIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '20px',
  },
  dashboardHeader: {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    margin: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  dashboardTitleSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  dashboardTitle: {
    margin: 0,
    fontSize: '24px',
    color: '#333',
    fontWeight: '600',
  },
  currentDate: {
    margin: 0,
    color: '#666',
    fontSize: '16px',
  },
  clinicDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clinicName: {
    color: '#4a90e2',
    fontSize: '16px',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  statusLabel: {
    color: '#666',
  },
  activeStatus: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  metricsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 20px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  metricCard: {
    flex: '1',
    minWidth: '200px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  metricIconTotal: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#e6f0ff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    color: '#4a90e2',
  },
  metricIconConfirm: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#fff8e6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    color: '#faad14',
  },
  metricIconComplete: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#e6ffe6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    color: '#52c41a',
  },
  metricIconCancel: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#fff1f0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    color: '#f5222d',
  },
  metricContent: {
    flex: 1,
  },
  metricNumber: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  },
  metricLabel: {
    margin: '5px 0 0 0',
    color: '#666',
    fontSize: '14px',
  },
  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    marginBottom: '20px',
    marginTop: '20px',
  },
  reportTitle: {
    margin: 0,
    fontSize: '22px',
    color: '#333',
    fontWeight: '600',
  },
  currentTime: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#4a90e2',
    backgroundColor: '#e7f3ff',
    padding: '8px 15px',
    borderRadius: '5px',
  },
  filtersContainer: {
    display: 'flex',
    padding: '0 20px',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  dateRangeSection: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '200px',
  },
  statusSection: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '200px',
  },
  dateLabel: {
    marginBottom: '5px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
  },
  dateInput: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#e7f3ff',
    color: 'black',
  },
  statusSelect: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    color: 'black',
  },
  reportHeadingContainer: {
    padding: '0 20px',
    marginBottom: '20px',
  },
  reportHeading: {
    fontSize: '18px',
    color: '#333',
    fontWeight: '600',
    margin: 0,
  },
  tableContainer: {
    margin: '0 20px 20px',
    maxWidth: 'calc(100% - 40px)',
    overflowX: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxHeight: '500px',
    overflowY: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    color: '#333333',
    fontSize: '16px',
  },
  tableHeader: {
    backgroundColor: '#f4f4f4',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    color: '#333333',
    fontWeight: 'bold',
    borderBottom: '2px solid #ddd',
  },
  td: {
    padding: '15px',
    borderBottom: '1px solid #ddd',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  confirm: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '5px 10px',
    borderRadius: '5px',
    display: 'inline-block',
  },
  complete: {
    backgroundColor: '#cce5ff',
    color: '#004085',
    padding: '5px 10px',
    borderRadius: '5px',
    display: 'inline-block',
  },
  cancel: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '5px 10px',
    borderRadius: '5px',
    display: 'inline-block',
  },
  defaultStatus: {
    padding: '5px 10px',
    borderRadius: '5px',
    backgroundColor: '#e0e0e0',
    color: '#333',
    display: 'inline-block',
  }
};

export default ManageAppointmentsReport;