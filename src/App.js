import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import './App.css';
import ApiKeyManager from './components/ApiKeyManager';
import ApiKeyToggle from './components/ApiKeyToggle';
import SearchBar from './components/SearchBar';
import ChannelPage from './components/ChannelPage';
import { ThemeProvider } from './contexts/ThemeContext';

function HomePage() {
  const navigate = useNavigate();

  const handleChannelSearch = (channelName) => {
    navigate(`/${encodeURIComponent(channelName)}`);
  };

  return (
    <div className="home-container">
      <div className="content-center">
        <h1 className="app-title">Youtube Channel Filterer</h1>
        <SearchBar onSearch={handleChannelSearch} />
      </div>
    </div>
  );
}

function ChannelPageWrapper() {
  const { username } = useParams();
  const navigate = useNavigate();
  
  const handleBackToSearch = () => {
    navigate('/');
  };

  // Decode the URL parameter
  const decodedUsername = decodeURIComponent(username || '');

  if (!username) {
    return <div>No channel specified</div>;
  }

  return (
    <ChannelPage 
      channelName={decodedUsername} 
      onBack={handleBackToSearch}
    />
  );
}

function AppContent() {
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const toggleApiKeyManager = () => {
    setShowApiKeyManager(!showApiKeyManager);
  };

  return (
    <div className={`App ${isHomePage ? 'no-scroll' : ''}`}>
      <ApiKeyToggle onClick={toggleApiKeyManager} />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:username" element={<ChannelPageWrapper />} />
      </Routes>
      
      {showApiKeyManager && <ApiKeyManager onClose={toggleApiKeyManager} />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
