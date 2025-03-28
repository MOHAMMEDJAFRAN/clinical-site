

"use client";

import { signIn } from "next-auth/react";

const SocialLogin = () => {
  return (
    <div className="flex text-black gap-4 mt-4 justify-center w-full">
      {/* Google Login */}
      <button
        onClick={() => signIn("google")}
        className="flex items-center gap-2 px-5 py-2 text-[1rem] font-medium cursor-pointer border border-[#D5CBFF] rounded-md bg-[#F9F8FF] hover:border-[#5F41E4] hover:bg-[#f1eff9] transition"
      >
        <img src="/google.svg" alt="Google" className="w-5 " />
        Google
      </button>

      {/* Facebook Login */}
      <button
        onClick={() => signIn("facebook")}
        className="flex items-center gap-0 px-2 py-0  text-[1rem] font-medium cursor-pointer border border-[#D5CBFF] rounded-md bg-[#F9F8FF] hover:border-[#5F41E4] hover:bg-[#f1eff9] transition"
      >
        <img src="/facebook.svg" alt="Facebook" className="w-13 ml-[-10]" />
        Facebook
      </button>
    </div>
  );
};

export default SocialLogin;

