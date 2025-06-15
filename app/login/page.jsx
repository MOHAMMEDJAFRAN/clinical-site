"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { assets } from "../../public/assets/assets";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);

  // Initialize remembered email if exists
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedUser");
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const sanitizeInput = (input) => input.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: sanitizeInput(value) }));
    
    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    if (password.length > 0 && password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!formData.email || !formData.password) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    
    if (!validatePassword(formData.password)) return;

    // Rate limiting
    const now = Date.now();
    if (now - lastAttemptTime < 2000) {
      toast.error("Please wait before trying again");
      return;
    }
    setLastAttemptTime(now);

    setIsLoading(true);
    setErrorMessage("");

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
        formData,
        { timeout: 10000 } // 10 second timeout
      );

      if (!data.success) throw new Error(data.message);

      // Store minimal required data
      localStorage.setItem("authToken", data.token);
      
      const safeUserData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      };
      localStorage.setItem("userData", JSON.stringify(safeUserData));

      if (data.profile) {
        const safeProfileData = {
          id: data.profile.id,
          clinicName: data.profile.clinicName || data.profile.name,
          isApproved: data.profile.isApproved,
          ...(data.user.role === 'staff' && {
            clinicId: data.profile.clinicId
          })
        };
        localStorage.setItem("profileData", JSON.stringify(safeProfileData));
        console.log(data)
      }

      // Handle "Remember me"
      if (rememberMe) {
        localStorage.setItem("rememberedUser", formData.email);
      } else {
        localStorage.removeItem("rememberedUser");
      }

      // Redirect based on role
      if (data.user.role === "merchant" && !data.profile?.isApproved) {
        router.push("/pending-approval");
        toast("Your merchant account is pending approval", { icon: "⏳" });
        return;
      }

      const redirectPath = getRedirectPath(data.user.role);
      toast.success("Login successful!");
      router.push(redirectPath);

    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = (error) => {
    let message = "Login failed. Please try again.";
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const serverMsg = error.response?.data?.message || "";
      
      switch (status) {
        case 400: message = "Invalid request. Please check your input."; break;
        case 401: message = serverMsg || "Invalid credentials"; break;
        case 403: message = serverMsg || "Account not approved or suspended"; break;
        case 404: message = "Account not found"; break;
        case 429: message = "Too many attempts. Please try again later."; break;
        case 500: message = "Server error. Please try again later."; break;
        default: message = serverMsg || "Network error. Please check your connection.";
      }
    } else if (error instanceof Error) {
      message = error.message;
    }
    
    setErrorMessage(message);
    toast.error(message, { 
      duration: 5000,
      position: 'top-center'
    });
  };

  const getRedirectPath = (role) => {
    switch (role) {
      case "merchant": return "/centers/dashboard";
      case "admin": return "/admin/dashboard";
      case "super-admin": return "/super-admin/dashboard";
      case "staff": return "/centers/outstandingPatients"; // Staff specific route
      default: return "/";
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
        {/* Header */}
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

        {/* Login Form */}
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
            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-3.5 h-5 w-5 text-blue-700" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  aria-required="true"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="yourname@example.com"
                  autoComplete="username"
                  className="py-3 pl-10 pr-4 text-gray-500 block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-3.5 h-5 w-5 text-blue-700" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  aria-required="true"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="py-3 pl-10 pr-12 text-gray-500 block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              {/* temporary hide forgetPassword */}
              {/* <button
                type="button"
                onClick={() => router.push('/forgetPassword')}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Forgot password?
              </button> */}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg flex items-center justify-center shadow-md ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;