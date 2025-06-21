// client/src/config.ts
const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
};

const getWsUrl = () => {
  const apiUrl = getApiUrl();
  // Create a WebSocket URL from the API URL
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  // If the API URL is a full URL, extract the host. Otherwise, use the window's host.
  try {
    const url = new URL(apiUrl);
    return `${wsProtocol}//${url.host}/ws`;
  } catch (e) {
    return `${wsProtocol}//${window.location.host}/ws`;
  }
};

export const API_URL = getApiUrl();
export const WS_URL = getWsUrl(); 