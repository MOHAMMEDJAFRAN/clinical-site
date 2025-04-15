'use client';

import React, { useState } from 'react';
// import Header from '../../components/Header'; 

const AddDoctorDashboard = () => {
  const [doctorData, setDoctorData] = useState({
    specialization: '',
    name: '',
    clinicAddress: '',
    contactNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
  });

  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isCityInputFocused, setIsCityInputFocused] = useState(false);

  // Mock list of cities for demonstration
  const cityList = [
    'Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna', 'Matara', 'Batticaloa',
    'Kurunegala', 'Anuradhapura', 'Trincomalee'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({ ...doctorData, [name]: value });

    // For city field, filter the city names based on the input
    if (name === 'city') {
      const filteredCities = cityList.filter((city) =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setCitySuggestions(filteredCities);
    }
  };

  const handleCitySelect = (city) => {
    setDoctorData({ ...doctorData, city }); // Set the city when a suggestion is clicked
    setCitySuggestions([]); // Clear the suggestions
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Doctor added successfully!');
  };

  return (
    <div style={styles.container}>
      {/* <Header /> */}
      
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Add Doctor</h1>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Specialization</label>
            <select
              name="specialization"
              value={doctorData.specialization}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Select Specialization</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Orthopedic">Orthopedic</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={doctorData.name}
              onChange={handleChange}
              placeholder="Enter Name"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Clinic Address</label>
            <input
              type="text"
              name="clinicAddress"
              value={doctorData.clinicAddress}
              onChange={handleChange}
              placeholder="Enter Clinic Address"
              style={styles.input}
              required
            />
          </div>

          {/* City Input with Suggestions */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>City</label>
            <input
              type="text"
              name="city"
              value={doctorData.city}
              onChange={handleChange}
              onFocus={() => setIsCityInputFocused(true)}
              onBlur={() => setIsCityInputFocused(false)}
              placeholder="Enter City"
              style={styles.input}
              required
            />
            {isCityInputFocused && citySuggestions.length > 0 && (
              <div style={styles.suggestionsContainer}>
                {citySuggestions.map((city, index) => (
                  <div
                    key={index}
                    style={styles.suggestionItem}
                    onClick={() => handleCitySelect(city)} // When clicked, fill the city in the input box
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contact No</label>
            <input
              type="tel"
              name="contactNumber"
              value={doctorData.contactNumber}
              onChange={handleChange}
              placeholder="Enter Contact No"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={doctorData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.submitButton}>Submit</button>
        </form>
      </div>
    </div>
  );
};

// Styles for Add Doctor Dashboard with enhanced visibility
const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '30px',
    width: '100%',
    maxWidth: '800px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    fontSize: '1rem',
    marginBottom: '8px',
    color: '#333333', // Dark label color for better contrast
  },
  input: {
    width: '100%',
    padding: '12px', // Increased padding for better visibility
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '10px',
    color: '#333333', // Dark text color for inputs
    backgroundColor: '#f1f1f1', // Lighter background for inputs
  },
  submitButton: {
    padding: '12px 20px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  suggestionsContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '6px',
    width: '100%',
    maxHeight: '150px',
    overflowY: 'auto',
    zIndex: 100,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  suggestionItem: {
    padding: '8px 12px',
    cursor: 'pointer',
    backgroundColor: '#f9f9f9',
    fontWeight: 'bold',  // Make the text bold for better visibility
    color: '#333333',   // Darker text color
  },
   
  suggestionItemHover: {
    backgroundColor: '#e8f4fd',
  },
};

export default AddDoctorDashboard;
