import React, { useState, useEffect, useCallback } from 'react';
import './ChannelPage.css';
import { fetchChannelData as fetchChannelDataFromAPI } from '../utils/channelApi';

const ChannelPage = ({ channelName, onBack }) => {
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  const fetchChannelData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setImageError(false);
    
    try {
      const data = await fetchChannelDataFromAPI(channelName);
      setChannelData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [channelName]);

  useEffect(() => {
    fetchChannelData();
  }, [fetchChannelData]);

  if (loading) {
    return (
      <div className="channel-page">
        <button className="back-button" onClick={onBack}>← Back to Search</button>
        <div className="loading">Loading channel information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="channel-page">
        <button className="back-button" onClick={onBack}>← Back to Search</button>
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchChannelData} className="retry-button">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="channel-page">
      <button className="back-button" onClick={onBack}>← Back to Search</button>
      
      {channelData && (
        <div className="channel-info">
          <div className="channel-header">
            {!imageError && channelData.thumbnail ? (
              <img 
                src={channelData.thumbnail} 
                alt={`${channelData.displayName} profile`}
                className="channel-avatar"
                onError={() => setImageError(true)}
                crossOrigin="anonymous"
              />
            ) : (
              <div className="channel-avatar-fallback">
                <span className="channel-initial">
                  {channelData.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="channel-details">
              <div className="channel-name-section">
                <h1 className="channel-display-name">{channelData.displayName}</h1>
                {channelData.username && (
                  <p className="channel-username">{channelData.username}</p>
                )}
              </div>
              {channelData.description && (
                <p className="channel-description">{channelData.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelPage;