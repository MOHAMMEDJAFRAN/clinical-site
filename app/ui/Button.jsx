"use client";

const Button = ({ label, onClick }) => {
    return (
      <button
        className="bg-blue-600 mt-2.5 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-all duration-300"
        onClick={onClick}
      >
        {label}
      </button>
    );
  };
  
  export default Button;
  