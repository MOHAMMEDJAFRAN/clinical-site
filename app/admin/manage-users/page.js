'use client';  // Ensure this is included to mark the component as client-side

import React, { useState, useEffect } from 'react';
// import Header from '../components/Header'; 

// View Users Component
const ViewUsers = () => {
  const [users, setUsers] = useState([]);

  // Sample user data for testing
  useEffect(() => {
    const fetchData = async () => {
      const sampleData = [
        { id: 1, name: 'Prashanth', address: 'as', city: 'as', gender: 'male', email: 'Prashanth@gmail.com', createdAt: '2024-01-23 20:23:36', updatedAt: '2024-01-28 07:28:18' },
        { id: 2, name: 'Anjan', address: 'bangalore', city: 'bangalore', gender: 'male', email: 'anjan@gmail.com', createdAt: '2024-01-26 07:17:23', updatedAt: '2024-01-28 07:28:23' },
        { id: 3, name: 'Varsha', address: 'Mysore', city: 'Mydore', gender: 'female', email: 'varsha@gmail.com', createdAt: '2024-01-26 07:20:53', updatedAt: '2024-01-28 07:28:28' },
        { id: 4, name: 'Pranitha', address: '82 old post office bangalore', city: 'bangalore', gender: 'female', email: 'pranitha@gmail.com', createdAt: '2024-01-26 07:25:15', updatedAt: '2024-01-28 07:28:18' },
        { id: 5, name: 'Girish', address: 'Mysore', city: 'Mysore', gender: 'male', email: 'girish@gmail.com', createdAt: '2024-01-26 07:27:23', updatedAt: '2024-01-28 07:28:28' },
        { id: 6, name: 'Divya', address: 'bangalore', city: 'bangalore', gender: 'female', email: 'divya@gmail.com', createdAt: '2024-03-01 08:04:09', updatedAt: '2024-03-01 08:04:09' }
      ];

      setUsers(sampleData);
    };

    fetchData();
  }, []);

  // const handleDelete = (id) => {
  //   setUsers(users.filter(user => user.id !== id));
  // };

  // const handleUpdate = (id) => {
  //   alert(`Update user with ID: ${id}`);
  // };

  return (
    <div style={viewStyles.container}>
      {/* <Header /> */}
      <h1 style={viewStyles.title}>Manage Users</h1>
      <div style={viewStyles.tableContainer}>
        <table style={viewStyles.table}>
          <thead style={viewStyles.tableHeader}>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Address</th>
              <th>City</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Creation Date</th>
              <th>Update Date</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} style={index % 2 === 0 ? viewStyles.evenRow : viewStyles.oddRow}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.address}</td>
                <td>{user.city}</td>
                <td>{user.gender}</td>
                <td>{user.email}</td>
                <td>{user.createdAt}</td>
                <td>{user.updatedAt}</td>
                {/* <td>
                  <button style={{ ...viewStyles.button, ...viewStyles.updateBtn }} onClick={() => handleUpdate(user.id)}>Update</button>
                  <button style={{ ...viewStyles.button, ...viewStyles.deleteBtn }} onClick={() => handleDelete(user.id)}>Delete</button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles for View Users Page
const viewStyles = {
  container: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '30px', // Increased padding for more spacing
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '2.5rem', // Increased font size
    marginBottom: '20px', // Increased margin bottom for more space
    color: '#333333',
  },
  tableContainer: {
    width: '100%',
    maxWidth: '100%',
    overflowX: 'auto',
    marginTop: '20px', // Added margin top for better spacing
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '30px', // Increased margin to space the table from the title
    color: '#333333',
  },
  tableHeader: {
    backgroundColor: '#f4f4f4',
    textAlign: 'left',
    padding: '15px', // Increased padding in header for better spacing
    color: '#333333',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
    color: '#333333',
    
  },
  oddRow: {
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  button: {
    padding: '10px 16px', // Increased padding for buttons
    margin: '8px', // Increased margin between buttons
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
};

export default ViewUsers;
