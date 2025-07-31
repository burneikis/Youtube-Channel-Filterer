export const fetchChannelData = async (channelName) => {
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
  
  // Fetch additional channel details to get the custom URL/username
  const channelResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,brandingSettings&id=${channelId}&key=${apiKey}`
  );
  
  let username = null;
  if (channelResponse.ok) {
    const channelData = await channelResponse.json();
    if (channelData.items && channelData.items.length > 0) {
      const channelDetails = channelData.items[0];
      username = channelDetails.snippet.customUrl || channelDetails.snippet.title.toLowerCase().replace(/\s+/g, '');
    }
  }
  
  return {
    displayName: channel.snippet.title,
    username: username,
    description: channel.snippet.description,
    thumbnail: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default?.url,
    channelId: channelId
  };
};