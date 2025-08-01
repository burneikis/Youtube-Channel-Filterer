import FAKE_CHANNELS from '../data/fakeChannels.json';
import FAKE_VIDEOS from '../data/fakeVideos.json';

export const fetchChannelData = async (channelName) => {
  const useFakeData = localStorage.getItem('use_fake_data') === 'true';
  
  if (useFakeData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const fakeChannel = FAKE_CHANNELS[channelName];
    if (!fakeChannel) {
      throw new Error('Channel not found');
    }
    
    return fakeChannel;
  }

  const apiKey = localStorage.getItem('youtube_api_key');
  if (!apiKey) {
    throw new Error('YouTube API key not found. Please set your API key.');
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(channelName)}&key=${apiKey}&maxResults=1`
  );

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    throw new Error('Channel not found');
  }

  const channel = data.items[0];
  const channelId = channel.snippet.channelId;
  
  // Fetch additional channel details to get the custom URL/username and subscriber count
  const channelResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,brandingSettings,statistics&id=${channelId}&key=${apiKey}`
  );
  
  let username = null;
  let subscriberCount = null;
  if (channelResponse.ok) {
    const channelData = await channelResponse.json();
    if (channelData.items && channelData.items.length > 0) {
      const channelDetails = channelData.items[0];
      username = channelDetails.snippet.customUrl || channelDetails.snippet.title.toLowerCase().replace(/\s+/g, '');
      subscriberCount = channelDetails.statistics?.subscriberCount;
    }
  }
  
  return {
    displayName: channel.snippet.title,
    username: username,
    description: channel.snippet.description,
    thumbnail: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default?.url,
    channelId: channelId,
    subscriberCount: subscriberCount
  };
};

const isVideoShort = (duration) => {
  // Parse ISO 8601 duration format (PT1M30S = 1 minute 30 seconds)
  if (!duration) return false;
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return false;
  
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds <= 60;
};

export const getAvailableFakeChannels = () => {
  return Object.keys(FAKE_CHANNELS);
};

const fetchWithRetry = async (url, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
      if (response.status === 429) {
        // Rate limited, wait and retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

const getChannelInfo = async (channelId, apiKey) => {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${channelId}&key=${apiKey}`;
  try {
    const data = await fetchWithRetry(url);
    return data.items && data.items.length > 0 ? data.items[0] : null;
  } catch (error) {
    console.error('Error getting channel info:', error);
    return null;
  }
};

export const fetchChannelVideos = async (channelId) => {
  const useFakeData = localStorage.getItem('use_fake_data') === 'true';
  
  if (useFakeData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const fakeVideos = FAKE_VIDEOS[channelId] || [];
    return fakeVideos;
  }

  const apiKey = localStorage.getItem('youtube_api_key');
  if (!apiKey) {
    throw new Error('YouTube API key not found. Please set your API key.');
  }

  // Get channel info to find the uploads playlist
  const channelInfo = await getChannelInfo(channelId, apiKey);
  if (!channelInfo) {
    throw new Error('Could not find channel information');
  }

  const uploadsPlaylistId = channelInfo.contentDetails.relatedPlaylists.uploads;
  if (!uploadsPlaylistId) {
    throw new Error('Could not find uploads playlist');
  }

  let allVideos = [];
  let nextPageToken = null;

  do {
    let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`;
    if (nextPageToken) {
      url += `&pageToken=${nextPageToken}`;
    }

    try {
      const data = await fetchWithRetry(url);
      
      if (!data.items || data.items.length === 0) {
        break;
      }

      // Convert playlist items to search format for compatibility
      const items = data.items.map(item => ({
        id: { videoId: item.snippet.resourceId.videoId },
        snippet: item.snippet
      }));

      allVideos.push(...items);
      nextPageToken = data.nextPageToken;
      
      // Small delay to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error('Error fetching videos:', error);
      break;
    }
  } while (nextPageToken);

  if (allVideos.length === 0) {
    return [];
  }

  // Get video IDs to fetch statistics and content details (including duration)
  const videoIds = allVideos.map(item => item.id.videoId);
  const batchSize = 50;
  let videoDetails = {};

  // Fetch video details in batches
  for (let i = 0; i < videoIds.length; i += batchSize) {
    const batchIds = videoIds.slice(i, i + batchSize);
    
    try {
      const videoDetailsResponse = await fetchWithRetry(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${batchIds.join(',')}&key=${apiKey}`
      );
      
      if (videoDetailsResponse.items) {
        videoDetailsResponse.items.forEach(item => {
          const stats = item.statistics || {};
          const contentDetails = item.contentDetails || {};
          const duration = contentDetails.duration || '';
          
          videoDetails[item.id] = {
            viewCount: stats.viewCount || '0',
            likeCount: stats.likeCount || '0',
            commentCount: stats.commentCount || '0',
            duration: duration,
            isShort: isVideoShort(duration)
          };
        });
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error('Error fetching video statistics:', error);
    }
  }

  return allVideos.map(item => {
    const details = videoDetails[item.id.videoId] || {};
    return {
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description || '',
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      viewCount: details.viewCount,
      likeCount: details.likeCount,
      commentCount: details.commentCount,
      duration: details.duration,
      isShort: details.isShort
    };
  });
};