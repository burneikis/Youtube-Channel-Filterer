import React, { useState, useEffect } from 'react';
import './VideoGallery.css';
import { fetchChannelVideos } from '../utils/channelApi';

const VideoGallery = ({ channelId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVideos = async () => {
      if (!channelId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const videoData = await fetchChannelVideos(channelId);
        setVideos(videoData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [channelId]);

  const formatViews = (viewCount) => {
    if (!viewCount) return '0 views';
    const num = parseInt(viewCount);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M views`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K views`;
    }
    return `${num} views`;
  };

  const formatDate = (publishedAt) => {
    if (!publishedAt) return '';
    const date = new Date(publishedAt);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <div className="video-gallery">
        <h2>Videos</h2>
        <div className="loading">Loading videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-gallery">
        <h2>Videos</h2>
        <div className="error">
          <p>Failed to load videos: {error}</p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="video-gallery">
        <h2>Videos</h2>
        <div className="no-videos">No videos found for this channel.</div>
      </div>
    );
  }

  return (
    <div className="video-gallery">
      <h2>Videos</h2>
      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <div className="video-thumbnail">
              <img
                src={video.thumbnail}
                alt={video.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="video-info">
              <h3 className="video-title">{video.title}</h3>
              <div className="video-meta">
                <span className="video-views">{formatViews(video.viewCount)}</span>
                <span className="video-date">{formatDate(video.publishedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;