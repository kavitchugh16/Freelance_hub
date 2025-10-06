import React from "react";

export const Badge = ({ children, color = "blue", className = "" }) => {
  const colorClasses = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    red: "bg-red-500 text-white",
    yellow: "bg-yellow-500 text-white",
    gray: "bg-gray-500 text-white",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-sm font-semibold ${colorClasses[color] || colorClasses.blue} ${className}`}
    >
      {children}
    </span>
  );
};
