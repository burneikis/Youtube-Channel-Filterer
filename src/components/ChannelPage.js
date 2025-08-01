import React, { useState, useEffect, useCallback } from 'react';
import './ChannelPage.css';
import { fetchChannelData as fetchChannelDataFromAPI } from '../utils/channelApi';
import VideoGallery from './VideoGallery';
import ChannelInfo from './ChannelInfo';

const ChannelPage = ({ channelName, onBack }) => {
  const BackButton = ({ onClick }) => (
    <button className="back-button" onClick={onClick}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6" />
      </svg>
      Back to Search
    </button>
  );
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoCount, setVideoCount] = useState(null);

  const fetchChannelData = useCallback(async () => {
    setLoading(true);
    setError(null);

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
        <BackButton onClick={onBack} />
        <div className="loading">Loading channel information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="channel-page">
        <BackButton onClick={onBack} />
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchChannelData} className="retry-button">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="channel-page-wrapper">
      <div className="channel-page">
        <BackButton onClick={onBack} />

        <ChannelInfo channelData={channelData} videoCount={videoCount} />
      </div>
      
      {channelData && <VideoGallery channelId={channelData.channelId} onVideoCountChange={setVideoCount} />}
    </div>
  );
};

export default ChannelPage;