import React, { useState } from 'react';
import './ChannelInfo.css';

const ChannelInfo = ({ channelData, videoCount }) => {
  const [imageError, setImageError] = useState(false);

  if (!channelData) return null;

  const formatSubscriberCount = (count) => {
    if (!count) return '';
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M subscribers`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K subscribers`;
    }
    return `${num} subscribers`;
  };

  const formatVideoCount = (count) => {
    if (count === null || count === undefined) return '';
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M videos`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K videos`;
    }
    return `${count} videos`;
  };

  return (
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
            <div className="channel-stats">
              {channelData.subscriberCount && (
                <p className="channel-subscriber-count">{formatSubscriberCount(channelData.subscriberCount)}</p>
              )}
              {videoCount !== null && videoCount !== undefined && (
                <p className="channel-video-count">{formatVideoCount(videoCount)}</p>
              )}
            </div>
          </div>
          {channelData.description && (
            <p className="channel-description">{channelData.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelInfo;