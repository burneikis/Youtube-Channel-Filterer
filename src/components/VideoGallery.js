import React, { useState, useEffect } from 'react';
import './VideoGallery.css';
import { fetchChannelVideos } from '../utils/channelApi';
import SortControls from './SortControls';
import FilterModal from './FilterModal';

const VideoGallery = ({ channelId, onVideoCountChange }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('mostViews');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ showShorts: false });

  useEffect(() => {
    const loadVideos = async () => {
      if (!channelId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const videoData = await fetchChannelVideos(channelId);
        setVideos(videoData);
        if (onVideoCountChange) {
          onVideoCountChange(videoData.length);
        }
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

  const sortVideos = (videosToSort, sortType) => {
    const sortedVideos = [...videosToSort];
    
    switch (sortType) {
      case 'newest':
        return sortedVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      case 'oldest':
        return sortedVideos.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
      case 'mostViews':
        return sortedVideos.sort((a, b) => parseInt(b.viewCount || 0) - parseInt(a.viewCount || 0));
      default:
        return sortedVideos;
    }
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
  };

  const applyFilters = (videosToFilter) => {
    let filteredVideos = [...videosToFilter];

    if (activeFilters.searchTerm) {
      const keywordList = activeFilters.searchTerm
        .toLowerCase()
        .split(',')
        .map(k => k.trim())
        .filter(k => k);
      
      filteredVideos = filteredVideos.filter(video => {
        const title = video.title.toLowerCase();
        const description = (video.description || '').toLowerCase();
        
        return keywordList.some(keyword => 
          title.includes(keyword) || description.includes(keyword)
        );
      });
    }

    if (activeFilters.showShorts === false) {
      filteredVideos = filteredVideos.filter(video => !video.isShort);
    }

    return filteredVideos;
  };

  const filteredVideos = applyFilters(videos);
  const sortedVideos = sortVideos(filteredVideos, sortBy);

  const calculateAverageViews = (videoList) => {
    if (videoList.length === 0) return 0;
    const totalViews = videoList.reduce((sum, video) => {
      return sum + parseInt(video.viewCount || 0);
    }, 0);
    return Math.round(totalViews / videoList.length);
  };

  const formatAverageViews = (avgViews) => {
    if (avgViews >= 1000000) {
      return `${(avgViews / 1000000).toFixed(1)}M avg views`;
    } else if (avgViews >= 1000) {
      return `${(avgViews / 1000).toFixed(1)}K avg views`;
    }
    return `${avgViews} avg views`;
  };

  const averageViews = calculateAverageViews(sortedVideos);

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
      <div className="video-gallery-header">
        <div className="video-gallery-title-section">
          <h2>Videos</h2>
          <div className="video-stats">
            <span className="video-count">{sortedVideos.length} videos shown</span>
            {sortedVideos.length > 0 && (
              <span className="average-views">{formatAverageViews(averageViews)}</span>
            )}
          </div>
        </div>
        <div className="video-controls">
          <button 
            className="filter-button"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
            </svg>
            Filters
          </button>
          <SortControls sortBy={sortBy} onSortChange={setSortBy} />
        </div>
      </div>
      <div className="video-grid">
        {sortedVideos.map((video) => (
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
      
      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default VideoGallery;