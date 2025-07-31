import React, { useState } from 'react';
import './FilterModal.css';

const FilterModal = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    showShorts: true
  });

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      searchTerm: '',
      showShorts: true
    });
  };

  if (!isOpen) return null;

  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="filter-modal-header">
          <h3>Filter Videos</h3>
          <button className="close-button" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="filter-modal-content">
          <div className="filter-group">
            <label htmlFor="search-term">Search in titles:</label>
            <input
              id="search-term"
              type="text"
              value={filters.searchTerm}
              onChange={(e) => handleInputChange('searchTerm', e.target.value)}
              placeholder="Enter keywords..."
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <div className="toggle-group">
              <label htmlFor="shorts-toggle" className="toggle-label">
                <input
                  id="shorts-toggle"
                  type="checkbox"
                  checked={filters.showShorts}
                  onChange={(e) => handleInputChange('showShorts', e.target.checked)}
                  className="toggle-checkbox"
                />
                <span className="toggle-slider"></span>
                Show Shorts
              </label>
            </div>
          </div>
        </div>

        <div className="filter-modal-actions">
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
          <div className="action-buttons">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="apply-button" onClick={handleApply}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;