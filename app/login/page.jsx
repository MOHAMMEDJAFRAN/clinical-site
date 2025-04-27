"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { assets } from "../../public/assets/assets";
import Image from "next/image";
import { LockClosedIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        localStorage.setItem('profileData', JSON.stringify(response.data.profile));
  
        // Check if merchant is approved
        if (response.data.user.role === 'merchant' && !response.data.profile?.isApproved) {
          // Store the token anyway for verification purposes
          router.push('/pending-approval');
          toast.info('Your merchant account is pending approval');
          return;
        }
  
        // Redirect based on role
        const redirectPath = getRedirectPath(response.data.user.role);
        toast.success('Login successful!');
        router.push(redirectPath);
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      let errorMsg = 'Login failed. Please try again.';
      
      if (error.response) {
        // Handle specific error cases
        if (error.response.status === 401) {
          if (error.response.data.message.includes('not approved')) {
            errorMsg = 'Your merchant account is pending approval. Please contact support.';
            // You could still store the token if needed
            if (error.response.data.token) {
              localStorage.setItem('authToken', error.response.data.token);
            }
            router.push('/pending-approval');
          } else {
            errorMsg = 'Invalid credentials. Please try again.';
          }
        } else if (error.response.status === 403) {
          errorMsg = 'Access denied. Please contact support.';
        }
      } else if (error.request) {
        errorMsg = 'No response from server. Please try again.';
      }
  
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRedirectPath = (role) => {
    switch(role) {
      case 'merchant':
        return '/centers/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'super-admin':
        return '/super-admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-b from-white to-indigo-700 p-6 text-center">
          <div className="flex justify-center mb-4">
            <Image 
              src={assets.logo} 
              alt="Company Logo" 
              width={200} 
              height={80} 
              className="h-20 object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-blue-100 mt-2">Sign in to continue to your account</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errorMessage}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-blue-700" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="py-3 pl-10 pr-4 text-gray-500 block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="yourname@example.com"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-blue-700" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="py-3 pl-10 text-gray-500 pr-12 block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg transition-all flex items-center justify-center shadow-md ${
                isLoading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Create one
              </a>
            </p>
          </div> */}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;