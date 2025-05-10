'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AddDoctorForm from '../../components/AddDoctorform';
import EditDoctorForm from '../../components/EditDoctorForm';
import UpdateAvailabilityForm from '../../components/UpdateAvailabilityForm';
import AddShiftForm from '../../components/addShift';
import { doctorService } from '../../services/doctorService';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const ManageDoctorAvailability = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showAddDoctorPage, setShowAddDoctorPage] = useState(false);
  const [showEditDoctorPopup, setShowEditDoctorPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showAddShiftPopup, setShowAddShiftPopup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showAllSchedulesPopup, setShowAllSchedulesPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clinic, setClinic] = useState(null);
  const [selectedShiftDate, setSelectedShiftDate] = useState('');

  const cities = [
    'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo',
    'Trincomalee', 'Batticaloa', 'Anuradhapura', 'Ratnapura', 'Badulla',
    'Matara', 'Kurunegala', 'Nuwara Eliya', 'Kalmunai', 'Vavuniya', 'Akkaraipatru'
  ];

  const getClinicData = useCallback(() => {
    try {
      const profileData = localStorage.getItem('profileData');
      if (!profileData) return null;
      
      const parsedData = JSON.parse(profileData);
      return {
        id: parsedData.id || parsedData._id,
        name: parsedData.clinicName,
        address: parsedData.address,
        isApproved: parsedData.isApproved
      };
    } catch (err) {
      console.error('Error parsing clinic data:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    const clinicData = getClinicData();
    
    if (!clinicData) {
      toast.error('Please login to access this page');
      router.push('/login');
      return;
    }

    if (!clinicData.isApproved) {
      toast.error('Your clinic is not yet approved');
      router.push('/pending-approval');
      return;
    }

    setClinic(clinicData);
    setSelectedDate(getTodayDate());
    setSelectedShiftDate(getTodayDate());
  }, [getClinicData, router]);

  useEffect(() => {
    if (!clinic?.id) return;
    fetchDoctors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinic?.id]);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchDoctors = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: doctorsData } = await doctorService.getDoctorsByClinic(clinic.id);
      setDoctors(doctorsData);
      
      const today = getTodayDate();
      const availabilityData = await Promise.all(
        doctorsData.map(async doctor => {
          try {
            const { data: availability } = await doctorService.getDoctorAvailability(doctor._id, today);
            return {
              id: `${doctor._id}-${today}`,
              doctorId: doctor._id,
              date: today,
              shifts: availability.shifts?.map(s => s.timeRange) || [],
              status: availability.doctorStatus || 'Unavailable'
            };
          } catch (err) {
            console.error(`Error fetching availability for doctor ${doctor._id}:`, err);
            return {
              id: `${doctor._id}-${today}`,
              doctorId: doctor._id,
              date: today,
              shifts: [],
              status: 'Unavailable'
            };
          }
        })
      );
      
      setAvailability(availabilityData);
    } catch (err) {
      setError(err.message || 'Failed to fetch doctors');
      console.error('Error fetching doctors:', err);
      
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchQuery, doctors]);

  const handleStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'text-green-600 font-bold';
      case 'Unavailable': return 'text-red-600 font-bold';
      default: return 'text-gray-600 font-bold';
    }
  };

  const handleAddDoctor = async (newDoctor) => {
    try {
      setIsLoading(true);
      const { data } = await doctorService.createDoctor(clinic.id, {
        ...newDoctor,
        clinicName: clinic.name,
        status: 'Available'
      });
      
      setDoctors(prev => [...prev, data]);
      setAvailability(prev => [
        ...prev,
        {
          id: `${data._id}-${selectedDate}`,
          doctorId: data._id,
          date: selectedDate,
          shifts: [],
          status: 'Available'
        }
      ]);
      
      setShowAddDoctorPage(false);
      toast.success('Doctor added successfully!');
    } catch (err) {
      setError(err.message || 'Failed to add doctor');
      toast.error(err.message || 'Failed to add doctor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEditedDoctor = async (editedDoctor) => {
    try {
      setIsLoading(true);
      const { data } = await doctorService.updateDoctor(editedDoctor._id, editedDoctor);
      
      setDoctors(prev => prev.map(d => d._id === editedDoctor._id ? data : d));
      setShowEditDoctorPopup(false);
      toast.success('Doctor updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update doctor');
      toast.error(err.message || 'Failed to update doctor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddShifts = async (newShifts) => {
    try {
      setIsLoading(true);
      
      const formattedShifts = newShifts.map((shift, index) => ({
        shiftName: shift.shiftName || `Shift ${index + 1}`,
        timeRange: shift.timeRange,
        date: selectedShiftDate,
        status: 'Available',
        isActive: true
      }));

      await doctorService.addDoctorShifts(
        selectedDoctor._id,
        formattedShifts
      );

      const existingAvailability = getAvailabilityForDate(selectedDoctor._id, selectedShiftDate);
      
      setAvailability(prev => {
        const newAvailability = {
          id: `${selectedDoctor._id}-${selectedShiftDate}`,
          doctorId: selectedDoctor._id,
          date: selectedShiftDate,
          shifts: [
            ...(existingAvailability?.shifts || []),
            ...formattedShifts.map(s => s.timeRange)
          ],
          status: 'Available'
        };

        if (existingAvailability) {
          return prev.map(a => 
            a.id === existingAvailability.id ? newAvailability : a
          );
        }
        
        return [...prev, newAvailability];
      });

      setShowAddShiftPopup(false);
      toast.success('Shifts added successfully!');
    } catch (err) {
      setError(err.message || 'Failed to add shifts');
      toast.error(err.message || 'Failed to add shifts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAvailability = async (updatedAvailability) => {
    try {
      setIsLoading(true);
      
      const formattedShifts = updatedAvailability.shifts
        .filter(shift => shift.trim())
        .map((shift, index) => ({
          shiftName: `Shift ${index + 1}`,
          timeRange: shift,
          date: updatedAvailability.date,
          status: updatedAvailability.status,
          isActive: true
        }));

      await doctorService.updateDoctorStatusAndShifts(
        updatedAvailability.doctorId,
        updatedAvailability.status,
        formattedShifts,
        updatedAvailability.date
      );

      setAvailability(prev => {
        const newAvailability = {
          id: `${updatedAvailability.doctorId}-${updatedAvailability.date}`,
          doctorId: updatedAvailability.doctorId,
          date: updatedAvailability.date,
          shifts: updatedAvailability.shifts.filter(s => s.trim()),
          status: updatedAvailability.status
        };

        const existingIndex = prev.findIndex(a => 
          a?.doctorId === updatedAvailability.doctorId && 
          a?.date === updatedAvailability.date
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newAvailability;
          return updated;
        }
        
        return [...prev, newAvailability];
      });

      setShowUpdatePopup(false);
      toast.success('Availability updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update availability');
      toast.error(err.message || 'Failed to update availability');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    
    try {
      setIsLoading(true);
      await doctorService.deleteDoctor(doctorId);
      
      setDoctors(prev => prev.filter(d => d._id !== doctorId));
      setAvailability(prev => prev.filter(a => a.doctorId !== doctorId));
      toast.success('Doctor deleted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to delete doctor');
      toast.error(err.message || 'Failed to delete doctor');
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailabilityForDate = (doctorId, date) => {
    if (!Array.isArray(availability)) return null;
    return availability.find(a => a?.doctorId === doctorId && a?.date === date) || null;
  };

  const getDoctorShifts = (doctorId) => {
    const availability = getAvailabilityForDate(doctorId, selectedDate);
    return availability?.shifts || [];
  };

  const getDoctorStatus = (doctorId) => {
    const availability = getAvailabilityForDate(doctorId, selectedDate);
    return availability?.status || 'Unavailable';
  };

  const getDoctorSchedules = (doctorId) => {
    if (!Array.isArray(availability)) return [];
    return availability.filter(a => a?.doctorId === doctorId);
  };

  const handleOpenEditPopup = (doctor, e) => {
    e?.stopPropagation();
    setSelectedDoctor(doctor);
    setShowEditDoctorPopup(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOpenUpdatePopup = (doctor) => {
    const existingAvailability = getAvailabilityForDate(doctor._id, selectedDate);
    
    setSelectedDoctor({
      ...doctor,
      availability: existingAvailability || {
        doctorId: doctor._id,
        date: selectedDate,
        shifts: [],
        status: doctor.status || 'Available'
      }
    });
    setShowUpdatePopup(true);
  };

  const handleOpenAddShiftPopup = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedShiftDate(selectedDate);
    setShowAddShiftPopup(true);
  };

  const handleViewAllSchedules = async (doctor, e) => {
    e?.stopPropagation();
    setSelectedDoctor(doctor);
    
    try {
      setIsLoading(true);
      const { data } = await doctorService.getDoctorShifts(doctor._id);
      
      const scheduleMap = data.reduce((acc, shift) => {
        if (!acc[shift.date]) {
          acc[shift.date] = {
            id: shift._id,
            doctorId: shift.doctor,
            date: shift.date,
            shifts: [],
            status: shift.status
          };
        }
        acc[shift.date].shifts.push(shift.timeRange);
        return acc;
      }, {});
      
      const schedules = Object.values(scheduleMap);
      
      setAvailability(prev => [
        ...prev.filter(a => a.doctorId !== doctor._id),
        ...schedules
      ]);
      
      setShowAllSchedulesPopup(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch schedules');
      toast.error(err.message || 'Failed to fetch schedules');
    } finally {
      setIsLoading(false);
    }
  };

  if (!clinic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (showAddDoctorPage) {
    return (
      <AddDoctorForm
        onAddDoctor={handleAddDoctor}
        onCancel={() => setShowAddDoctorPage(false)}
        cities={cities}
        isLoading={isLoading}
        error={error}
        clinicName={clinic.name}
      />
    );
  }

  return (
    <div className="p-4 bg-white min-h-screen max-w-6xl mx-auto">
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">
        {clinic.name} - Doctor Management
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg flex items-center">
            <Loader2 className="animate-spin h-8 w-8 mr-3 text-blue-500" />
            <p>Loading...</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by doctor name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border-2 border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
        />
        <button
          onClick={() => setShowAddDoctorPage(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition whitespace-nowrap"
          disabled={isLoading}
        >
          Add New Doctor
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border-2 border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
          min={getTodayDate()}
        />
      </div>

      <div className="flex text-blue-500 flex-wrap gap-5 mb-6 bg-gray-50 p-3 rounded-lg">
        <p className="text-sm">
          <strong>Total Doctors: </strong>{filteredDoctors.length}
        </p>
        <p className="text-sm">
          <strong>Available Today: </strong>
          {filteredDoctors.filter(d => getDoctorStatus(d._id) === 'Available').length}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map(doctor => (
            <div 
              key={doctor._id}
              className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex items-center mb-3">
                {doctor.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={doctor.photo} 
                    alt={doctor.name} 
                    className="w-12 h-12 rounded-full object-cover" 
                  />
                ) : (
                  <span className="text-2xl bg-gray-100 w-12 h-12 flex items-center justify-center rounded-full">
                    {doctor.gender === 'Female' ? '👩‍⚕️' : '👨‍⚕️'}
                  </span>
                )}
                <div className="ml-3">
                  <h2 className="font-bold text-gray-800">{doctor.name}</h2>
                  <p className="text-sm text-gray-600">{doctor.specialization || 'General Practitioner'}</p>
                  <p className="text-xs text-gray-500">{doctor.email}</p>
                </div>
              </div>

              <div className="py-3 border-t border-b border-gray-200 my-3">
                <h3 className="text-sm text-gray-700 font-semibold mb-2">
                  Availability ({selectedDate})
                </h3>
                <p className={`text-sm mb-2 ${handleStatusColor(getDoctorStatus(doctor._id))}`}>
                  <strong>Status:</strong> {getDoctorStatus(doctor._id)}
                </p>
                {getDoctorShifts(doctor._id).length > 0 ? (
                  getDoctorShifts(doctor._id).map((timeRange, idx) => (
                    <p key={idx} className="text-sm text-gray-500">
                      <strong>Shift {idx + 1}:</strong> {timeRange}
                    </p>
                  ))
                ) : (
                  <p className="text-sm italic text-gray-500">No shifts scheduled</p>
                )}
              </div>

              <div className="flex space-x-2 mt-3">
                <button
                  onClick={(e) => handleOpenEditPopup(doctor, e)}
                  className="flex-1 bg-gray-100 text-gray-800 py-1 px-2 rounded text-sm hover:bg-gray-200 transition"
                  disabled={isLoading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleOpenAddShiftPopup(doctor)}
                  className="flex-1 bg-green-500 text-white py-1 px-2 rounded text-sm hover:bg-green-600 transition"
                  disabled={isLoading}
                >
                  Add Shifts
                </button>
              </div>
              
              <div className="flex space-x-2 mt-2">
                {/* <button
                  onClick={() => handleOpenUpdatePopup(doctor)}
                  className="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-sm hover:bg-blue-600 transition"
                  disabled={isLoading}
                >
                  Availability
                </button> */}
                <button
                  onClick={(e) => handleViewAllSchedules(doctor, e)}
                  className="flex-1 bg-gray-100 text-gray-800 py-1 px-2 rounded text-sm hover:bg-gray-200 transition"
                  disabled={isLoading}
                >
                  View Schedules
                </button>
              </div>

              <div className="flex mt-2">
                <button
                  onClick={() => handleDeleteDoctor(doctor._id)}
                  className="flex-1 bg-red-100 text-red-600 py-1 px-2 rounded text-sm hover:bg-red-200 transition"
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center py-8">
            {doctors.length === 0 ? 'No doctors found' : 'No matching doctors'}
          </p>
        )}
      </div>

      {showEditDoctorPopup && selectedDoctor && (
        <EditDoctorForm
          doctor={selectedDoctor}
          onSave={handleSaveEditedDoctor}
          onCancel={() => setShowEditDoctorPopup(false)}
          cities={cities}
          isLoading={isLoading}
          error={error}
        />
      )}

      {showUpdatePopup && selectedDoctor && (
        <UpdateAvailabilityForm
          doctor={selectedDoctor}
          selectedDate={selectedDate}
          availability={selectedDoctor.availability}
          onSave={handleSaveAvailability}
          onCancel={() => setShowUpdatePopup(false)}
          isLoading={isLoading}
          error={error}
        />
      )}

      {showAddShiftPopup && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Add Shifts for {selectedDoctor.name}
            </h2>
            
            <AddShiftForm 
              doctor={selectedDoctor}
              selectedDate={selectedShiftDate}
              onDateChange={setSelectedShiftDate}
              onSave={handleAddShifts}
              onCancel={() => setShowAddShiftPopup(false)}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      )}

      {showAllSchedulesPopup && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-black">
              Schedules for {selectedDoctor.name}
            </h2>
            
            <div className="space-y-4">
              {getDoctorSchedules(selectedDoctor._id).length > 0 ? (
                getDoctorSchedules(selectedDoctor._id).map(schedule => (
                  <div key={schedule.id} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-semibold text-black">
                      {new Date(schedule.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    
                    <div className="mt-2 space-y-1">
                      {schedule.shifts.map((timeRange, idx) => (
                        <p key={idx} className="text-black">
                          <span className="font-medium">Shift {idx + 1}:</span> {timeRange}
                        </p>
                      ))}
                    </div>
                    
                    <p className="mt-2 text-black">
                      <span className="font-medium">Status:</span> {' '}
                      <span className={`${handleStatusColor(schedule.status)}`}>
                        {schedule.status}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No schedules found</p>
              )}
            </div>
            
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowAllSchedulesPopup(false)}
                className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300 transition"
                disabled={isLoading}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctorAvailability;