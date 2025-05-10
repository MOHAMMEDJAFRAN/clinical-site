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
        `/api/v1/clinicDashboard/appointments/${appointmentId}`,
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          validateStatus: (status) => status < 500, // Don't throw for 4xx errors
        }
      );
  
      if (response.status >= 400) {
        const error = new Error(
          response.data?.message || 'Payment creation failed'
        );
        error.response = response;
        throw error;
      }
  
      return {
        success: true,
        payment: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Create payment error:', {
        endpoint: `/api/v1/clinicDashboard/appointments/${appointmentId}`,
        error: error.message,
        requestData: paymentData,
        response: error.response?.data,
      });
  
      // Transform the error for better handling in components
      const transformedError = new Error(
        error.response?.data?.message ||
          'Failed to process payment. Please try again.'
      );
      transformedError.details = error.response?.data?.errors || {};
      transformedError.status = error.response?.status;
  
      throw transformedError;
    }
  };

const getPaymentDetails = async (paymentId) => {
  try {
    return await apiClient.get(`/api/v1/clinicDashboard/payments/${paymentId}`);
  } catch (error) {
    console.error('Get payment details error:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    throw error;
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