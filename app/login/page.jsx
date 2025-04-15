"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { assets } from "../../public/assets/assets";
import Image from "next/image";
import SocialLogin from "../components/SocialLogin";
import InputField from "../components/Inputfield";
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { Loader2 } from "lucide-react";

const Login = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (session) {
      // Redirect based on user role if available
      const redirectPath = session.user.role === 'admin' 
        ? '/admin/doctor' 
        : session.user.role === 'super-admin'
        ? '/super-admin/doctor'
        : '/';
      router.push(redirectPath);
    }
  }, [session, router]);

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
      const result = await signIn("credentials", {
        redirect: false,
        usernameOrEmail: formData.usernameOrEmail,
        password: formData.password,
      });

      if (result?.error) {
        // More specific error messages
        const errorMap = {
          "CredentialsSignin": "Invalid username or password",
          "UserNotFound": "Account not found",
          "IncorrectPassword": "Incorrect password",
          "AccountNotVerified": "Please verify your email first"
        };
        
        setErrorMessage(errorMap[result.error] || "Login failed. Please try again.");
      } else if (result?.ok) {
        router.push(result.url || "/");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-100 p-3 text-center">
          <div className="flex justify-center">
            <Image 
              src={assets.logo} 
              alt="Company Logo" 
              width={140} 
              height={60} 
              className="h-20 object-contain"
            />
          </div>
          {/* <h1 className="text-xl font-semibold text-blue-700">Welcome Back</h1> */}
          <p className="text-black mt-1">Sign in to access your account</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="usernameOrEmail" className="block mt-[-15] text-sm font-medium text-gray-700">
                Username or Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                  <InputField
                    label="usernameOrEmail"
                    name="usernameOrEmail"
                    type="text"
                    placeholder=""
                    value={formData.usernameOrEmail}
                    onChange={handleChange}
                    required
                    icon="user"
                    className="py-2 pl-10 text-gray-500 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
              </div>
            </div>

            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <InputField
                  label="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  value={formData.password}
                  onChange={handleChange}
                  required
                  icon="lock"
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="y-2 pl-10 block text-gray-500 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              
              <a 
                href="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center ${
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
            </button>
          </form>

          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-sm text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <SocialLogin />

          <p className="text-center text-gray-600 mt-6 text-sm">
            Don't have an account?{" "}
            <a 
              href="/signup" 
              className="text-blue-600 font-medium hover:text-blue-800 hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;