"use client";

import { useState} from "react";

const InputField = ({ type, placeholder }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={isPasswordShown ? "text" : type}
        placeholder={placeholder}
        className="w-full px-4 py-3 border text-gray-400 border-gray-300 rounded-md text-[1rem] bg-[#F9F8FF] focus:outline-none focus:ring-2 focus:ring-blue-700 transition shadow-sm"
        required
      />
      {type === "password" && (
        <span
          onClick={() => setIsPasswordShown(!isPasswordShown)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700"
        >
          {isPasswordShown ? "" : ""}
        </span>
      )}
    </div>
  );
};

export default InputField;
