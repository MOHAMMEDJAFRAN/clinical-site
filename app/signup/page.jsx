'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import SocialLogin from "../components/SocialLogin";
import {
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  LockClosedIcon,
  EnvelopeIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const SignupForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    phone_number: "",
    date_of_birth: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (submitError) setSubmitError("");
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!formData.username.trim()) {
      newErrors.username = "Username or email is required";
    } else if (formData.username.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.username)) {
      newErrors.username = "Invalid email format";
    }
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Phone must be 10 digits";
    }
    if (!formData.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    if (!formData.agree) newErrors.agree = "You must agree to terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setSubmitError("");

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          username: formData.username,
          phone_number: formData.phone_number,
          date_of_birth: formData.date_of_birth,
          password: formData.password,
          role: formData.role,
          ...(formData.username.includes('@') && { email: formData.username })
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      router.push('/login?registration=success');
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">Create Account</h2>
      <p className="text-gray-500 text-center mb-4">Get started by creating your new account</p>

      {submitError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md text-center">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              className={`block text-gray-500 w-full pl-10 pr-3 py-2 border ${errors.full_name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="John Doe"
            />
          </div>
          {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>}
        </div>

        {/* Username or Email */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username or Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {formData.username.includes('@') ? (
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <UserIcon className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`block w-full lowercase text-gray-500 pl-10 pr-3 py-2 border ${errors.username ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="username or email@example.com"
            />
          </div>
          {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="phone_number"
              name="phone_number"
              type="tel"
              maxLength={10}
              value={formData.phone_number}
              onChange={handleChange}
              className={`block w-full text-gray-500 pl-10 pr-3 py-2 border ${errors.phone_number ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="1234567890"
            />
          </div>
          {errors.phone_number && <p className="mt-1 text-xs text-red-500">{errors.phone_number}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="text"
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => (e.target.type = 'text')}
              value={formData.date_of_birth}
              onChange={handleChange}
              className={`block w-full text-gray-500 pl-10 pr-3 py-2 border ${errors.date_of_birth ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="MM/DD/YYYY"
            />
          </div>
          {errors.date_of_birth && <p className="mt-1 text-xs text-red-500">{errors.date_of_birth}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`block w-full text-gray-500 pl-10 pr-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`block w-full text-gray-500 pl-10 pr-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="••••••••"
            />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              checked={formData.agree}
              onChange={handleChange}
              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border ${errors.agree ? 'border-red-300' : 'border-gray-300'} rounded`}
            />
          </div>
          <label htmlFor="agree" className="ml-2 block text-sm text-gray-700">
            I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Terms and Conditions</a>
          </label>
        </div>
        {errors.agree && <p className="mt-1 text-xs text-red-500">{errors.agree}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </>
          ) : (
            'Register'
          )}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6">
          <SocialLogin />
        </div>
      </div>

      <p className="text-center text-gray-600 mt-6 text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 font-medium hover:text-blue-800 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default SignupForm;