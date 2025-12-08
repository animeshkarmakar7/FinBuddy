import React from 'react';

// Custom Rupee Icon Component (₹)
const IndianRupee = ({ className = "w-6 h-6", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="M6 13l8.5 8" />
    <path d="M6 13h3c4.97 0 9-2.686 9-6 0-3.314-4.03-6-9-6H6" />
  </svg>
);

export default IndianRupee;
