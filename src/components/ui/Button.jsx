import React from "react";

export const Button = ({ 
  children, 
  onClick, 
  className = "", 
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false
}) => {
  const baseClasses = "font-semibold rounded-xl transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-medium hover:shadow-glow focus:ring-blue-500",
    secondary: "bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:border-gray-300 text-gray-700 shadow-soft hover:shadow-medium focus:ring-gray-500",
    success: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-medium hover:shadow-glow-green focus:ring-green-500",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-medium hover:shadow-glow focus:ring-red-500",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 focus:ring-gray-500"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : "hover:scale-105";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};
