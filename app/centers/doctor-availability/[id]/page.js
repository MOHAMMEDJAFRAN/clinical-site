'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AddDoctorForm from '../../components/AddDoctorform';
import EditDoctorForm from '../../components/EditDoctorForm';
import AddShiftForm from '../../components/addShift';
import { doctorService } from '../../services/doctorService';
import { toast } from 'react-hot-toast';
import { 
  Loader2, 
  PlusCircle, 
  RefreshCw, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Stethoscope, 
  X, 
  Check, 
  ChevronLeft,
  Frown,
  Smile,
  Zap,
  Search,
  AlertCircle
} from 'lucide-react';

const ManageDoctorAvailability = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showAddDoctorPage, setShowAddDoctorPage] = useState(false);
  const [showEditDoctorPopup, setShowEditDoctorPopup] = useState(false);
  const [showAddShiftPopup, setShowAddShiftPopup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showAllSchedulesPopup, setShowAllSchedulesPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [clinic, setClinic] = useState(null);
  const [selectedShiftDate, setSelectedShiftDate] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [scheduleFilterDate, setScheduleFilterDate] = useState('');
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showDeleteShiftConfirmation, setShowDeleteShiftConfirmation] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState(null);

  const cities = [
    'Colombo', 'Dehiwala-Mount Lavinia', 'Moratuwa', 'Sri Jayawardenepura Kotte',
    'Negombo', 'Kandy', 'Kalmunai', 'Vavuniya', 'Galle', 'Trincomalee',
    'Batticaloa', 'Jaffna', 'Matale', 'Katunayake', 'Dambulla', 'Kolonnawa',
    'Anuradhapura', 'Ratnapura', 'Badulla', 'Matara', 'Kurunegala',
    'Nuwara Eliya', 'Kalutara', 'Beruwala', 'Embilipitiya', 'Mannar',
    'Point Pedro', 'Puttalam', 'Chavakachcheri', 'Kattankudy', 'Gampaha',
    'Gampola', 'Valvettithurai', 'Weligama', 'Ampara', 'Kegalle', 'Hatton',
    'Hambantota', 'Tangalle', 'Moneragala', 'Lindula', 'Sigiriya', 'Kilinochchi',
    'Mullaitivu', 'Nanu Oya', 'Nugegoda', 'Ohiya', 'Polonnaruwa', 'Talawakele',
    'Kitulgala', 'Hikkaduwa', 'Wadduwa', 'Mihintale', 'Polgahawela', 'Ambalangoda',
    'Bandarawela', 'Chilaw', 'Deniyaya', 'Elpitiya', 'Kottawa',
    'Mawanella', 'Nawalapitiya', 'Panadura', 'Peliyagoda', 'Peradeniya',
    'Seeduwa', 'Tissamaharama', 'Uda Walawe', 'Wattala', 'Yakkala',
    'Ambalantota', 'Ambewela', 'Diyatalawa', 'Ganemulla', 'Kadawatha',
    'Karainagar', 'Kathiraveli', 'Kitulgala', 'Koggala', 'Mahara',
    'Mallavi', 'Marapana', 'Marawila', 'Mullaitivu', 'Nanu Oya',
    'Nugegoda', 'Ohiya', 'Parakaduwa', 'Poonakari', 'Polgolla',
    'Ragama', 'Talawakelle', 'Urugasmanhandiya', 'Wadduwa','Sammanthurai'
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

  const getTodayDate = useCallback(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const fetchDoctorAvailability = useCallback(async (doctorId, date) => {
    try {
      const { data } = await doctorService.getDoctorAvailability(doctorId, date);
      const shifts = data.shifts
        ?.filter(s => s.isActive !== false)
        .map((s, index) => ({
          id: s._id,
          timeRange: s.timeRange,
          status: s.status,
          isActive: s.isActive !== false,
          shiftName: s.shiftName || `Shift ${index + 1}`,
          shiftNumber: parseInt(s.shiftName?.replace('Shift ', '') || index + 1)
        })) 
        .sort((a, b) => a.shiftNumber - b.shiftNumber) || [];

      // Calculate status based on shifts
      let status = 'Unavailable';
      if (shifts.length > 0) {
        const hasAvailableShift = shifts.some(shift => shift.status === 'Available');
        status = hasAvailableShift ? 'Available' : 'Unavailable';
      }

      return {
        id: `${doctorId}-${date}`,
        doctorId,
        date,
        shifts,
        status
      };
    } catch (err) {
      console.error(`Error fetching availability for doctor ${doctorId}:`, err);
      return {
        id: `${doctorId}-${date}`,
        doctorId,
        date,
        shifts: [],
        status: 'Unavailable'
      };
    }
  }, []);

  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: doctorsData } = await doctorService.getDoctorsByClinic(clinic.id);
      setDoctors(doctorsData);
      
      const availabilityPromises = doctorsData.map(doctor => 
        fetchDoctorAvailability(doctor._id, selectedDate)
      );
      
      const availabilityData = await Promise.all(availabilityPromises);
      setAvailability(availabilityData);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError(err.message || 'Failed to fetch doctors');
      
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [clinic?.id, selectedDate, fetchDoctorAvailability, router]);

  const handleRefreshData = useCallback(() => {
    setIsRefreshing(true);
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    const clinicData = getClinicData();
    
    if (!clinicData) {
      toast.error('Please login to access this page');
      router.push('/login');
      return;
    }

    if (!clinicData.isApproved) {
      toast.error('Your clinic is not yet approved');
      router.push('/login');
      return;
    }

    setClinic(clinicData);
    const today = getTodayDate();
    setSelectedDate(today);
    setSelectedShiftDate(today);
    setScheduleFilterDate(today);
  }, [getClinicData, getTodayDate, router]);

  useEffect(() => {
    if (!clinic?.id) return;
    fetchDoctors();
  }, [clinic?.id, fetchDoctors]);

  useEffect(() => {
    const filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchQuery, doctors]);

  const getDoctorShifts = useCallback((doctorId, date) => {
    const availabilityEntry = availability.find(a => 
      a?.doctorId === doctorId && a?.date === date
    );
    return availabilityEntry?.shifts
      ?.filter(shift => shift.isActive !== false)
      .sort((a, b) => a.shiftNumber - b.shiftNumber) || [];
  }, [availability]);

  const getDoctorStatus = (doctorId) => {
    const dateSpecificAvailability = availability.find(a => 
      a?.doctorId === doctorId && a?.date === selectedDate
    );
    
    if (dateSpecificAvailability) {
      return dateSpecificAvailability.status;
    }
    
    const doctor = doctors.find(d => d._id === doctorId);
    return doctor?.status || 'Unavailable';
  };

  const handleStatusColor = (status) => {
    switch (status) {
      case 'Available': 
        return { 
          text: 'text-green-600', 
          bg: 'bg-green-100',
          icon: <Smile className="w-4 h-4 inline mr-1" /> 
        };
      case 'Unavailable': 
        return { 
          text: 'text-red-600', 
          bg: 'bg-red-100',
          icon: <Frown className="w-4 h-4 inline mr-1" /> 
        };
      default: 
        return { 
          text: 'text-gray-600', 
          bg: 'bg-gray-100',
          icon: <Zap className="w-4 h-4 inline mr-1" /> 
        };
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
      const newAvailability = await fetchDoctorAvailability(data._id, selectedDate);
      setAvailability(prev => [...prev, newAvailability]);
      
      setShowAddDoctorPage(false);
      toast.success('Doctor added successfully!');
    } catch (err) {
      console.error('Error adding doctor:', err);
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
      const updatedAvailability = await fetchDoctorAvailability(data._id, selectedDate);
      setAvailability(prev => prev.map(a => 
        a.doctorId === data._id ? updatedAvailability : a
      ));
      
      setShowEditDoctorPopup(false);
      toast.success('Doctor updated successfully!');
    } catch (err) {
      console.error('Error updating doctor:', err);
      setError(err.message || 'Failed to update doctor');
      toast.error(err.message || 'Failed to update doctor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddShifts = async (newShifts) => {
    try {
      setIsLoading(true);
      
      await doctorService.addDoctorShifts(
        selectedDoctor._id,
        newShifts.map(shift => ({
          ...shift,
          date: selectedShiftDate
        }))
      );

      const updatedAvailability = await fetchDoctorAvailability(
        selectedDoctor._id, 
        selectedShiftDate
      );
      
      setAvailability(prev => prev.map(a => 
        a.doctorId === selectedDoctor._id && a.date === selectedShiftDate 
          ? updatedAvailability 
          : a
      ));
      
      setShowAddShiftPopup(false);
      toast.success('Shifts added successfully!');
    } catch (err) {
      console.error('Error adding shifts:', err);
      setError(err.message || 'Failed to add shifts');
      toast.error(err.message || 'Failed to add shifts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveScheduleChanges = async (schedule) => {
    try {
      setIsLoading(true);
      
      const shiftUpdates = schedule.shifts.map(shift => ({
        shiftId: shift.id,
        updates: {
          timeRange: shift.timeRange,
          status: shift.status,
          date: schedule.date
        }
      }));

      const response = await doctorService.updateDoctorShifts(
        schedule.doctorId,
        shiftUpdates
      );

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to update shifts');
      }

      // Refresh the availability data
      const updatedAvailability = await fetchDoctorAvailability(schedule.doctorId, schedule.date);
      
      setAvailability(prev => [
        ...prev.filter(a => !(a.doctorId === schedule.doctorId && a.date === schedule.date)),
        updatedAvailability
      ]);

      setEditingSchedule(null);
      toast.success('Schedule updated successfully!');
      
      // Virtual refresh - refetch all doctors data
      await fetchDoctors();
    } catch (err) {
      console.error('Error saving schedule changes:', err);
      setError(err.message || 'Failed to update schedule');
      toast.error(err.message || 'Failed to update schedule');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (doctorId) => {
    setDoctorToDelete(doctorId);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteDoctor = async () => {
    try {
      setIsLoading(true);
      await doctorService.deleteDoctor(doctorToDelete);
      
      setDoctors(prev => prev.filter(d => d._id !== doctorToDelete));
      setAvailability(prev => prev.filter(a => a.doctorId !== doctorToDelete));
      toast.success('Doctor deleted successfully!');
    } catch (err) {
      console.error('Error deleting doctor:', err);
      setError(err.message || 'Failed to delete doctor');
      toast.error(err.message || 'Failed to delete doctor');
    } finally {
      setIsLoading(false);
      setShowDeleteConfirmation(false);
      setDoctorToDelete(null);
    }
  };

  const confirmDeleteShift = (shiftId) => {
    setShiftToDelete(shiftId);
    setShowDeleteShiftConfirmation(true);
  };

  const handleDeleteShift = async () => {
    try {
      setIsLoading(true);
      
      await doctorService.removeDoctorShifts(
        selectedDoctor._id,
        [shiftToDelete]
      );

      const updatedAvailability = await fetchDoctorAvailability(selectedDoctor._id, selectedDate);
      
      setAvailability(prev => prev.map(a => 
        a.doctorId === selectedDoctor._id && a.date === selectedDate
          ? updatedAvailability
          : a
      ));

      toast.success('Shift deleted successfully!');
    } catch (err) {
      console.error('Error deleting shift:', err);
      setError(err.message || 'Failed to delete shift');
      toast.error(err.message || 'Failed to delete shift');
    } finally {
      setIsLoading(false);
      setShowDeleteShiftConfirmation(false);
      setShiftToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDoctorToDelete(null);
  };

  const cancelDeleteShift = () => {
    setShowDeleteShiftConfirmation(false);
    setShiftToDelete(null);
  };

  const getDoctorSchedules = (doctorId) => {
    if (!Array.isArray(availability)) return [];
    return availability.filter(a => a?.doctorId === doctorId);
  };

  const getFilteredSchedules = (doctorId) => {
    const schedules = getDoctorSchedules(doctorId);
    if (!scheduleFilterDate) return schedules;
    return schedules.filter(schedule => schedule.date === scheduleFilterDate);
  };

  const handleOpenEditPopup = (doctor, e) => {
    e?.stopPropagation();
    setSelectedDoctor(doctor);
    setShowEditDoctorPopup(true);
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
            id: `${shift.doctor}-${shift.date}`,
            doctorId: shift.doctor,
            date: shift.date,
            shifts: [],
            status: shift.status
          };
        }
        acc[shift.date].shifts.push({
          id: shift._id,
          timeRange: shift.timeRange,
          status: shift.status,
          isActive: shift.isActive !== false,
          shiftName: shift.shiftName || `Shift ${acc[shift.date].shifts.length + 1}`,
          shiftNumber: parseInt(shift.shiftName?.replace('Shift ', '') || acc[shift.date].shifts.length + 1)
        });
        return acc;
      }, {});
      
      const schedules = Object.values(scheduleMap).map(schedule => ({
        ...schedule,
        shifts: schedule.shifts.sort((a, b) => a.shiftNumber - b.shiftNumber)
      }));
      
      setAvailability(prev => [
        ...prev.filter(a => a.doctorId !== doctor._id),
        ...schedules
      ]);
      
      setShowAllSchedulesPopup(true);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError(err.message || 'Failed to fetch schedules');
      toast.error(err.message || 'Failed to fetch schedules');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule({ ...schedule });
  };

  const handleCancelEdit = () => {
    setEditingSchedule(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleScheduleChange = (field, value) => {
    setEditingSchedule(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleShiftChange = (index, field, value) => {
    setEditingSchedule(prev => {
      const updatedShifts = [...prev.shifts];
      updatedShifts[index] = {
        ...updatedShifts[index],
        [field]: value
      };
      return {
        ...prev,
        shifts: updatedShifts
      };
    });
  };

  const renderDoctorCard = (doctor) => {
    const status = getDoctorStatus(doctor._id);
    const statusStyle = handleStatusColor(status);
    
    return (
      <div 
        key={doctor._id}
        className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all duration-200"
      >
        <div className="flex items-start mb-3">
          {doctor.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={doctor.photo} 
              alt={doctor.name} 
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" 
            />
          ) : (
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${statusStyle.bg} shadow-sm`}>
              <User className="w-6 h-6 text-gray-500" />
            </div>
          )}
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-gray-800 text-md truncate">{doctor.name}</h2>
              
            </div>
            <p className="text-sm text-gray-600 flex items-center">
              <Stethoscope className="w-3 h-3 mr-1" />
              {doctor.specialization || 'General Practitioner'}
            </p>
            <p className="text-xs text-gray-500 flex items-center truncate">
              <Mail className="w-3 h-3 mr-1" />
              {doctor.email}
            </p>
          </div>
        </div>

        <div className="py-3 border-t border-b border-gray-100 my-3">
          <h3 className="text-sm text-gray-700 font-semibold mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {selectedDate}
            <span className={`text-xs ml-10 px-2 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text} flex items-center`}>
                {statusStyle.icon}
                {status}
              </span>
          </h3>
          {getDoctorShifts(doctor._id, selectedDate).length > 0 ? (
            <div className="space-y-1">
              {getDoctorShifts(doctor._id, selectedDate).map((shift, idx) => (
                <p key={idx} className="text-sm text-gray-600 flex items-center">
                  <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="font-medium">{shift.shiftName}:</span>
                  <span className="mx-1">{shift.timeRange}</span>
                  <span className={`${shift.status === 'Available' ? 'text-green-500' : 'text-red-500'}`}>
                    ({shift.status})
                  </span>
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-gray-400">No shifts scheduled</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => handleOpenEditPopup(doctor, e)}
            className="bg-blue-50 text-blue-600 py-1.5 px-2 rounded-lg text-sm hover:bg-blue-100 transition flex items-center justify-center"
            disabled={isLoading}
          >
            <Edit className="w-4 h-4 mr-1" />
            <span className="truncate">Edit</span>
          </button>
          <button
            onClick={() => handleOpenAddShiftPopup(doctor)}
            className="bg-green-50 text-green-600 py-1.5 px-2 rounded-lg text-sm hover:bg-green-100 transition flex items-center justify-center"
            disabled={isLoading}
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            <span className="truncate">Shifts</span>
          </button>
          <button
            onClick={(e) => handleViewAllSchedules(doctor, e)}
            className="bg-purple-50 text-purple-600 py-1.5 px-2 rounded-lg text-sm hover:bg-purple-100 transition flex items-center justify-center"
            disabled={isLoading}
          >
            <Calendar className="w-4 h-4 mr-1" />
            <span className="truncate">Schedules</span>
          </button>
          <button
            onClick={() => confirmDelete(doctor._id)}
            className="bg-red-50 text-red-600 py-1.5 px-2 rounded-lg text-sm hover:bg-red-100 transition flex items-center justify-center"
            disabled={isLoading}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            <span className="truncate">Delete</span>
          </button>
        </div>
      </div>
    );
  };

  const renderSearchAndFilters = () => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="relative w-full md:w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 p-2.5 border-2 text-black border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 w-full"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-10 p-2.5 border-2 text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            min={getTodayDate()}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleRefreshData}
            className="bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition flex items-center"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowAddDoctorPage(true)}
            className="bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition flex items-center"
            disabled={isLoading}
          >
            <PlusCircle className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Add Doctor</span>
            <span className="inline sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {showDeleteConfirmation ? 'Confirm Deletion' : 'Confirm Shift Deletion'}
          </h2>
          <button
            onClick={showDeleteConfirmation ? cancelDelete : cancelDeleteShift}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <p className="mb-6 text-gray-600">
          {showDeleteConfirmation 
            ? 'Are you sure you want to delete this doctor?'
            : 'Are you sure you want to delete this shift?'}
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={showDeleteConfirmation ? cancelDelete : cancelDeleteShift}
            className="bg-gray-100 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-200 transition flex items-center"
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </button>
          <button
            onClick={showDeleteConfirmation ? handleDeleteDoctor : handleDeleteShift}
            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition flex items-center"
            disabled={isLoading}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (!clinic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (showAddDoctorPage) {
    return (
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setShowAddDoctorPage(false)}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-800">Add New Doctor</h2>
          </div>
          <AddDoctorForm
            onAddDoctor={handleAddDoctor}
            onCancel={() => setShowAddDoctorPage(false)}
            cities={cities}
            isLoading={isLoading}
            error={error}
            clinicName={clinic.name}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">
            <span className="text-blue-600"></span>Doctor Management
          </h1>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button 
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {(isLoading || isRefreshing) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
              <Loader2 className="animate-spin h-10 w-10 text-blue-500 mb-3" />
              <p className="text-gray-700">Loading doctor data...</p>
            </div>
          </div>
        )}

        {renderSearchAndFilters()}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => renderDoctorCard(doctor))
          ) : (
            <div className="col-span-full py-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {doctors.length === 0 ? 'No doctors found' : 'No matching doctors'}
              </h3>
              <p className="text-gray-500 mb-6">
                {doctors.length === 0 
                  ? 'Get started by adding your first doctor'
                  : 'Try adjusting your search or filter'}
              </p>
              <button
                onClick={() => setShowAddDoctorPage(true)}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition flex items-center mx-auto"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add Doctor
              </button>
            </div>
          )}
        </div>

        {showEditDoctorPopup && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Edit Doctor</h2>
                  <button
                    onClick={() => setShowEditDoctorPopup(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <EditDoctorForm
                  doctor={selectedDoctor}
                  onSave={handleSaveEditedDoctor}
                  onCancel={() => setShowEditDoctorPopup(false)}
                  cities={cities}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </div>
          </div>
        )}

        {showAddShiftPopup && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Add Shifts for {selectedDoctor.name}
                  </h2>
                  <button
                    onClick={() => setShowAddShiftPopup(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <AddShiftForm 
                  doctor={selectedDoctor}
                  selectedDate={selectedShiftDate}
                  existingShifts={getDoctorShifts(selectedDoctor._id, selectedShiftDate)}
                  onDateChange={setSelectedShiftDate}
                  onSave={handleAddShifts}
                  onCancel={() => setShowAddShiftPopup(false)}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </div>
          </div>
        )}

        {showAllSchedulesPopup && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Schedules for {selectedDoctor.name}
                  </h2>
                  <button
                    onClick={() => setShowAllSchedulesPopup(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Date
                  </label>
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={scheduleFilterDate}
                        onChange={(e) => setScheduleFilterDate(e.target.value)}
                        className="pl-10 p-2.5 border-2 text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 w-full"
                      />
                    </div>
                    <button
                      onClick={() => setScheduleFilterDate('')}
                      className="ml-2 text-sm text-blue-500 hover:text-blue-700 whitespace-nowrap"
                    >
                      Clear Filter
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {getFilteredSchedules(selectedDoctor._id).length > 0 ? (
                    getFilteredSchedules(selectedDoctor._id).map(schedule => (
                      <div key={schedule.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                        {editingSchedule?.id === schedule.id ? (
                          <div className="space-y-4">
                            <h3 className="font-semibold text-gray-800 text-lg">
                              {new Date(schedule.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </h3>
                            
                            <div className="space-y-3">
                              {editingSchedule.shifts.map((shift, idx) => (
                                <div key={idx} className="space-y-2 bg-gray-50 p-3 rounded-lg">
                                  <div className="flex justify-between items-center">
                                    <label className=" text-sm font-medium text-gray-700 flex items-center">
                                      <Clock className="w-4 h-4 mr-2" />
                                      {shift.shiftName}
                                    </label>
                                    <button
                                      onClick={() => confirmDeleteShift(shift.id)}
                                      className="text-red-500 hover:text-red-700 text-sm flex items-center"
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      Delete
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    value={shift.timeRange}
                                    onChange={(e) => handleShiftChange(idx, 'timeRange', e.target.value)}
                                    className="p-2 border-2 text-gray-700 border-gray-200 rounded-lg w-full focus:ring-blue-300 focus:border-blue-500"
                                  />
                                  <select
                                    value={shift.status}
                                    onChange={(e) => handleShiftChange(idx, 'status', e.target.value)}
                                    className={`p-2 border-2 border-gray-200 rounded-lg w-full focus:ring-blue-300 focus:border-blue-500 ${
                                      shift.status === "Available" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                                    } font-medium`}
                                  >
                                    <option value="Available" className="text-green-600">Available</option>
                                    <option value="Unavailable" className="text-red-600">Unavailable</option>
                                  </select>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex space-x-3 pt-2">
                              <button
                                onClick={() => handleSaveScheduleChanges(editingSchedule)}
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center flex-1"
                                disabled={isLoading}
                              >
                                <Check className="w-5 h-5 mr-2" />
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition flex items-center justify-center flex-1"
                                disabled={isLoading}
                              >
                                <X className="w-5 h-5 mr-2" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-gray-800 text-lg">
                                {new Date(schedule.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </h3>
                              <button
                                onClick={() => handleEditSchedule(schedule)}
                                className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </button>
                            </div>
                            
                            <div className="mt-3 space-y-2">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                schedule.status === 'Available' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {schedule.status === 'Available' 
                                  ? <Smile className="w-4 h-4 mr-1" /> 
                                  : <Frown className="w-4 h-4 mr-1" />}
                                {schedule.status}
                              </div>
                              
                              <div className="space-y-2">
                                {schedule.shifts.map((shift, idx) => (
                                  <div key={idx} className="flex items-start">
                                    <div className={`flex-shrink-0 mt-1 mr-3 ${
                                      shift.status === 'Available' ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                      {shift.status === 'Available' 
                                        ? <Check className="w-4 h-4" /> 
                                        : <X className="w-4 h-4" />}
                                    </div>
                                    <div>
                                      <p className="text-gray-800 font-medium">{shift.shiftName}</p>
                                      <p className="text-gray-600">
                                        {shift.timeRange}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No schedules found
                      </h3>
                      <p className="text-gray-500">
                        {scheduleFilterDate 
                          ? 'Try adjusting your date filter'
                          : 'No schedules have been created yet'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {(showDeleteConfirmation || showDeleteShiftConfirmation) && renderConfirmationModal()}
      </div>
    </div>
  );
};

export default ManageDoctorAvailability;