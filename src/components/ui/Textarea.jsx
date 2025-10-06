import React from "react";

export const Textarea = ({ value, onChange, placeholder, rows = 4, className = "" }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    />
  );
};
