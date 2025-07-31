import React, { useState } from 'react';
import './App.css';
import ApiKeyManager from './components/ApiKeyManager';
import ApiKeyToggle from './components/ApiKeyToggle';
import SearchBar from './components/SearchBar';

function App() {
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);

  const toggleApiKeyManager = () => {
    setShowApiKeyManager(!showApiKeyManager);
  };

  return (
    <div className="App">
      <ApiKeyToggle onClick={toggleApiKeyManager} />
      
      <div className="home-container">
        <div className="content-center">
          <h1 className="app-title">Youtube Channel Filterer</h1>
          
          <SearchBar />
        </div>
      </div>
      
      {showApiKeyManager && <ApiKeyManager onClose={toggleApiKeyManager} />}
    </div>
  );
}

export default App;
