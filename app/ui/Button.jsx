"use client";

const Button = ({ label, onClick }) => {
    return (
      <button
        className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/50"
        onClick={onClick}
      >
        {label}
      </button>
    );
  };
  
  export default Button;
  