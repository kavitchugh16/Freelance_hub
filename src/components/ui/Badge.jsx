// import React from "react";

// export const Badge = ({ children, color = "blue", className = "" }) => {
//   const colorClasses = {
//     blue: "bg-blue-500 text-white",
//     green: "bg-green-500 text-white",
//     red: "bg-red-500 text-white",
//     yellow: "bg-yellow-500 text-white",
//     gray: "bg-gray-500 text-white",
//   };

//   return (
//     <span
//       className={`px-2 py-1 rounded text-sm font-semibold ${colorClasses[color] || colorClasses.blue} ${className}`}
//     >
//       {children}
//     </span>
//   );
// };
import React from "react";

export const Badge = ({ 
  children, 
  variant = "default", 
  size = "md",
  className = "",
  animated = false 
}) => {
  const variants = {
    default: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200",
    success: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200",
    warning: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200",
    danger: "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200",
    info: "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-200",
    gray: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200",
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-600",
    secondary: "bg-gradient-to-r from-gray-600 to-slate-600 text-white border border-gray-600"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  const animationClasses = animated ? "animate-pulse" : "";
  
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full transition-all duration-200 ${variants[variant]} ${sizes[size]} ${animationClasses} ${className}`}
    >
      {children}
    </span>
  );
};
