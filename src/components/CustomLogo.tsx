import React from 'react';

const CustomLogo = ({ className = "w-6 h-6" }: { className?: string }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* LocalLens Logo - Civic Engagement Focus */}
      {/* Main building/government structure */}
      <path 
        d="M4 20h16v-2H4v2zm0-4h16v-2H4v2zm0-4h16v-2H4v2zm0-4h16V6H4v2zm0-4h16V2H4v2z" 
        fill="currentColor"
        opacity="0.8"
      />
      
      {/* AI/Technology elements - circuit pattern */}
      <path 
        d="M6 4h2v2H6V4zm4 0h2v2h-2V4zm4 0h2v2h-2V4z" 
        fill="currentColor"
        opacity="0.6"
      />
      
      {/* Community/People representation */}
      <circle cx="7" cy="10" r="1" fill="currentColor" opacity="0.9"/>
      <circle cx="12" cy="10" r="1" fill="currentColor" opacity="0.9"/>
      <circle cx="17" cy="10" r="1" fill="currentColor" opacity="0.9"/>
      <circle cx="9.5" cy="14" r="1" fill="currentColor" opacity="0.9"/>
      <circle cx="14.5" cy="14" r="1" fill="currentColor" opacity="0.9"/>
      
      {/* Clarity/AI sparkle effect */}
      <path 
        d="M19 6l1-1 1 1-1 1-1-1z" 
        fill="currentColor"
        opacity="0.7"
      />
      <path 
        d="M5 6l1-1 1 1-1 1-1-1z" 
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
};

export default CustomLogo;
