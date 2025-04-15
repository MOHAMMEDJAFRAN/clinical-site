'use client';

import React, { useState, useEffect } from 'react';

const ManageAppointmentsReport = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Sample appointment data
  useEffect(() => {
    const fetchData = async () => {
      const sampleAppointments = [
        { id: 1, doctorName: 'Dr. John Doe', patientName: 'Alice', patientContact: '123-456-7890', patientGender: 'Female', appointmentDate: '2025-03-26', time: '08:00 AM', status: 'Ongoing' },
        { id: 2, doctorName: 'Dr. Jane Smith', patientName: 'Bob', patientContact: '987-654-3210', patientGender: 'Male', appointmentDate: '2025-03-26', time: '09:00 AM', status: 'Completed' },
        { id: 3, doctorName: 'Dr. Mohan', patientName: 'Charlie', patientContact: '654-321-0987', patientGender: 'Male', appointmentDate: '2025-03-26', time: '10:00 AM', status: 'Cancelled' },
        { id: 4, doctorName: 'Dr. Shilpa', patientName: 'David', patientContact: '321-654-9870', patientGender: 'Male', appointmentDate: '2025-03-27', time: '11:00 AM', status: 'Ongoing' },
        { id: 5, doctorName: 'Dr. Archana', patientName: 'Eva', patientContact: '765-432-1098', patientGender: 'Female', appointmentDate: '2025-03-27', time: '02:00 PM', status: 'Completed' }
      ];
      setAppointments(sampleAppointments);
      setFilteredAppointments(sampleAppointments);
    };
    fetchData();
  }, []);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    filterAppointments(e.target.value, endDate, statusFilter);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    filterAppointments(startDate, e.target.value, statusFilter);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    filterAppointments(startDate, endDate, e.target.value);
  };

  const filterAppointments = (start, end, status) => {
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

    setFilteredAppointments(filtered);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Appointments Report</h1>

      {/* Date Range Filter */}
      <div style={styles.filtersContainer}>
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          style={styles.dateInput}
        />
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          style={styles.dateInput}
        />
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          style={styles.statusSelect}
        >
          <option value="">All Status</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Date Range Heading */}
      <div style={styles.reportHeadingContainer}>
        <h2 style={styles.reportHeading}>
          {startDate && endDate ? `Report from ${startDate} to ${endDate}` : 'Select Date Range'}
        </h2>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th>#</th>
              <th>Doctor Name</th>
              <th>Patient Name</th>
              <th>Patient Contact</th>
              <th>Patient Gender</th>
              <th>Appointment Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment, index) => (
              <tr key={appointment.id} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                <td>{index + 1}</td>
                <td>{appointment.doctorName}</td>
                <td>{appointment.patientName}</td>
                <td>{appointment.patientContact}</td>
                <td>{appointment.patientGender}</td>
                <td>{appointment.appointmentDate}</td>
                <td>{appointment.time}</td>
                <td>
                  <span style={appointment.status === 'Ongoing' ? styles.ongoing : 
                               appointment.status === 'Completed' ? styles.completed : 
                               appointment.status === 'Cancelled' ? styles.cancelled : styles.defaultStatus}>
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
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333333',
  },
  filtersContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px', // Added more space between the filter inputs
    marginBottom: '20px',
  },
  dateInput: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#e7f3ff', // Background color for date inputs
    color: 'black', // Black text color for date input
  },
  statusSelect: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    color: 'black', // Set dropdown text color to black
  },
  reportHeadingContainer: {
    marginBottom: '20px',
  },
  reportHeading: {
    fontSize: '1.6rem',
    color: 'black',  // Set heading text color to black
    fontWeight: '600',
  },
  tableContainer: {
    width: '100%',
    maxWidth: '100%',
    overflowX: 'auto',
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    color: '#333333',
  },
  tableHeader: {
    backgroundColor: '#f4f4f4',
    textAlign: 'left',
    padding: '12px', // Increased padding for better spacing
    color: '#333333',
    fontWeight: 'bold',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
    color: '#333333',
  },
  oddRow: {
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  ongoing: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '5px 10px',
    borderRadius: '5px',
  },
  completed: {
    backgroundColor: '#cce5ff',
    color: '#004085',
    padding: '5px 10px',
    borderRadius: '5px',
  },
  cancelled: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '5px 10px',
    borderRadius: '5px',
  },
  defaultStatus: {
    padding: '5px 10px',
    borderRadius: '5px',
    backgroundColor: '#e0e0e0',
    color: '#333',
  },
};

export default ManageAppointmentsReport;
