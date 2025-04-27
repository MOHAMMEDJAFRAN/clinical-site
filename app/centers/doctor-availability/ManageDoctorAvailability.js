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
  const [showEditDoctorPopup, setShowEditDoctorPopup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [cityQuery, setCityQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  
  // State for shift times in update popup
  // const [shiftTimes, setShiftTimes] = useState([{ time: '', status: 'Available' }]);
  
  // Sample cities data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cities = [
    'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 
    'Trincomalee', 'Batticaloa', 'Anuradhapura', 'Ratnapura', 'Badulla',
    'Matara', 'Kurunegala', 'Nuwara Eliya', 'Kalmunai', 'Vavuniya','Akkaraipatru'
  ];
  
  // New doctor form state
  const [newDoctor, setNewDoctor] = useState({ 
    name: '', 
    gender: 'Male',
    photo: null,
    phoneNumber: '',
    email: '',
    city: '',
    clinicName: '',
    shiftTime1: '',
    shiftTime2: '',
    shiftTime3: '',
    status: 'Available'
  });
  
  // Edit doctor form state
  const [editDoctor, setEditDoctor] = useState(null);
  
  // Update availability state
  const [updatedAvailability, setUpdatedAvailability] = useState({
    doctorId: '',
    date: '',
    shifts: [
      { time: '', status: 'Available' },
      { time: '', status: 'Available' },
      { time: '', status: 'Available' }
    ]
  });

  // State for current clinic
  const [clinic, setClinic] = useState(currentClinic);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!clinic) {
      // Add some sample clinic data if currentClinic is not passed
      const sampleClinic = {
        name: 'Downtown Medical Center',
        id: 1,
      };
      setClinic(sampleClinic);
    }

    // Set today's date as default
    setSelectedDate(getTodayDate());

    const fetchData = async () => {
      const sampleDoctors = [
        { id: 1, name: 'Dr. John Doe', gender: 'Male', phoneNumber: '(123) 456-7890', email: 'john.doe@example.com', city: 'Kalmunai', clinicName: 'City Medical', shiftTime1: '9am to 12pm', shiftTime2: '2pm to 5pm', shiftTime3: '', status: 'Available', photo: null },
        { id: 2, name: 'Dr. Jane Smith', gender: 'Female', phoneNumber: '(234) 567-8901', email: 'jane.smith@example.com', city: 'Colombo', clinicName: 'Central Health', shiftTime1: '12pm to 5pm', shiftTime2: '', shiftTime3: '', status: 'Available', photo: null },
        { id: 3, name: 'Dr. Emily Johnson', gender: 'Female', phoneNumber: '(345) 678-9012', email: 'emily.johnson@example.com', city: 'galle', clinicName: 'West Coast Care', shiftTime1: '5pm to 9pm', shiftTime2: '', shiftTime3: '', status: 'Available', photo: null },
      ];

      const today = getTodayDate();
      const sampleAvailability = [
        { id: 1, doctorId: 1, date: today, shifts: [{ time: '9am to 12pm', status: '' }, { time: '2pm to 5pm', status: '                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ' }] },
        { id: 2, doctorId: 1, date: '2025-03-29', shifts: [{ time: '9am to 12pm', status: '' }] },
        { id: 3, doctorId: 2, date: today, shifts: [{ time: '12pm to 5pm', status: '' }] },
        { id: 4, doctorId: 3, date: today, shifts: [{ time: '5pm to 9pm', status: '' }] },
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
  }, [cities, cityQuery]);

  const handleStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return '#28a745'; // Green
      case 'Unavailable':
        return '#dc3545'; // Red
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
      gender: 'Male',
      photo: null,
      phoneNumber: '',
      email: '',
      city: '',
      clinicName: '',
      shiftTime1: '',
      shiftTime2: '',
      shiftTime3: '',
      status: 'Available'
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

  // Open edit doctor popup
  const handleOpenEditPopup = (doctor, e) => {
    e.stopPropagation();
    setSelectedDoctor(doctor);
    setEditDoctor({...doctor});
    setShowEditDoctorPopup(true);
  };

  // Save edited doctor
  const handleSaveEditedDoctor = (e) => {
    e.preventDefault();
    const updatedDoctors = doctors.map(doctor => 
      doctor.id === editDoctor.id ? editDoctor : doctor
    );
    setDoctors(updatedDoctors);
    setShowEditDoctorPopup(false);
  };

  // Open update availability popup
  const handleOpenUpdatePopup = (doctor) => {
    setSelectedDoctor(doctor);
    
    // Find doctor's availability for the selected date
    const doctorAvailability = availability.find(
      avail => avail.doctorId === doctor.id && avail.date === selectedDate
    );
    
    if (doctorAvailability) {
      // If doctor has availability for this date
      setUpdatedAvailability({
        doctorId: doctor.id,
        date: selectedDate,
        shifts: [...doctorAvailability.shifts]
      });
      
      // Make sure we have 3 shift slots available
      while (doctorAvailability.shifts.length < 3) {
        doctorAvailability.shifts.push({ time: '', status: 'Available' });
      }
    } else {
      // If no availability exists for this date, create new with empty shifts
      setUpdatedAvailability({
        doctorId: doctor.id,
        date: selectedDate,
        shifts: [
          { time: doctor.shiftTime1 || '', status: 'Available' },
          { time: doctor.shiftTime2 || '', status: 'Available' },
          { time: doctor.shiftTime3 || '', status: 'Available' }
        ]
      });
    }
    
    setShowUpdatePopup(true);
  };

  // Handle updating shift time
  const handleUpdateShiftTime = (index, field, value) => {
    const updatedShifts = [...updatedAvailability.shifts];
    updatedShifts[index] = {
      ...updatedShifts[index],
      [field]: value
    };
    
    setUpdatedAvailability({
      ...updatedAvailability,
      shifts: updatedShifts
    });
  };

  // Handle save updated availability
  const handleSaveAvailability = (e) => {
    e.preventDefault();
    
    // Filter out empty shift times
    const filteredShifts = updatedAvailability.shifts.filter(shift => shift.time.trim() !== '');
    
    if (filteredShifts.length === 0) {
      // If all shifts are empty, show an alert
      alert("Please enter at least one shift time");
      return;
    }
    
    // Check if doctor already has availability for this date
    const existingAvailIndex = availability.findIndex(
      avail => avail.doctorId === updatedAvailability.doctorId && avail.date === updatedAvailability.date
    );
    
    if (existingAvailIndex !== -1) {
      // Update existing availability
      const updatedAvailabilityList = [...availability];
      updatedAvailabilityList[existingAvailIndex] = {
        ...updatedAvailabilityList[existingAvailIndex],
        shifts: filteredShifts
      };
      setAvailability(updatedAvailabilityList);
    } else {
      // Add new availability
      const newAvailabilityEntry = {
        id: availability.length + 1,
        doctorId: updatedAvailability.doctorId,
        date: updatedAvailability.date,
        shifts: filteredShifts
      };
      setAvailability([...availability, newAvailabilityEntry]);
    }

    // Update doctor's default shift times
    const updatedDoctors = doctors.map(doctor => {
      if (doctor.id === updatedAvailability.doctorId) {
        return { 
          ...doctor, 
          shiftTime1: filteredShifts[0]?.time || '',
          shiftTime2: filteredShifts[1]?.time || '',
          shiftTime3: filteredShifts[2]?.time || ''
        };
      }
      return doctor;
    });
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
  const getAvailabilityForDate = (doctorId, date) => {
    return availability.find((avail) => avail.doctorId === doctorId && avail.date === date);
  };
  
  // Get all shift times for a doctor on a specific date
  const getDoctorShifts = (doctorId) => {
    const doctorAvailability = getAvailabilityForDate(doctorId, selectedDate);
    if (doctorAvailability) {
      return doctorAvailability.shifts;
    }
    
    // Return default shift times if no availability is set for the selected date
    const doctor = doctors.find(doc => doc.id === doctorId);
    const shifts = [];
    
    if (doctor) {
      if (doctor.shiftTime1) shifts.push({ time: doctor.shiftTime1, status: 'Available' });
      if (doctor.shiftTime2) shifts.push({ time: doctor.shiftTime2, status: 'Available' });
      if (doctor.shiftTime3) shifts.push({ time: doctor.shiftTime3, status: 'Available' });
    }
    
    return shifts;
  };
  
  // Render different views based on state
  if (showAddDoctorPage) {
    return (
      <div style={styles.wrapper}>
        <h1 style={styles.header}>Add New Doctor</h1>
        
        <div style={styles.availabilityForm}>
          <form onSubmit={handleAddDoctor} style={styles.form}>
            <div style={styles.photoUploadContainer}>
              {newDoctor.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={newDoctor.photo} alt="Doctor" style={styles.photoPreview} />
              ) : (
                <div style={styles.photoPlaceholder}>
                  <span style={styles.photoText}>Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={styles.fileInput}
                    id="photoUpload"
                  />
                  <label htmlFor="photoUpload" style={styles.uploadLabel}>
                    +
                  </label>
                </div>
              )}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Doctor Name:</label>
              <input
                type="text"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Gender:</label>
              <select
                value={newDoctor.gender}
                onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value })}
                style={styles.select}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone:</label>
              <input
                type="tel"
                value={newDoctor.phoneNumber}
                onChange={(e) => setNewDoctor({ ...newDoctor, phoneNumber: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Email: (optional)</label>
              <input
                type="email"
                value={newDoctor.email}
                onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>City:</label>
              <div style={styles.autocompleteContainer}>
                <input
                  type="text"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  onFocus={() => setShowCitySuggestions(true)}
                  style={styles.input}
                  required
                />
                {showCitySuggestions && filteredCities.length > 0 && (
                  <ul style={styles.suggestionsList}>
                    {filteredCities.map((city, index) => (
                      <li 
                        key={index} 
                        style={styles.suggestionItem}
                        onClick={() => handleSelectCity(city)}
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Clinic Name:</label>
              <input
                type="text"
                value={newDoctor.clinicName}
                onChange={(e) => setNewDoctor({ ...newDoctor, clinicName: e.target.value })}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Shift Time 1: (optional)</label>
              <input
                type="text"
                placeholder="e.g. 9am to 12pm"
                value={newDoctor.shiftTime1}
                onChange={(e) => setNewDoctor({ ...newDoctor, shiftTime1: e.target.value })}
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Shift Time 2: (optional)</label>
              <input
                type="text"
                placeholder="e.g. 1pm to 5pm"
                value={newDoctor.shiftTime2}
                onChange={(e) => setNewDoctor({ ...newDoctor, shiftTime2: e.target.value })}
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Shift Time 3: (optional)</label>
              <input
                type="text"
                placeholder="e.g. 6pm to 9pm"
                value={newDoctor.shiftTime3}
                onChange={(e) => setNewDoctor({ ...newDoctor, shiftTime3: e.target.value })}
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Status:</label>
              <select
                value={newDoctor.status}
                onChange={(e) => setNewDoctor({ ...newDoctor, status: e.target.value })}
                style={styles.select}
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
            
            <div style={styles.buttonContainer}>
              <button type="button" style={styles.cancelButton} onClick={() => setShowAddDoctorPage(false)}>
                Cancel
              </button>
              <button type="submit" style={styles.saveButton}>Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.header}>Manage Doctor Availability</h1>

      <div style={styles.searchFilterContainer}>
        <input
          type="text"
          placeholder="Search by doctor name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <button 
          onClick={() => setShowAddDoctorPage(true)} 
          style={styles.addDoctorButton}
        >
          Add New Doctor
        </button>
      </div>

      <div style={styles.dateFilterContainer}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.dateInput}
        />
      </div>

      <div style={styles.dashboardOverview}>
        <p style={styles.statText}><strong>Total Doctors: </strong>{filteredDoctors.length}</p>
        <p style={styles.statText}>
          <strong>Available Doctors for {selectedDate || 'Today'}: </strong>
          {filteredDoctors.filter((doctor) => {
            const doctorAvailability = getAvailabilityForDate(doctor.id, selectedDate);
            return doctorAvailability && doctorAvailability.shifts.some(shift => shift.status === 'Available');
          }).length}
        </p>
      </div>

      <div style={styles.grid}>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div 
              key={doctor.id} 
              style={styles.card} 
              onClick={() => handleOpenUpdatePopup(doctor)}
            >
              <div style={styles.doctorHeader}>
                {doctor.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={doctor.photo} alt={doctor.name} style={styles.doctorPhoto} />
                ) : (
                  <span role="img" aria-label="doctor" style={styles.icon}>
                    {doctor.gender === 'Female' ? '👩‍⚕️' : '👨‍⚕️'}
                  </span>
                )}
                <div style={styles.doctorInfo}>
                  <h2 style={styles.name}>{doctor.name}</h2>
                  <p style={styles.doctorDetails}>{doctor.city}</p>
                  <p style={styles.contactInfo}>{doctor.email}</p>
                </div>
              </div>

              <div style={styles.availabilitySection}>
                <h3 style={styles.availTitle}>Today Availability ({selectedDate || 'No date selected'})</h3>
                {getDoctorShifts(doctor.id).length > 0 ? (
                  getDoctorShifts(doctor.id).map((shift, idx) => (
                    <div key={idx} style={styles.slot}>
                      <p>
                        <strong>Shift {idx + 1}:</strong> {shift.time} -{' '}
                        <span style={{ color: handleStatusColor(shift.status), fontWeight: 'bold' }}>
                          {shift.status}
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={styles.noShifts}>No shifts scheduled for this day</p>
                )}
              </div>
              
              <div style={styles.buttonContainer}>
                <button 
                  onClick={(e) => handleOpenEditPopup(doctor, e)} 
                  style={styles.editButton}
                >
                  Edit Doctor
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenUpdatePopup(doctor);
                  }} 
                  style={styles.updateButton}
                >
                  Update Availability
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No doctors available at the moment.</p>
        )}
      </div>

      {/* Edit Doctor Popup */}
      {showEditDoctorPopup && editDoctor && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupContent}>
            <h3 style={styles.popupHeader}>
              Edit Doctor Information
            </h3>
            
            <form onSubmit={handleSaveEditedDoctor} style={styles.form}>
              <div style={styles.photoUploadContainer}>
                {editDoctor.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={editDoctor.photo} alt="Doctor" style={styles.photoPreview} />
                ) : (
                  <div style={styles.photoPlaceholder}>
                    <span style={styles.photoText}>Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setEditDoctor({
                            ...editDoctor,
                            photo: URL.createObjectURL(file)
                          });
                        }
                      }}
                      style={styles.fileInput}
                      id="editPhotoUpload"
                    />
                    <label htmlFor="editPhotoUpload" style={styles.uploadLabel}>
                      +
                    </label>
                  </div>
                )}
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Doctor Name:</label>
                <input
                  type="text"
                  value={editDoctor.name}
                  onChange={(e) => setEditDoctor({ ...editDoctor, name: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Gender:</label>
                <select
                  value={editDoctor.gender}
                  onChange={(e) => setEditDoctor({ ...editDoctor, gender: e.target.value })}
                  style={styles.select}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone:</label>
                <input
                  type="tel"
                  value={editDoctor.phoneNumber}
                  onChange={(e) => setEditDoctor({ ...editDoctor, phoneNumber: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Email:</label>
                <input
                  type="email"
                  value={editDoctor.email}
                  onChange={(e) => setEditDoctor({ ...editDoctor, email: e.target.value })}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>City:</label>
                <input
                  type="text"
                  value={editDoctor.city}
                  onChange={(e) => setEditDoctor({ ...editDoctor, city: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Clinic Name:</label>
                <input
                  type="text"
                  value={editDoctor.clinicName}
                  onChange={(e) => setEditDoctor({ ...editDoctor, clinicName: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.buttonContainer}>
                <button 
                  type="button" 
                  style={styles.cancelButton}
                  onClick={() => setShowEditDoctorPopup(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.saveButton}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Availability Popup */}
      {showUpdatePopup && selectedDoctor && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupContent}>
            <h3 style={styles.popupHeader}>
              Update Availability for {selectedDoctor.name}
            </h3>
            
            <form onSubmit={handleSaveAvailability} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Date</label>
                <input
                  type="date"
                  value={updatedAvailability.date}
                  onChange={(e) => setUpdatedAvailability({
                    ...updatedAvailability,
                    date: e.target.value
                  })}
                  style={styles.input}
                  required
                />
              </div>
              
              {updatedAvailability.shifts.map((shift, index) => (
                <div key={index} style={styles.shiftContainer}>
                  <h4 style={styles.shiftHeader}>Shift {index + 1}</h4>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Shift Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 9am to 12pm"
                      value={shift.time}
                      onChange={(e) => handleUpdateShiftTime(index, 'time', e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Status</label>
                    <select
                      value={shift.status}
                      onChange={(e) => handleUpdateShiftTime(index, 'status', e.target.value)}
                      style={styles.select}
                    >
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>
              ))}
              
              <div style={styles.buttonContainer}>
                <button 
                  type="button" 
                  style={styles.cancelButton}
                  onClick={() => setShowUpdatePopup(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.saveButton}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '12px',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
    maxWidth: '95%',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    color: '#1a202c',
    fontSize: '1.5rem',
    marginBottom: '15px',
    fontWeight: 'bold',
  },
  searchFilterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    flexWrap: 'wrap',
    gap: '8px'
  },
  // Continuing from where your code left off - completing the styles object:

    searchInput: {
      padding: '8px',
      width: '220px',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      backgroundColor: '#ffffff',
      border: '2px solid #e2e8f0',
      borderRadius: '4px',
      color:'#111112',

    },
    addDoctorButton: {
      backgroundColor: '#4299e1',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background-color 0.3s',
    },
    dateFilterContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
      marginBottom: '16px',

    },
    dateInput: {
      padding: '8px',
      border: '2px solid #e2e8f0',
      borderRadius: '4px',
      width: '220px',
      color:'#111112',

    },
    dashboardOverview: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      marginBottom: '20px',
      backgroundColor: '#f8fafc',
      padding: '12px',
      borderRadius: '6px',
      color:'#111112',
    },
    statText: {
      margin: '0',
      fontSize: '0.9rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '16px',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      border: '1px solid #e2e8f0',
      color:'#111112',

    },
    doctorHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
      color:'#111112',

    },
    doctorInfo: {
      marginLeft: '12px',
      flex: 1,
    },
    doctorPhoto: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    icon: {
      fontSize: '2rem',
      backgroundColor: '#e2e8f0',
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      color:'#111112',
    },
    name: {
      fontSize: '1.1rem',
      margin: '0 0 4px 0',
      fontWeight: 'bold',
      color:'#111112',
    },
    doctorDetails: {
      fontSize: '0.9rem',
      margin: '0 0 4px 0',
      color: '#4a5568',
    },
    contactInfo: {
      fontSize: '0.8rem',
      margin: '0',
      color: '#718096',
    },
    availabilitySection: {
      padding: '12px 0',
      borderTop: '1px solid #e2e8f0',
      borderBottom: '1px solid #e2e8f0',
      marginBottom: '12px',
    },
    availTitle: {
      fontSize: '0.9rem',
      fontWeight: 'bold',
      margin: '0 0 8px 0',
    },
    slot: {
      marginBottom: '6px',
    },
    noShifts: {
      fontStyle: 'italic',
      color: '#718096',
      fontSize: '0.9rem',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '12px',
      gap: '8px',
    },
    editButton: {
      backgroundColor: '#edf2f7',
      color: '#2d3748',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.8rem',
      flex: 1,
    },
    updateButton: {
      backgroundColor: '#4299e1',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.8rem',
      flex: 1,
    },
    popupOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
      color:'#111112',
    },
    popupContent: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflow: 'auto',
      color:'#111112',
    },
    popupHeader: {
      fontSize: '1.2rem',
      margin: '0 0 16px 0',
      textAlign: 'center',
      fontWeight: 'bold',
      color:'#111112',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    label: {
      fontSize: '0.9rem',
      fontWeight: 'bold',
      color: '#4a5568',
    },
    input: {
      padding: '8px',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
      fontSize: '0.9rem',
    },
    select: {
      padding: '8px',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
      fontSize: '0.9rem',
      backgroundColor: '#fff',
    },
    shiftContainer: {
      backgroundColor: '#f8fafc',
      padding: '12px',
      borderRadius: '6px',
      marginBottom: '12px',
    },
    shiftHeader: {
      fontSize: '0.9rem',
      margin: '0 0 8px 0',
    },
    cancelButton: {
      backgroundColor: '#edf2f7',
      color: '#4a5568',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      flex: 1,
    },
    saveButton: {
      backgroundColor: '#4299e1',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      flex: 1,
    },
    photoUploadContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '16px',
    },
    photoPlaceholder: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: '#f7fafc',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      border: '2px dashed #cbd5e0',
    },
    photoPreview: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    photoText: {
      fontSize: '0.8rem',
      color: '#718096',
    },
    fileInput: {
      display: 'none',
    },
    uploadLabel: {
      position: 'absolute',
      bottom: '0',
      right: '0',
      backgroundColor: '#4299e1',
      color: 'white',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 'bold',
    },
    autocompleteContainer: {
      position: 'relative',
    },
    suggestionsList: {
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      backgroundColor: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
      marginTop: '4px',
      padding: '0',
      maxHeight: '200px',
      overflowY: 'auto',
      zIndex: 10,
      listStyleType: 'none',
      color:'#111112',
    },
    suggestionItem: {
      padding: '8px',
      cursor: 'pointer',
      borderBottom: '1px solid #e2e8f0',
      transition: 'background-color 0.2s',
      color:'#111112',
    },
    availabilityForm: {
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      color:'#111112',
   
    }
  };


export default ManageDoctorAvailability;