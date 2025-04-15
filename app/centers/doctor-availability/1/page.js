'use client';

import React, { useState, useEffect } from 'react';

const ManageDoctorAvailability = ({ currentClinic }) => {
  const [doctors, setDoctors] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showAddDoctorPage, setShowAddDoctorPage] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [cityQuery, setCityQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  
  // Sample cities data
  const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 
    'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Francisco',
    'Miami', 'Austin', 'Atlanta', 'Denver', 'Seattle'
  ];
  
  // New doctor form state
  const [newDoctor, setNewDoctor] = useState({ 
    name: '', 
    gender: '',
    photo: null,
    phoneNumber: '',
    email: '',
    city: '',
    shiftTime: ''
  });
  
  // Update availability state
  const [updatedAvailability, setUpdatedAvailability] = useState({
    doctorId: '',
    date: '',
    time: '',
    status: 'available'
  });

  // State for current clinic
  const [clinic, setClinic] = useState(currentClinic);

  useEffect(() => {
    if (!clinic) {
      // Add some sample clinic data if currentClinic is not passed
      const sampleClinic = {
        name: 'Downtown Medical Center',
        id: 1,
      };
      setClinic(sampleClinic);
    }

    const fetchData = async () => {
      const sampleDoctors = [
        { id: 1, name: 'Dr. John Doe', gender: 'Male', phoneNumber: '(123) 456-7890', email: 'john.doe@example.com', city: 'New York', shiftTime: '9am to 12pm', photo: null },
        { id: 2, name: 'Dr. Jane Smith', gender: 'Female', phoneNumber: '(234) 567-8901', email: 'jane.smith@example.com', city: 'Chicago', shiftTime: '12pm to 5pm', photo: null },
        { id: 3, name: 'Dr. Emily Johnson', gender: 'Female', phoneNumber: '(345) 678-9012', email: 'emily.johnson@example.com', city: 'Los Angeles', shiftTime: '5pm to 9pm', photo: null },
      ];

      const sampleAvailability = [
        { id: 1, doctorId: 1, date: '2025-03-28', time: '9am to 12pm', status: 'available' },
        { id: 2, doctorId: 1, date: '2025-03-29', time: '9am to 12pm', status: 'unavailable' },
        { id: 3, doctorId: 2, date: '2025-03-30', time: '12pm to 5pm', status: 'on hold' },
        { id: 4, doctorId: 3, date: '2025-03-31', time: '5pm to 9pm', status: 'available' },
      ];

      setDoctors(sampleDoctors);
      setAvailability(sampleAvailability);
    };

    fetchData();
  }, [clinic]);

  useEffect(() => {
    const filtered = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchQuery, doctors]);

  // City search functionality
  useEffect(() => {
    if (cityQuery) {
      const filtered = cities.filter(city => 
        city.toLowerCase().includes(cityQuery.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowCitySuggestions(true);
    } else {
      setFilteredCities([]);
      setShowCitySuggestions(false);
    }
  }, [cityQuery]);

  const handleStatusColor = (status) => {
    switch (status) {
      case 'available':
        return '#28a745'; // Green
      case 'unavailable':
        return '#dc3545'; // Red
      case 'on hold':
        return '#007bff'; // Blue
      default:
        return '#6c757d'; // Grey
    }
  };

  // Handle adding new doctor
  const handleAddDoctor = (e) => {
    e.preventDefault();
    const newDoctorEntry = {
      ...newDoctor,
      id: doctors.length + 1,
    };
    setDoctors((prevDoctors) => [...prevDoctors, newDoctorEntry]);
    setNewDoctor({ 
      name: '', 
      gender: '',
      photo: null,
      phoneNumber: '',
      email: '',
      city: '',
      shiftTime: ''
    }); // Reset doctor form
    setShowAddDoctorPage(false); // Return to main page
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real application, you would handle the file upload to a server
      // For this demo, we'll just store the file name
      setNewDoctor({
        ...newDoctor,
        photo: URL.createObjectURL(file)
      });
    }
  };

  // Open update popup
  const handleOpenUpdatePopup = (doctor) => {
    setSelectedDoctor(doctor);
    
    // Find doctor's availability
    const doctorAvailability = availability.find(avail => avail.doctorId === doctor.id);
    
    if (doctorAvailability) {
      setUpdatedAvailability({
        doctorId: doctor.id,
        date: doctorAvailability.date,
        time: doctorAvailability.time,
        status: doctorAvailability.status
      });
    } else {
      setUpdatedAvailability({
        doctorId: doctor.id,
        date: '',
        time: doctor.shiftTime || '',
        status: 'available'
      });
    }
    
    setShowUpdatePopup(true);
  };

  // Handle save updated availability
  const handleSaveAvailability = (e) => {
    e.preventDefault();
    
    // Check if doctor already has availability
    const existingAvailIndex = availability.findIndex(
      avail => avail.doctorId === updatedAvailability.doctorId && avail.date === updatedAvailability.date
    );
    
    if (existingAvailIndex !== -1) {
      // Update existing availability
      const updatedAvailabilityList = [...availability];
      updatedAvailabilityList[existingAvailIndex] = {
        ...updatedAvailabilityList[existingAvailIndex],
        time: updatedAvailability.time,
        status: updatedAvailability.status
      };
      setAvailability(updatedAvailabilityList);
    } else {
      // Add new availability
      const newAvailabilityEntry = {
        id: availability.length + 1,
        doctorId: updatedAvailability.doctorId,
        date: updatedAvailability.date,
        time: updatedAvailability.time,
        status: updatedAvailability.status
      };
      setAvailability([...availability, newAvailabilityEntry]);
    }

    // Update doctor's default shift time
    const updatedDoctors = doctors.map(doctor => 
      doctor.id === updatedAvailability.doctorId 
        ? { ...doctor, shiftTime: updatedAvailability.time }
        : doctor
    );
    setDoctors(updatedDoctors);
    
    setShowUpdatePopup(false);
  };

  // Select city from suggestions
  const handleSelectCity = (city) => {
    setNewDoctor({ ...newDoctor, city });
    setCityQuery(city);
    setShowCitySuggestions(false);
  };

  // Filter the availability by selected date
  const filterAvailabilityByDate = (doctorId) => {
    if (!selectedDate) return availability.filter((avail) => avail.doctorId === doctorId);
    return availability.filter((avail) => avail.doctorId === doctorId && avail.date === selectedDate);
  };
  
  // Render different views based on state
  if (showAddDoctorPage) {
    return (
      <div style={updatedStyles.wrapper}>
        <h1 style={updatedStyles.header}>Add New Doctor</h1>
        
        <div style={updatedStyles.availabilityForm}>
          <form onSubmit={handleAddDoctor} style={updatedStyles.form}>
            <div style={updatedStyles.formGroup}>
              <label style={updatedStyles.label}>Full Name</label>
              <input
                type="text"
                placeholder="Dr. Full Name"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                style={updatedStyles.input}
                required
              />
            </div>
            
            <div style={updatedStyles.formGroup}>
              <label style={updatedStyles.label}>Gender</label>
              <select
                value={newDoctor.gender}
                onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value })}
                style={updatedStyles.select}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div style={updatedStyles.formGroup}>
              <label style={updatedStyles.label}>Profile Photo (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={updatedStyles.fileInput}
              />
              {newDoctor.photo && (
                <div style={updatedStyles.previewContainer}>
                  <img 
                    src={newDoctor.photo} 
                    alt="Preview" 
                    style={updatedStyles.photoPreview} 
                  />
                </div>
              )}
            </div>
            
            <div style={updatedStyles.formGroup}>
              <label style={updatedStyles.label}>Phone Number</label>
              <input
                type="tel"
                placeholder="(123) 456-7890"
                value={newDoctor.phoneNumber}
                onChange={(e) => setNewDoctor({ ...newDoctor, phoneNumber: e.target.value })}
                style={updatedStyles.input}
                required
              />
            </div>
            
            <div style={updatedStyles.formGroup}>
              <label style={updatedStyles.label}>Email</label>
              <input
                type="email"
                placeholder="doctor@example.com"
                value={newDoctor.email}
                onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                style={updatedStyles.input}
                required
              />
            </div>
            
            <div style={updatedStyles.formGroup}>
              <label style={updatedStyles.label}>City</label>
              <div style={updatedStyles.autocompleteContainer}>
                <input
                  type="text"
                  placeholder="Enter city name"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  onFocus={() => setShowCitySuggestions(true)}
                  style={updatedStyles.input}
                  required
                />
                {showCitySuggestions && filteredCities.length > 0 && (
                  <ul style={updatedStyles.suggestionsList}>
                    {filteredCities.map((city, index) => (
                      <li 
                        key={index} 
                        style={updatedStyles.suggestionItem}
                        onClick={() => handleSelectCity(city)}
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div style={updatedStyles.formGroup}>
              <label style={updatedStyles.label}>Shift Time</label>
              <select
                value={newDoctor.shiftTime}
                onChange={(e) => setNewDoctor({ ...newDoctor, shiftTime: e.target.value })}
                style={updatedStyles.select}
                required
              >
                <option value="">Select Shift</option>
                <option value="9am to 12pm">Morning: 9am to 12pm</option>
                <option value="12pm to 5pm">Afternoon: 12pm to 5pm</option>
                <option value="5pm to 9pm">Evening: 5pm to 9pm</option>
              </select>
            </div>
            
            <div style={updatedStyles.buttonGroup}>
              <button type="button" style={updatedStyles.cancelButton} onClick={() => setShowAddDoctorPage(false)}>
                Cancel
              </button>
              <button type="submit" style={updatedStyles.button}>Add Doctor</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={updatedStyles.wrapper}>
      <h1 style={updatedStyles.header}>Manage Doctor Availability</h1>

      <div style={updatedStyles.searchFilterContainer}>
        <input
          type="text"
          placeholder="Search by doctor name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={updatedStyles.searchInput}
        />
        <button 
          onClick={() => setShowAddDoctorPage(true)} 
          style={updatedStyles.addDoctorButton}
        >
          Add New Doctor
        </button>
      </div>

      <div style={updatedStyles.dateFilterContainer}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={updatedStyles.dateInput}
        />
      </div>

      <div style={updatedStyles.dashboardOverview}>
        <p style={updatedStyles.statText}><strong>Total Doctors: </strong>{filteredDoctors.length}</p>
        <p style={updatedStyles.statText}>
          <strong>Available Slots: </strong>
          {filteredDoctors.filter((doctor) => 
            filterAvailabilityByDate(doctor.id).some((avail) => avail.status === 'available')
          ).length}
        </p>
      </div>

      <div style={updatedStyles.grid}>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div 
              key={doctor.id} 
              style={updatedStyles.card} 
              onClick={() => handleOpenUpdatePopup(doctor)}
            >
              <div style={updatedStyles.doctorHeader}>
                {doctor.photo ? (
                  <img src={doctor.photo} alt={doctor.name} style={updatedStyles.doctorPhoto} />
                ) : (
                  <span role="img" aria-label="doctor" style={updatedStyles.icon}>
                    {doctor.gender === 'Female' ? '👩‍⚕️' : '👨‍⚕️'}
                  </span>
                )}
                <div>
                  <h2 style={updatedStyles.name}>{doctor.name}</h2>
                  <p style={updatedStyles.doctorDetails}>{doctor.gender} • {doctor.city}</p>
                  <p style={updatedStyles.contactInfo}>
                    {doctor.phoneNumber} • {doctor.email}
                  </p>
                </div>
              </div>

              <div style={updatedStyles.availabilitySection}>
                <h3 style={updatedStyles.availTitle}>Availability</h3>
                <p style={updatedStyles.shiftTime}>
                  <strong>Default Shift:</strong> {doctor.shiftTime}
                </p>
                {filterAvailabilityByDate(doctor.id).map((slot, idx) => (
                  <div key={idx} style={updatedStyles.slot}>
                    <p>
                      <strong>{slot.date}:</strong> {slot.time} -{' '}
                      <span style={{ color: handleStatusColor(slot.status), fontWeight: 'bold' }}>
                        {slot.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenUpdatePopup(doctor);
                }} 
                style={updatedStyles.updateButton}
              >
                Update
              </button>
            </div>
          ))
        ) : (
          <p>No doctors available at the moment.</p>
        )}
      </div>

      {/* Update Availability Popup */}
      {showUpdatePopup && selectedDoctor && (
        <div style={updatedStyles.popupOverlay}>
          <div style={updatedStyles.popupContent}>
            <h3 style={updatedStyles.popupHeader}>
              Update Availability for {selectedDoctor.name}
            </h3>
            
            <form onSubmit={handleSaveAvailability} style={updatedStyles.form}>
              <div style={updatedStyles.formGroup}>
                <label style={updatedStyles.label}>Date</label>
                <input
                  type="date"
                  value={updatedAvailability.date}
                  onChange={(e) => setUpdatedAvailability({
                    ...updatedAvailability,
                    date: e.target.value
                  })}
                  style={updatedStyles.input}
                  required
                />
              </div>
              
              <div style={updatedStyles.formGroup}>
                <label style={updatedStyles.label}>Shift Time</label>
                <select
                  value={updatedAvailability.time}
                  onChange={(e) => setUpdatedAvailability({
                    ...updatedAvailability,
                    time: e.target.value
                  })}
                  style={updatedStyles.select}
                  required
                >
                  <option value="">Select Shift</option>
                  <option value="9am to 12pm">Morning: 9am to 12pm</option>
                  <option value="12pm to 5pm">Afternoon: 12pm to 5pm</option>
                  <option value="5pm to 9pm">Evening: 5pm to 9pm</option>
                </select>
              </div>
              
              <div style={updatedStyles.formGroup}>
                <label style={updatedStyles.label}>Status</label>
                <select
                  value={updatedAvailability.status}
                  onChange={(e) => setUpdatedAvailability({
                    ...updatedAvailability,
                    status: e.target.value
                  })}
                  style={updatedStyles.select}
                  required
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="on hold">On Hold</option>
                </select>
              </div>
              
              <div style={updatedStyles.buttonGroup}>
                <button 
                  type="button" 
                  style={updatedStyles.cancelButton}
                  onClick={() => setShowUpdatePopup(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={updatedStyles.button}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Updated styles with better visibility and contrast
const updatedStyles = {
  wrapper: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
  },
  header: {
    textAlign: 'center',
    color: '#1a202c',
    fontSize: '2.2rem',
    marginBottom: '30px',
    fontWeight: 'bold',
  },
  searchFilterContainer: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    width: '250px',
    fontSize: '1rem',
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
    border: '2px solid #4F959D',
    borderRadius: '5px',
    color: '#000000',
  },
  dateFilterContainer: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  dateInput: {
    padding: '10px',
    fontSize: '1rem',
    border: '2px solid #007bff',
    borderRadius: '5px',
    backgroundColor: '#ffffff',
    color: '#000000',
    fontWeight: 'bold',
  },
  addDoctorButton: {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  dashboardOverview: {
    textAlign: 'center',
    marginBottom: '30px',
    backgroundColor: '#e9ecef',
    padding: '15px',
    borderRadius: '8px',
  },
  statText: {
    fontSize: '1.2rem',
    color: '#212529',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '25px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    position: 'relative',
    border: '1px solid #dee2e6',
  },
  doctorHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    marginBottom: '15px',
  },
  icon: {
    fontSize: '40px',
  },
  doctorPhoto: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #007bff',
  },
  name: {
    margin: 0,
    fontSize: '1.4rem',
    color: '#1a202c',
    fontWeight: 'bold',
  },
  doctorDetails: {
    margin: '5px 0',
    color: '#212529',
    fontSize: '1rem',
    fontWeight: '500',
  },
  contactInfo: {
    margin: '5px 0',
    color: '#212529',
    fontSize: '0.9rem',
  },
  shiftTime: {
    margin: '8px 0',
    fontSize: '1rem',
    color: '#212529',
    fontWeight: '500',
  },
  availabilitySection: {
    marginTop: '15px',
    backgroundColor: '#f8f9fa',
    padding: '10px',
    borderRadius: '8px',
  },
  availTitle: {
    color: '#0056b3',
    fontSize: '1.1rem',
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  slot: {
    margin: '4px 0',
    fontSize: '1rem',
    color: '#212529',
  },
  updateButton: {
    position: 'absolute',
    bottom: '15px',
    right: '15px',
    padding: '8px 15px',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 'bold',
  },
  availabilityForm: {
    marginTop: '20px',
    padding: '25px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    border: '1px solid #dee2e6',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#212529',
  },
  input: {
    padding: '12px',
    fontSize: '1rem',
    border: '2px solid #ced4da',
    borderRadius: '5px',
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  select: {
    padding: '12px',
    fontSize: '1rem',
    border: '2px solid #ced4da',
    borderRadius: '5px',
    color: '#000000',
    backgroundColor: '#ffffff',
    appearance: 'menulist', // Shows the dropdown arrow
  },
  fileInput: {
    padding: '10px 0',
    fontSize: '1rem',
    color: '#212529',
  },
  previewContainer: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
  },
  photoPreview: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '50%',
    border: '2px solid #007bff',
  },
  autocompleteContainer: {
    position: 'relative',
  },
  suggestionsList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: '200px',
    overflowY: 'auto',
    backgroundColor: '#fff',
    borderRadius: '0 0 5px 5px',
    border: '1px solid #ced4da',
    zIndex: 10,
    listStyle: 'none',
    padding: 0,
    margin: 0,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  suggestionItem: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    color: '#212529',
    fontWeight: '500',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    marginTop: '15px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    flex: 1,
  },
  cancelButton: {
    padding: '12px',
    backgroundColor: '#6c757d',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    flex: 1,
  },
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popupContent: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  },
  popupHeader: {
    fontSize: '1.5rem',
    color: '#1a202c',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
};

export default ManageDoctorAvailability;