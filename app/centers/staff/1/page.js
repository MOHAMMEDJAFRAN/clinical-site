'use client';  // Mark the component as client-side

import React, { useState } from 'react';

// Sample Staff Data
const staffData = [
  { id: 1, name: 'Dr. John Doe', role: 'Doctor Incharge', contact: '123-456-7890', email: 'john.doe@example.com' },
  { id: 2, name: 'Dr. Jane Smith', role: 'Doctor', contact: '123-456-7891', email: 'jane.smith@example.com' },
  { id: 3, name: 'Mark Johnson', role: 'Other Staff', contact: '123-456-7892', email: 'mark.johnson@example.com' },
  { id: 4, name: 'Dr. Emily Davis', role: 'Doctor Incharge', contact: '123-456-7893', email: 'emily.davis@example.com' },
  { id: 5, name: 'Sarah Lee', role: 'Other Staff', contact: '123-456-7894', email: 'sarah.lee@example.com' },
];

const StaffDashboard = () => {
  const [staffType, setStaffType] = useState('all'); // State to filter staff
  const [filteredStaff, setFilteredStaff] = useState(staffData); // State to hold filtered staff

  // Handle change in dropdown
  const handleStaffTypeChange = (e) => {
    const selectedStaffType = e.target.value;
    setStaffType(selectedStaffType);

    if (selectedStaffType === 'all') {
      setFilteredStaff(staffData); // Show all staff
    } else {
      setFilteredStaff(staffData.filter(staff => staff.role === selectedStaffType)); // Filter by role
    }
  };

  return (
    <div style={dashboardStyles.container}>
      <h1 style={dashboardStyles.title}>Staff Dashboard</h1>

      {/* Dropdown to filter staff */}
      <div style={dashboardStyles.filterContainer}>
        <label style={dashboardStyles.filterLabel}>Filter by Role: </label>
        <select style={dashboardStyles.filterSelect} value={staffType} onChange={handleStaffTypeChange}>
          <option value="all">All Staff</option>
          <option value="Doctor Incharge">Doctor Incharge</option>
          <option value="Doctor">Doctor</option>
          <option value="Other Staff">Other Staff</option>
        </select>
      </div>

      {/* Staff Table */}
      <div style={dashboardStyles.tableContainer}>
        <table style={dashboardStyles.table}>
          <thead style={dashboardStyles.tableHeader}>
            <tr>
              <th style={dashboardStyles.tableHeaderCell}>#</th>
              <th style={dashboardStyles.tableHeaderCell}>Name</th>
              <th style={dashboardStyles.tableHeaderCell}>Role</th>
              <th style={dashboardStyles.tableHeaderCell}>Contact</th>
              <th style={dashboardStyles.tableHeaderCell}>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff, index) => (
              <tr key={staff.id} style={index % 2 === 0 ? dashboardStyles.evenRow : dashboardStyles.oddRow}>
                <td style={dashboardStyles.tableCell}>{index + 1}</td>
                <td style={dashboardStyles.tableCell}>{staff.name}</td>
                <td style={dashboardStyles.tableCell}>{staff.role}</td>
                <td style={dashboardStyles.tableCell}>{staff.contact}</td>
                <td style={dashboardStyles.tableCell}>{staff.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles for Staff Dashboard
const dashboardStyles = {
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
};

export default StaffDashboard;
