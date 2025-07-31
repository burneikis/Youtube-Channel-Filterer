import React, { useState } from 'react';
import './ChannelInfo.css';

const ChannelInfo = ({ channelData }) => {
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
            {channelData.subscriberCount && (
              <p className="channel-subscriber-count">{formatSubscriberCount(channelData.subscriberCount)}</p>
            )}
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