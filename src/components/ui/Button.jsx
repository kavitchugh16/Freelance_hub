import React from "react";

export const Button = ({ children, onClick, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded ${className}`}
    >
      {children}
    </button>
  );
};
