"use client";

const Button = ({ label, onClick }) => {
    return (
      <button
        className="bg-blue-600 text-white w-full font-semibold py-2 rounded-md hover:bg-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/50"
        onClick={onClick}
      >
        {label}
      </button>
    );
  };
  
  export default Button;
  