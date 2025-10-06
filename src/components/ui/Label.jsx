import React from "react";

export const Label = ({ htmlFor, children, className = "" }) => {
  return (
    <label htmlFor={htmlFor} className={`block mb-1 font-medium ${className}`}>
      {children}
    </label>
  );
};
