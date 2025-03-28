"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SocialLogin from "../components/SocialLogin";
import InputField from "../components/Inputfield";
import { user_details } from "../../src/data";

const Login = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect user if already logged in
  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = user_details.find((u) => u.email === email && u.password === password);

    if (user) {
      router.push("/");
    } else {
      setErrorMessage("Invalid email or password");
      setPassword("");
    }
  };

  // Avoid rendering on server to prevent hydration errors
  if (!isClient) return null;

  return (
    <div className="flex items-center justify-center min-h-screen p-2 relative">
      <div className="relative z-10 max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        {/* Log In Header */}
        <h2 className="text-center text-[1.8rem] font-semibold text-blue-600 mb-1">
          Log In
        </h2>
        <p className="text-center text-gray-500 text-[0.95rem] mb-6">
          Welcome back! Please enter your details
        </p>

        {/* Show loading if session status is loading */}
        {status === "loading" && <p className="text-center text-gray-500">Loading...</p>}

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 text-sm font-light mb-2 text-center">
            {errorMessage}
          </p>
        )}

        {/* Input Fields */}
        <form onSubmit={handleLogin} className="space-y-5">
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <a href="#" className="text-[#5F41E4] text-sm hover:underline block text-left">
            Forgot password?
          </a>

          <button
            type="submit"
            className="w-full h-[50px] bg-blue-700 text-white text-[1.125rem] font-medium rounded-md hover:bg-blue-900 transition"
          >
            Log in
          </button>
        </form>

        {/* Social Login */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">Or Continue With</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <SocialLogin />

        {/* Sign Up Link */}
        <p className="text-center text-gray-500 text-[1.06rem] font-medium mt-6">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-[#5F41E4] font-light hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
