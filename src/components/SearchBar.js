import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import { getAvailableFakeChannels } from '../utils/channelApi';

const SearchBar = ({ placeholder = "Choose a channel", onSearch }) => {
  const [channelName, setChannelName] = useState('');
  const [useFakeData, setUseFakeData] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setUseFakeData(localStorage.getItem('use_fake_data') === 'true');
    };

    const handleFakeDataToggle = () => {
      setUseFakeData(localStorage.getItem('use_fake_data') === 'true');
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('fakeDataToggle', handleFakeDataToggle);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fakeDataToggle', handleFakeDataToggle);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (channelName.trim() && onSearch) {
      onSearch(channelName.trim());
    }
  };

  const handleFakeChannelClick = (channel) => {
    setChannelName(channel);
    if (onSearch) {
      onSearch(channel);
    }
  };

  const fakeChannels = getAvailableFakeChannels();

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            type="text"
            className="search-bar"
            placeholder={placeholder}
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
        </div>
      </form>
      
      {useFakeData && (
        <div className="fake-channels-hint">
          <p>Available test channels:</p>
          <div className="fake-channels-list">
            {fakeChannels.map(channel => (
              <button 
                key={channel}
                className="fake-channel-button"
                onClick={() => handleFakeChannelClick(channel)}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;