'use client';
import { useState } from "react";
import SocialLogin from "../components/SocialLogin";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",  // renamed from email
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors(null);
    setSuccess(null);
  };

  const validate = () => {
    if (!formData.name || !formData.username || !formData.phone || !formData.dob || !formData.password || !formData.confirmPassword) {
      return "All fields are required.";
    }
    if (formData.phone.length !== 10 || !/^\d{10}$/.test(formData.phone)) {
      return "Phone number must be exactly 10 digits.";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Confirm password does not match.";
    }
    if (!formData.agree) {
      return "You must agree to the Terms and Conditions.";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setErrors(validationError);
      setSuccess(null);
      return;
    }

    // Normally, you'd send this to your backend API
    setErrors(null);
    setSuccess("Successfully registered!");
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">Create Account</h2>
      <p className="text-gray-500 text-center mb-4">Get started by creating your new account</p>

      {/* Show Errors */}
      {errors && <div className="text-red-600 font-extralight mb-4">{errors}</div>}
      {/* Show Success */}
      {success && <div className="text-green-600 text-center font-medium mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border bg-[#F9F8FF] text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Full Name"
        />

        {/* Username / Email */}
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 border bg-[#F9F8FF] text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Username or Email"
        />

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          maxLength={10}
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border bg-[#F9F8FF] text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Phone Number"
        />

        {/* Date of Birth */}
        <input
          type="text"
          name="dob"
          onFocus={(e) => e.target.type = 'date'}
          onBlur={(e) => e.target.type = 'text'}
          value={formData.dob}
          onChange={handleChange}
          className="w-full p-2 border bg-[#F9F8FF] text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Date of Birth"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border bg-[#F9F8FF] text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
        />

        {/* Confirm Password */}
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 border bg-[#F9F8FF] text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Confirm Password"
        />

        {/* Terms and Conditions */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-gray-600 text-sm">
            By clicking, you agree to the Findme's{" "}
            <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-900 transition"
        >
          Register
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-3 text-gray-500 text-sm">Or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Social Login */}
      <SocialLogin />

      {/* Login Link */}
      <p className="text-center text-gray-500 text-[1.06rem] font-medium mt-6">
        Already have an account?{" "}
        <a href="/login" className="text-[#5F41E4] font-light hover:underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default SignupForm;
