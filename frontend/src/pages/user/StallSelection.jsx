import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import UserNavbar from '../../components/layout/UserNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import StallGridPopup from './StallGridPopup';
import './StallReservation.css';
import { getStoredAuth } from '../../api/dashboardApi';
import { getReservationByUserId as getReservationsByUserId } from '../../api/reservationsApi';
import { logoutUser } from '../../api/authApi';

import { getAllStalls } from '../../api/stallsApi';
import mapImage from '../../assets/map.png';

import { ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';

const GLOBAL_LIMIT = 3;
const MAP_IMAGE_SRC = mapImage;

// Simplified map data
const mapData = {
    map_name: 'BMICH Exhibition Center',
    locations: [
        { id: 'main_bldg', name: 'BMICH Main Building', x: 32, y: 70 },
        { id: 'hall_a', name: 'Hall A', x: 64, y: 22 },
        { id: 'hall_b', name: 'Hall B', x: 79, y: 22 },
        { id: 'hall_c', name: 'Hall C', x: 62, y: 45 },
        { id: 'hall_d', name: 'Hall D', x: 81, y: 45 },
        { id: 'hall_m', name: 'Hall M', x: 28, y: 10 },
        { id: 'hall_l', name: 'Hall L', x: 28, y: 15 },
        { id: 'hall_p', name: 'Hall P', x: 32, y: 25 },
        { id: 'hall_q', name: 'Hall Q', x: 36, y: 25 },
        { id: 'hall_r_west', name: 'Hall R (West)', x: 32, y: 38 },
        { id: 'hall_r_south', name: 'Hall R (South)', x: 67, y: 68 },
        { id: 'hall_j', name: 'Hall J', x: 42, y: 40 },
        { id: 'hall_k', name: 'Hall K', x: 36, y: 38 },
        { id: 'hall_n', name: 'Hall N', x: 48, y: 10 },
        { id: 'gate_main', name: 'Main Entrance', x: 30, y: 95 },
        { id: 'gate_2', name: 'Gate 2 (Malalasekara Mawatha)', x: 78, y: 57 },
        { id: 'gate_3', name: 'Gate 3', x: 46, y: 28 },
    ],
};

const StallSelection = ({ onStallsSelected, initialSelected = [], isStandalone = true }) => {
    const navigate = useNavigate();
    const [mapSource, setMapSource] = useState(MAP_IMAGE_SRC);
    const [activeHallId, setActiveHallId] = useState(null);
    const user = getStoredAuth();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };
    const [selectedInPopup, setSelectedInPopup] = useState([]);
    const [backendStalls, setBackendStalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reservedCount, setReservedCount] = useState(0);

    // Fetch User Reservations to calculate remaining limit
    useEffect(() => {
        const id = user?.userId || user?.id;
        if (id) {
            getReservationsByUserId(id)
                .then(response => {
                    const reservations = response.data || [];
                    // Count stalls in non-cancelled reservations
                    const count = reservations
                        .filter(r => r.reservationStatus !== 'CANCELLED')
                        .reduce((acc, r) => acc + (r.stallCodes ? r.stallCodes.length : 0), 0);
                    setReservedCount(count);
                })
                .catch(err => console.error("Failed to fetch reservations:", err));
        }
    }, [user]);

    // Fetch Stalls
    useEffect(() => {
        const fetchStalls = async () => {
            try {
                const response = await getAllStalls();
                if (response.success && Array.isArray(response.data)) {
                    setBackendStalls(response.data);
                } else {
                    console.warn("API returned success but data is not an array:", response);
                    setBackendStalls([]);
                }
            } catch (error) {
                console.error("Failed to fetch stalls:", error);
                setBackendStalls([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStalls();
    }, []);

    // Local state for standalone mode
    const [localSelected, setLocalSelected] = useState([]);
    const currentGlobalSelection = isStandalone ? localSelected : initialSelected;

    useEffect(() => {
        if (isStandalone && initialSelected.length > 0) {
            setLocalSelected(initialSelected);
        }
    }, [initialSelected, isStandalone]);

    // Group backend stalls by Hall
    const hallStallsFromDb = useMemo(() => {
        if (!Array.isArray(backendStalls) || !backendStalls.length) return {};

        const groups = {};

        // Initialize groups for all known locations to be safe
        mapData.locations.forEach(loc => {
            if (loc.id.startsWith('hall_')) {
                groups[loc.id] = [];
            }
        });

        // Debug log
        console.log("StallSelection: Grouping stalls. Raw:", backendStalls);

        backendStalls.forEach(stall => {
            // Normalize: 'A-555' -> 'A', 'B102' -> 'B', 'M-1' -> 'M'
            const code = stall.stallCode || '';
            const prefix = code.charAt(0).toUpperCase(); // First letter

            // Construct hall ID: 'hall_a', 'hall_b', 'hall_m'
            let hallId = `hall_${prefix.toLowerCase()}`;

            // Special handling for R -> hall_r_west (default for now)
            if (prefix === 'R') {
                hallId = 'hall_r_west';
            }

            // Check if this hall exists in our map locations
            if (groups[hallId]) {
                groups[hallId].push({
                    id: stall.stallCode,
                    dbId: stall.stallId, // Fixed: Backend sends 'stallId'
                    name: stall.stallCode,
                    status: stall.stallStatus?.toLowerCase() || 'available',
                    price: stall.price,
                    size: stall.stallSize,
                    type: 'standard'
                });
            } else {
                console.warn(`StallSelection: Stall ${code} mapped to ${hallId} which is not a known map location.`);
            }
        });

        console.log("StallSelection: Grouped Stalls:", groups);

        return groups;
    }, [backendStalls]);

    const activeStalls = activeHallId ? hallStallsFromDb[activeHallId] || [] : [];
    const activeLocation = useMemo(
        () => mapData.locations.find((loc) => loc.id === activeHallId) || {},
        [activeHallId]
    );

    // Actions
    const openHallPopup = (hallId) => {
        const existingInHall = currentGlobalSelection
            .filter(s => s.hallId === hallId)
            .map(s => s.id);

        setActiveHallId(hallId);
        setSelectedInPopup(existingInHall);
    };

    const closePopup = () => {
        setActiveHallId(null);
        setSelectedInPopup([]);
    };

    const handleStallSelect = (stall) => {
        if (stall.status === 'reserved') return;

        const alreadySelected = selectedInPopup.includes(stall.id);

        if (alreadySelected) {
            setSelectedInPopup((previous) => previous.filter((id) => id !== stall.id));
            return;
        }

        const currentOnPageCount = currentGlobalSelection.length - existingInHallCount + selectedInPopup.length;
        const availableNow = Math.max(0, GLOBAL_LIMIT - reservedCount);

        if (currentOnPageCount >= availableNow) {
            window.alert(`You have already reserved ${reservedCount} stalls. You can only select ${availableNow} more in this session.`);
            return;
        }

        setSelectedInPopup((previous) => [...previous, stall.id]);
    };

    const confirmSelection = () => {
        if (!activeHallId) return;

        // 1. Preserve other halls
        const otherHallStalls = currentGlobalSelection.filter(s => s.hallId !== activeHallId);

        // 2. Build current selection objects
        const currentHallStalls = selectedInPopup.map(stallId => {
            // Find full object from activeStalls OR fallback to existing selection details
            const fullStall = activeStalls.find(s => s.id === stallId);
            const existing = currentGlobalSelection.find(s => s.id === stallId);

            return {
                id: stallId,
                dbId: fullStall ? fullStall.dbId : existing?.dbId,
                hallId: activeHallId,
                hallName: activeLocation?.name,
                price: fullStall ? fullStall.price : existing?.price,
                size: fullStall ? fullStall.size : existing?.size
            };
        });

        const finalSelection = [...otherHallStalls, ...currentHallStalls];

        if (isStandalone) {
            setLocalSelected(finalSelection);
        }

        if (onStallsSelected) {
            onStallsSelected(finalSelection);
        }

        closePopup();
    };

    // Calculate totals for Child Component
    const existingInHallCount = activeHallId ? currentGlobalSelection.filter(s => s.hallId === activeHallId).length : 0;
    // Dynamic max for this page session
    const dynamicMaxOnPage = Math.max(0, GLOBAL_LIMIT - reservedCount);
    // Current usage on this page (global - this hall + popup)
    const currentOnPageSelectionCount = currentGlobalSelection.length - existingInHallCount + selectedInPopup.length;

    // Main Content
    const content = (
        <div className="stall-reservation-shell">
            <div className="stall-reservation-page">
                <h2>BMICH Hall Map</h2>
                <p className="subtitle">
                    <span className="subtitle-note">Click a Hall button on the map to select stalls.</span>
                    <span className="subtitle-badge">
                        Selected: {currentGlobalSelection.length}
                        / {Math.max(0, dynamicMaxOnPage)} Available
                        {reservedCount > 0 && ` (${reservedCount} already reserved)`}
                    </span>

                    {isStandalone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
                            <motion.div
                                whileHover={{ x: -4 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <button
                                    className="back-btn"
                                    onClick={() => navigate('/user/dashboard')}
                                    style={{
                                        padding: '10px 24px',
                                        backgroundColor: 'transparent',
                                        color: theme.palette.text.secondary,
                                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                        borderRadius: '30px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <ArrowBack fontSize="small" /> Back
                                </button>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <button
                                    className="proceed-btn"
                                    disabled={currentGlobalSelection.length === 0}
                                    onClick={() => {
                                        navigate('/user/stall-reservation', {
                                            state: {
                                                selectedStalls: currentGlobalSelection,
                                                initialStep: 1
                                            }
                                        });
                                    }}
                                    style={{
                                        padding: '10px 24px',
                                        backgroundColor: currentGlobalSelection.length === 0 ? '#e0e0e0' : theme.palette.primary.main,
                                        color: currentGlobalSelection.length === 0 ? '#9e9e9e' : 'white',
                                        border: 'none',
                                        borderRadius: '30px',
                                        cursor: currentGlobalSelection.length === 0 ? 'not-allowed' : 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: currentGlobalSelection.length === 0 ? 'none' : `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Proceed to Payment <ArrowForward fontSize="small" />
                                </button>
                            </motion.div>
                        </Box>
                    )}
                </p>

                <div className="overview-map-wrapper">
                    <img
                        src={mapSource}
                        alt={mapData.map_name}
                        className="overview-map-image"
                        onError={() => setMapSource(mapImage)}
                    />

                    {mapData.locations.map((location) => {
                        const isHall = location.id.startsWith('hall_');
                        let label = location.name;

                        // Simplify label for button e.g. "Hall A" -> "A"
                        if (isHall) {
                            const parts = location.id.split('_');
                            if (parts.length >= 2) {
                                label = parts[1].toUpperCase();
                            }
                        }

                        return (
                            <button
                                key={location.id}
                                type="button"
                                className={`map-point ${isHall ? 'hall' : 'other'} ${activeHallId === location.id ? 'active-hall-marker' : ''}`}
                                style={{ top: `${location.y}%`, left: `${location.x}%` }}
                                onClick={() => (isHall ? openHallPopup(location.id) : undefined)}
                                disabled={!isHall}
                                title={location.name}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {activeHallId && (
                    <StallGridPopup
                        hallName={activeLocation?.name || 'Hall'}
                        stalls={activeStalls}
                        selectedIds={selectedInPopup}
                        onStallClick={handleStallSelect}
                        onConfirm={confirmSelection}
                        onClose={closePopup}
                        maxSelection={dynamicMaxOnPage}
                        currentTotalSelected={currentOnPageSelectionCount}
                    />
                )}
            </div>
        </div>
    );

    if (isStandalone) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <UserNavbar userName={user?.businessName || 'User'} onLogout={handleLogout} />
                <Box component="main" sx={{ flexGrow: 1 }}>
                    {content}
                </Box>
                <SiteFooter />
            </Box>
        );
    }

    return content;
};

export default StallSelection;
