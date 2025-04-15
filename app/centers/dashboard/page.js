'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header'; // ✅ Import Header component

const ClinicalCenterDashboard = () => {
  const [, setCenters] = useState([]);
  const [currentClinic, setCurrentClinic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loggedInClinicId = 1;

    const sampleData = [
      { id: 1, name: 'Downtown Medical Center', location: 'Kandy', type: 'Hospital', status: 'Active', contactEmail: 'downtown@medical.com', openTime: '08:00 AM', closeTime: '06:00 PM' },
      { id: 2, name: 'Westside Clinic', location: 'Ampara', type: 'Clinic', status: 'Active', contactEmail: 'west@clinic.com', openTime: '09:00 AM', closeTime: '05:00 PM' },
      { id: 3, name: 'Southgate Health Center', location: 'Colombo', type: 'Health Center', status: 'Inactive', contactEmail: 'south@health.com', openTime: '10:00 AM', closeTime: '04:00 PM' },
      { id: 4, name: 'Eastern Medical Facility', location: 'Galle', type: 'Hospital', status: 'Active', contactEmail: 'eastern@medical.com', openTime: '07:00 AM', closeTime: '07:00 PM' }
    ];

    const loggedInClinic = sampleData.find(center => center.id === loggedInClinicId);
    setCenters(sampleData);
    setCurrentClinic(loggedInClinic);
  }, []);

  const doctors = [
    { id: 'doctor-1', name: 'Dr. Perera', city: 'Colombo' },
    { id: 'doctor-2', name: 'Dr. Fernando', city: 'Kandy' },
    { id: 'doctor-3', name: 'Dr. Gunawardena', city: 'Galle' }
  ];

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <Header /> {/* ✅ Header component added here */}

      {/* 1. Doctor Appointment Cards */}
      <div style={{ width: '100%', maxWidth: '1300px' }}>
        <h1 style={styles.title}>Appointments by Doctor</h1>

        <input
          type="text"
          placeholder="Search Doctor or City..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <div style={styles.cardGrid}>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <div key={doctor.id} style={styles.doctorCard}>
                <h3 style={styles.doctorName}>{doctor.name}</h3>
                <p style={styles.doctorCity}>City: {doctor.city}</p>
                <Link href={`/centers/appointment-history/${doctor.id}`} style={styles.viewButton}>
                  View Appointments →
                </Link>
              </div>
            ))
          ) : (
            <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No matching doctors found.</p>
          )}
        </div>
      </div>

      {/* 2. Clinic Dashboard Section */}
      {currentClinic ? (
        <div style={{ width: '100%', maxWidth: '1300px', marginTop: '60px' }}>
          <h1 style={styles.title}>Welcome to {currentClinic.name} Dashboard</h1>
          <div style={styles.dashboardContainer}>
            <div style={styles.dashboardCard}>
              <div style={styles.cardIcon}>👨‍⚕️</div>
              <h2 style={styles.cardTitle}>Manage Doctor Availability</h2>
              <p style={styles.cardSubtitle}>Manage availability for doctors at {currentClinic.name}.</p>
              <a href={`/centers/doctor-availability/${currentClinic.id}`} style={styles.cardLink}>View Availability →</a>
            </div>

            <div style={styles.dashboardCard}>
              <div style={styles.cardIcon}>👥</div>
              <h2 style={styles.cardTitle}>Manage Staff</h2>
              <p style={styles.cardSubtitle}>Manage medical staff and administrators at {currentClinic.name}.</p>
              <a href={`/centers/staff/${currentClinic.id}`} style={styles.cardLink}>View Staff →</a>
            </div>

            <div style={styles.dashboardCard}>
              <div style={styles.cardIcon}>📊</div>
              <h2 style={styles.cardTitle}>Analytics</h2>
              <p style={styles.cardSubtitle}>View performance metrics and reports for {currentClinic.name}.</p>
              <a href={`/centers/analytics/${currentClinic.id}`} style={styles.cardLink}>View Reports →</a>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading Clinic Dashboard...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#ffffff', // ✅ changed to white
    minHeight: '100vh',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#000000', // ✅ bold and visible
    textAlign: 'left',
    fontWeight: 'bold',
  },
  searchInput: {
    width: '100%',
    maxWidth: '400px',
    padding: '12px 18px',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#000',
    border: '1px solid #ccc',
    borderRadius: '6px',
    marginBottom: '30px',
    backgroundColor: '#fff',
  },
  cardGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'flex-start',
  },
  doctorCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    width: '280px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  doctorName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#000',
    marginBottom: '10px',
  },
  doctorCity: {
    fontSize: '1rem',
    color: '#333',
    marginBottom: '15px',
  },
  viewButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    textDecoration: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  dashboardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '30px',
    justifyContent: 'flex-start',
    marginTop: '30px',
  },
  dashboardCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '30px',
    width: '280px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  cardIcon: {
    fontSize: '32px',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#000',
    margin: '0 0 10px 0',
  },
  cardSubtitle: {
    fontSize: '1rem',
    color: '#555',
    margin: '0 0 20px 0',
  },
  cardLink: {
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '1rem',
    marginTop: 'auto',
    fontWeight: 'bold',
  },
};

export default ClinicalCenterDashboard;
