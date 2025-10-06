import React from "react";

// Main Card wrapper
export const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white shadow-md rounded-md p-4 ${className}`}>
      {children}
    </div>
  );
};

// Card header
export const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`mb-2 border-b pb-2 font-semibold text-lg ${className}`}>
      {children}
    </div>
  );
};

// Card title
export const CardTitle = ({ children, className = "" }) => {
  return (
    <h3 className={`text-md font-bold ${className}`}>
      {children}
    </h3>
  );
};

// Card content
export const CardContent = ({ children, className = "" }) => {
  return <div className={`${className}`}>{children}</div>;
};
