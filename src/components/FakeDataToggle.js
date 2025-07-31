import React, { useState, useEffect } from 'react';
import './FakeDataToggle.css';

function FakeDataToggle() {
  const [useFakeData, setUseFakeData] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('use_fake_data') === 'true';
    setUseFakeData(saved);
  }, []);

  const handleToggle = () => {
    const newValue = !useFakeData;
    setUseFakeData(newValue);
    localStorage.setItem('use_fake_data', newValue.toString());
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('fakeDataToggle', { detail: newValue }));
  };

  return (
    <div className="fake-api-toggle">
      <label className="toggle-label">
        <input
          type="checkbox"
          checked={useFakeData}
          onChange={handleToggle}
          className="toggle-checkbox"
        />
        <span className="toggle-slider"></span>
        <span className="toggle-text">Fake API</span>
      </label>
    </div>
  );
}

export default FakeDataToggle;