import React from "react";

// Main Card wrapper
export const Card = ({ children, className = "", variant = "default", hover = false }) => {
  const variants = {
    default: "bg-white/95 backdrop-blur-sm border border-white/30 shadow-soft",
    glass: "bg-white/80 backdrop-blur-md border border-white/20 shadow-soft",
    elevated: "bg-white shadow-medium border border-gray-100",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-soft"
  };
  
  const hoverClasses = hover ? "hover:shadow-medium hover:scale-[1.02] transition-all duration-300" : "";
  
  return (
    <div className={`${variants[variant]} rounded-2xl p-6 ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

// Card header
export const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`mb-4 border-b border-gray-200 pb-3 ${className}`}>
      {children}
    </div>
  );
};

// Card title
export const CardTitle = ({ children, className = "" }) => {
  return (
    <h3 className={`text-xl font-bold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

// Card subtitle
export const CardSubtitle = ({ children, className = "" }) => {
  return (
    <p className={`text-sm text-gray-600 mt-1 ${className}`}>
      {children}
    </p>
  );
};

// Card content
export const CardContent = ({ children, className = "" }) => {
  return <div className={`${className}`}>{children}</div>;
};

// Card footer
export const CardFooter = ({ children, className = "" }) => {
  return (
    <div className={`mt-4 pt-3 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};
