import React, { useState, useEffect } from 'react';
import { saveApiKey, getApiKey, removeApiKey } from '../utils/apiKey';
import './ApiKeyManager.css';

const ApiKeyManager = ({ onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isStored, setIsStored] = useState(false);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const storedKey = getApiKey();
    if (storedKey) {
      setApiKey(storedKey);
      setIsStored(true);
    } else {
      setShowInput(true);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
      setIsStored(true);
      setShowInput(false);
    }
  };

  const handleEdit = () => {
    setShowInput(true);
    setIsStored(false);
  };

  const handleRemove = () => {
    removeApiKey();
    setApiKey('');
    setIsStored(false);
    setShowInput(true);
  };

  const handleCancel = () => {
    const storedKey = getApiKey();
    if (storedKey) {
      setApiKey(storedKey);
      setShowInput(false);
      setIsStored(true);
    } else {
      setApiKey('');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="api-key-overlay" onClick={handleOverlayClick}>
      <div className="api-key-manager">
      <h3>YouTube API Key</h3>
      
      {showInput ? (
        <div className="api-key-input-section">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your YouTube API v3 key"
            className="api-key-input"
          />
          <div className="api-key-buttons">
            <button onClick={handleSave} className="save-btn">
              Save
            </button>
            {isStored && (
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="api-key-status">
          <p className="api-key-stored">✓ API Key stored securely</p>
          <div className="api-key-buttons">
            <button onClick={handleEdit} className="edit-btn">
              Edit
            </button>
            <button onClick={handleRemove} className="remove-btn">
              Remove
            </button>
          </div>
        </div>
      )}
      
        <p className="api-key-help">
          Get your YouTube API key from the{' '}
          <a 
            href="https://console.developers.google.com/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Google Developers Console
          </a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyManager;