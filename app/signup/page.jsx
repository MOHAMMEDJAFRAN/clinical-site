'use client';
import SocialLogin from "../components/SocialLogin";

const SignupForm = () => {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-xl">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">Create Account</h2>
      <p className="text-gray-500 text-center mb-6">Get started by creating your new account</p>

      {/* Form */}
      <form className="space-y-4">
        {/* Full Name
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Full Name"
        /> */}

        {/* Email Address */}
        <input
          type="email"
          className="w-full p-2 border bg-[#F9F8FF] text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
          placeholder="Email"
        />

        {/* Phone Number */}
        <input
          type="tel"
          className="w-full p-2 border bg-[#F9F8FF] text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
          placeholder="Phone Number"
        />

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            className="w-full p-2 border bg-[#F9F8FF] text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
            placeholder="Password"
          />
        </div>

      
        <div>
          <input
            type="password"
            className="w-full p-2 border bg-[#F9F8FF] text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
            placeholder="Confirm Password"
          />
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-center">
          <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <label className="ml-2 text-gray-600 text-sm">
            By clicking, you agree to the Findme's <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a>
          </label>
        </div>

        {/* Register Button */}
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

      {/* Social Login Buttons */}
      {/* <div className="flex justify-center space-x-4">
        <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition">
          <img src="/google-icon.svg" alt="Google" className="w-6 h-6" />
        </button>
        <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition">
          <img src="/apple-icon.svg" alt="Apple" className="w-6 h-6" />
        </button>
        <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition">
          <img src="/facebook-icon.svg" alt="Facebook" className="w-6 h-6" />
        </button>
      </div> */}
      <SocialLogin/>
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
