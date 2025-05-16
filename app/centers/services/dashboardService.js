import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with base config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add clinic ID
apiClient.interceptors.request.use(
  (config) => {
    const clinicId = localStorage.getItem('clinicId');
    
    if (clinicId) {
      config.headers['X-Clinic-ID'] = clinicId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data part of the response
  },
  (error) => {
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 400:
          toast.error(error.response.data?.message || 'Invalid request');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 500:
          toast.error('Server error. Please try again later');
          break;
        default:
          toast.error(error.response.data?.message || 'An error occurred');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection');
    } else {
      toast.error('Request error. Please try again');
    }
    
    return Promise.reject(error);
  }
);

// Dashboard Services
const getDashboardData = async () => {
  try {
    return await apiClient.get('/api/v1/clinicDashboard/clinic');
  } catch (error) {
    console.error('Dashboard service error:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    throw error;
  }
};

// Appointment Services
const getAppointmentDetails = async (appointmentId) => {
  try {
    return await apiClient.get(`/api/v1/clinicDashboard/appointments/${appointmentId}`);
  } catch (error) {
    console.error('Get appointment details error:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    throw error;
  }
};

const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    return await apiClient.patch(`/api/v1/clinicDashboard/appointments/${appointmentId}`, { status });
  } catch (error) {
    console.error('Update appointment status error:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    throw error;
  }
};

// Payment Services
const createPayment = async (appointmentId, paymentData) => {
  try {
    const response = await apiClient.post(
      `/api/v1/clinicDashboard/${appointmentId}/payments`,
      paymentData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Since your interceptor returns response.data directly, we need to handle it differently
    if (!response) {
      throw new Error('No response received from server');
    }

    // Check if the response contains the expected data structure
    if (!response.payment) {
      console.error('Unexpected response structure:', response);
      throw new Error('Payment data not found in response');
    }

    return {
      success: true,
      payment: response.payment,
      updatedAppointment: response.appointment,
      message: response.message || 'Payment created successfully'
    };
  } catch (error) {
    console.error('Create payment error:', {
      endpoint: `/api/v1/clinicDashboard/${appointmentId}/payments`,
      error: error.message,
      requestData: paymentData,
      response: error.response,
    });

    // Transform the error for better handling in components
    const transformedError = new Error(
      error.response?.message ||
      error.message ||
      'Failed to process payment. Please try again.'
    );
    
    transformedError.details = error.response?.errors || {};
    transformedError.status = error.response?.status;

    throw transformedError;
  }
};

const getPaymentDetails = async (paymentId) => {
  try {
    // Validate payment ID format
    if (!paymentId || typeof paymentId !== 'string' || paymentId.length !== 24) {
      throw new Error('Invalid payment ID format');
    }

    const response = await apiClient.get(
      `/api/v1/clinicDashboard/payments/${paymentId}`
    );

    if (!response) {
      throw new Error('No data received from server');
    }

    return response;
  } catch (error) {
    console.error('Get payment details error:', {
      message: error.message,
      response: error.response?.data,
      config: error.config,
      paymentId
    });

    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to retrieve payment details';
    
    const transformedError = new Error(errorMessage);
    transformedError.details = error.response?.data?.errors || {};
    transformedError.status = error.response?.status;

    throw transformedError;
  }
};

// Export all services
const merchantDashboardService = {
  getDashboardData,
  getAppointmentDetails,
  updateAppointmentStatus,
  createPayment,
  getPaymentDetails
};

export default merchantDashboardService;