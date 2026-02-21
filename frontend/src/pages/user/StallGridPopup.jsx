import React from 'react';
import { Box } from '@mui/material';
import './StallReservation.css';

const StallGridPopup = ({
    hallName,
    stalls = [],
    selectedIds = [],
    onStallClick,
    onConfirm,
    onClose,
    maxSelection,
    currentTotalSelected
}) => {

    // Calculate remaining allowance based on global + local selection
    // Note: currentTotalSelected passed from parent should include (global - currentHall + currentPopup)
    const remainingSlots = Math.max(0, maxSelection - currentTotalSelected);

    return (
        <div className="popup-backdrop" onClick={onClose}>
            <div className="popup-card" onClick={(event) => event.stopPropagation()}>
                <div className="popup-header">
                    <h3>{hallName} - Stall Selection</h3>
                    <button type="button" className="close-btn" onClick={onClose}>✕</button>
                </div>

                <p className="popup-help">
                    {remainingSlots > 0
                        ? `Select up to ${remainingSlots} more stall${remainingSlots === 1 ? '' : 's'}`
                        : `Maximum limit of ${maxSelection} reached`
                    } (max {maxSelection} per business).
                </p>

                <div className="stall-type-legend" aria-label="Stall types">
                    <span className="legend-item small"><i className="legend-dot small" />Small</span>
                    <span className="legend-item medium"><i className="legend-dot medium" />Medium</span>
                    <span className="legend-item big"><i className="legend-dot big" />Big</span>
                </div>

                <div className="stall-selection-body" style={{ marginTop: '20px' }}>
                    <div className="stall-grid">
                        {stalls.length > 0 ? (
                            stalls.map((stall) => {
                                const isSelected = selectedIds.includes(stall.id);
                                const isReserved = stall.status === 'reserved';

                                return (
                                    <button
                                        key={stall.id}
                                        className={`stall-card ${stall.status} ${isSelected ? 'selected' : ''}`}
                                        onClick={() => onStallClick(stall)}
                                        disabled={isReserved}
                                        title={`${stall.name} - ${stall.size} - Rs. ${stall.price}`}
                                    >
                                        <strong>{stall.name}</strong>
                                        <small>{stall.size} • Rs.{stall.price}</small>
                                    </button>
                                );
                            })
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
                                <p style={{ fontWeight: 'bold' }}>No stalls configured for this hall yet.</p>
                                <small>Please contact admin or check back later.</small>
                            </div>
                        )}
                    </div>
                </div>

                <div className="popup-footer">
                    <span>Selected: {selectedIds.length ? selectedIds.join(', ') : 'None'}</span>
                    <button
                        type="button"
                        className="book-btn"
                        onClick={onConfirm}
                    >
                        Confirm Selection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StallGridPopup;
