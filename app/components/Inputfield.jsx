"use client";

import { useState} from "react";

const InputField = ({ type, placeholder }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={isPasswordShown ? "text" : type}
        placeholder={placeholder}
        className="py-2 pl-10 lowercase block w-full text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        required
      />
      {type === "password" && (
        <span
          onClick={() => setIsPasswordShown(!isPasswordShown)}
          className="absolute  right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700"
        >
          {isPasswordShown ? "" : ""}
        </span>
      )}
    </div>
  );
};

export default InputField;
