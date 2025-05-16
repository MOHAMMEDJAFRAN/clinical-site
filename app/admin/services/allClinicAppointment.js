import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/allClinicAppointments`;

// Clinic related services
const getClinics = async (searchTerm = '', page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clinics`, {
      params: { 
        search: searchTerm,
        page,
        limit
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching clinics:', error);
    throw error.response?.data?.message || 'Failed to fetch clinics';
  }
};

const getClinicById = async (clinicId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clinics/${clinicId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching clinic:', error);
    throw error.response?.data?.message || 'Failed to fetch clinic';
  }
};

// Clinic-specific appointment services
const getClinicAppointments = async (clinicId, filters = {}) => {
  try {
    const { status, doctorId, startDate, endDate, patientName, referenceNumber } = filters;
    
    const response = await axios.get(`${API_BASE_URL}/clinics/${clinicId}/appointments`, {
      params: {
        status: status === 'all' ? undefined : status,
        doctorId,
        startDate,
        endDate,
        patientName,
        referenceNumber
      },
      withCredentials: true
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching clinic appointments:', error);
    throw error.response?.data?.message || 'Failed to fetch clinic appointments';
  }
};

const getClinicAppointmentStats = async (clinicId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clinics/${clinicId}/appointments/stats`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching clinic stats:', error);
    throw error.response?.data?.message || 'Failed to fetch clinic statistics';
  }
};

// General appointment services
const getAppointments = async (filters = {}) => {
  try {
    const { 
      status, 
      clinicId, 
      doctorId, 
      startDate, 
      endDate, 
      patientName,
      referenceNumber,
      page = 1, 
      limit = 10 
    } = filters;
    
    const response = await axios.get(API_BASE_URL, {
      params: {
        status: status === 'all' ? undefined : status,
        clinicId,
        doctorId,
        startDate,
        endDate,
        patientName,
        referenceNumber,
        page,
        limit
      },
      withCredentials: true
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error.response?.data?.message || 'Failed to fetch appointments';
  }
};

const getAppointmentById = async (appointmentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${appointmentId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error.response?.data?.message || 'Failed to fetch appointment';
  }
};

const updateAppointmentStatus = async (appointmentId, statusData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${appointmentId}/status`,
      statusData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error.response?.data?.message || 'Failed to update appointment status';
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getClinics,
  getClinicById,
  getClinicAppointments,
  getClinicAppointmentStats,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus
};