import React from "react";

export const Progress = ({ value = 0, max = 100, className = "" }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-4 ${className}`}>
      <div
        style={{ width: `${(value / max) * 100}%` }}
        className="h-4 bg-blue-500 rounded-full transition-all"
      ></div>
    </div>
  );
};
