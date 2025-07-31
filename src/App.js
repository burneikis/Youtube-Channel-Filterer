import React, { useState } from 'react';
import './App.css';
import ApiKeyManager from './components/ApiKeyManager';
import ApiKeyToggle from './components/ApiKeyToggle';
import SearchBar from './components/SearchBar';
import ChannelPage from './components/ChannelPage';

function App() {
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);
  const [currentView, setCurrentView] = useState('search');
  const [selectedChannel, setSelectedChannel] = useState('');

  const toggleApiKeyManager = () => {
    setShowApiKeyManager(!showApiKeyManager);
  };

  const handleChannelSearch = (channelName) => {
    setSelectedChannel(channelName);
    setCurrentView('channel');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedChannel('');
  };

  return (
    <div className={`App ${currentView === 'search' ? 'no-scroll' : ''}`}>
      <ApiKeyToggle onClick={toggleApiKeyManager} />
      
      {currentView === 'search' ? (
        <div className="home-container">
          <div className="content-center">
            <h1 className="app-title">Youtube Channel Filterer</h1>
            
            <SearchBar onSearch={handleChannelSearch} />
          </div>
        </div>
      ) : (
        <ChannelPage 
          channelName={selectedChannel} 
          onBack={handleBackToSearch}
        />
      )}
      
      {showApiKeyManager && <ApiKeyManager onClose={toggleApiKeyManager} />}
    </div>
  );
}

export default App;
