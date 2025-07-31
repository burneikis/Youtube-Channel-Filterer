import React from 'react';
import './ApiKeyToggle.css';

const ApiKeyToggle = ({ onClick }) => {
  return (
    <button className="api-key-toggle" onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 10C6 8.89543 6.89543 8 8 8H16C17.1046 8 18 8.89543 18 10V14C18 15.1046 17.1046 16 16 16H8C6.89543 16 6 15.1046 6 14V10Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M10 8V6C10 4.89543 10.8954 4 12 4C13.1046 4 14 4.89543 14 6V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="1" fill="currentColor"/>
      </svg>
      API Key
    </button>
  );
};

export default ApiKeyToggle;