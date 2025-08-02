import React from 'react';
import './VideoModal.css';

const VideoModal = ({ video, isOpen, onClose }) => {
  if (!isOpen || !video) return null;

  const getHighResThumbnail = (thumbnailUrl) => {
    if (!thumbnailUrl) return thumbnailUrl;


    
    if (thumbnailUrl.includes('mqdefault.jpg')) {
      return thumbnailUrl.replace('mqdefault.jpg', 'maxresdefault.jpg');
    }
    if (thumbnailUrl.includes('default.jpg')) {
      return thumbnailUrl.replace('default.jpg', 'hqdefault.jpg');
    }
    
    return thumbnailUrl;
  };

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

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleVideoClick = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  return (
    <div className="video-modal-overlay" onClick={handleOverlayClick}>
      <div className="video-modal-content">
        <button className="video-modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="video-modal-thumbnail">
          <img
            src={getHighResThumbnail(video.thumbnail)}
            alt={video.title}
            onError={(e) => {
              // Fallback to original thumbnail if high-res fails
              if (e.target.src !== video.thumbnail) {
                e.target.src = video.thumbnail;
                console.log('Error, using original thumbnail.');
              } else {
                e.target.style.display = 'none';
              }
            }}
          />
        </div>
        
        <div className="video-modal-info">
          <h2 className="video-modal-title">{video.title}</h2>
          <div className="video-modal-stats">
            <span className="video-modal-views">{formatViews(video.viewCount)}</span>
            <span className="video-modal-date">{formatDate(video.publishedAt)}</span>
          </div>
          <button className="video-modal-link-button" onClick={handleVideoClick}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
            Watch on YouTube
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;