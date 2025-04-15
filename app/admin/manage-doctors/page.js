'use client';  // Ensure this is included to mark the component as client-side

import React, { useState, useEffect } from 'react';
// import Header from '../components/Header'; 

// Manage Doctors Component
const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  // Sample doctor data for testing
  useEffect(() => {
    const fetchData = async () => {
      const sampleData = [
        { id: 1, specialization: 'Allergists/Immunologists', name: 'Vivek', status: 'Active' },
        { id: 2, specialization: 'Anesthesiologists', name: 'Sumanth Shetty', status: 'On Hold' },
        { id: 3, specialization: 'Cardiologists', name: 'Mohan', status: 'Active' },
        { id: 4, specialization: 'Critical Care Medicine Specialists', name: 'Baswaraj Biradar', status: 'Deactivated' },
        { id: 5, specialization: 'Dermatologists', name: 'Shilpa', status: 'Active' },
        { id: 6, specialization: 'Endocrinologists', name: 'Aditi Garg', status: 'On Hold' },
        { id: 7, specialization: 'Family Physicians', name: 'Archana S', status: 'Active' },
        { id: 8, specialization: 'Nephrologists', name: 'Santosh B S', status: 'Deactivated' },
        { id: 9, specialization: 'Neurologists', name: 'Chaitra Nayak', status: 'Active' },
        { id: 10, specialization: 'Dental Care', name: 'Karthik', status: 'Active' },
        { id: 11, specialization: 'ENT', name: 'M J Murali', status: 'On Hold' },
        { id: 12, specialization: 'Cardiologists', name: 'HIMAS', status: 'Active' }
      ];

      setDoctors(sampleData);
    };

    fetchData();
  }, []);

  const handleDelete = (id) => {
    setDoctors(doctors.filter(doctor => doctor.id !== id));
  };

  const handleUpdate = (id) => {
    alert(`Update doctor with ID: ${id}`);
  };

  const handleStatusChange = (id, status) => {
    setDoctors(doctors.map(doctor => 
      doctor.id === id ? { ...doctor, status } : doctor
    ));
  };

  return (
    <div style={doctorStyles.container}>
      {/* <Header /> */}
      <h1 style={doctorStyles.title}>Manage Doctors</h1>
      <div style={doctorStyles.tableContainer}>
        <table style={doctorStyles.table}>
          <thead style={doctorStyles.tableHeader}>
            <tr>
              <th>#</th>
              <th>Specialization</th>
              <th>Doctor Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={doctor.id} style={index % 2 === 0 ? doctorStyles.evenRow : doctorStyles.oddRow}>
                <td>{index + 1}</td>
                <td style={doctorStyles.specializationText}>{doctor.specialization}</td>
                <td>{doctor.name}</td>
                <td>
                  <select 
                    value={doctor.status} 
                    onChange={(e) => handleStatusChange(doctor.id, e.target.value)} 
                    style={doctorStyles.statusSelect}
                  >
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Deactivated">Deactivated</option>
                  </select>
                </td>
                <td>
                  <button 
                    style={{ ...doctorStyles.button, ...doctorStyles.updateBtn }} 
                    onClick={() => handleUpdate(doctor.id)}
                  >
                    Update
                  </button>
                  <button 
                    style={{ ...doctorStyles.button, ...doctorStyles.deleteBtn }} 
                    onClick={() => handleDelete(doctor.id)}
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

// Styles for Manage Doctors Page
const doctorStyles = {
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
    marginBottom: '20px', // Decreased margin for less space between title and table
    color: '#333333',
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '20px',
    color: '#555555',
  },
  tableContainer: {
    width: '100%',
    maxWidth: '100%', // Table will span the full width of the screen
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px', // Reduced space between title and table
    color: '#333333',
  },
  tableHeader: {
    backgroundColor: '#f4f4f4',
    textAlign: 'left',
    padding: '8px', // Reduced padding for a tighter table
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
  specializationText: {
    color: '#0066cc', // Styling specialization in blue
    fontWeight: 'bold', // Added bold font for better visibility
  },
  button: {
    padding: '8px 12px',
    margin: '5px',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    fontSize: '14px',
  },
  updateBtn: {
    backgroundColor: '#4CAF50', // Green for update
    color: 'white',
  },
  deleteBtn: {
    backgroundColor: '#f44336', // Red for delete
    color: 'white',
  },
  statusSelect: {
    padding: '5px 10px',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
  }
};

export default ManageDoctors;
