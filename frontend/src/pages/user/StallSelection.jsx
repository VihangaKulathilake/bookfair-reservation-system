import React, { useMemo, useState } from 'react';
import NavBar from '../../components/layout/NavBar';
import './StallReservation.css';

const MAX_SELECTION = 3;
const MAP_IMAGE_SRC = '/assets/map.png';

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

const initialHallStalls = {
	hall_a: [
		{ id: 'A1', size: 'small', status: 'available' },
		{ id: 'A2', size: 'small', status: 'reserved' },
		{ id: 'A3', size: 'medium', status: 'available' },
		{ id: 'A4', size: 'large', status: 'available' },
		{ id: 'A5', size: 'medium', status: 'available' },
		{ id: 'A6', size: 'large', status: 'available' },
	],
	hall_b: [
		{ id: 'B1', size: 'small', status: 'available' },
		{ id: 'B2', size: 'small', status: 'available' },
		{ id: 'B3', size: 'medium', status: 'reserved' },
		{ id: 'B4', size: 'large', status: 'available' },
		{ id: 'B5', size: 'medium', status: 'available' },
		{ id: 'B6', size: 'large', status: 'available' },
	],
	hall_c: [
		{ id: 'C1', size: 'small', status: 'available' },
		{ id: 'C2', size: 'small', status: 'reserved' },
		{ id: 'C3', size: 'medium', status: 'available' },
		{ id: 'C4', size: 'large', status: 'available' },
		{ id: 'C5', size: 'medium', status: 'available' },
		{ id: 'C6', size: 'large', status: 'available' },
	],
	hall_d: [
		{ id: 'D1', size: 'small', status: 'available' },
		{ id: 'D2', size: 'small', status: 'available' },
		{ id: 'D3', size: 'medium', status: 'available' },
		{ id: 'D4', size: 'large', status: 'reserved' },
		{ id: 'D5', size: 'medium', status: 'available' },
		{ id: 'D6', size: 'large', status: 'available' },
	],
	hall_j: [
		{ id: 'J1', size: 'small', status: 'available' },
		{ id: 'J2', size: 'small', status: 'available' },
		{ id: 'J3', size: 'medium', status: 'available' },
		{ id: 'J4', size: 'large', status: 'reserved' },
		{ id: 'J5', size: 'medium', status: 'available' },
		{ id: 'J6', size: 'large', status: 'available' },
	],
	hall_k: [
		{ id: 'K1', size: 'small', status: 'available' },
		{ id: 'K2', size: 'small', status: 'reserved' },
		{ id: 'K3', size: 'medium', status: 'available' },
		{ id: 'K4', size: 'large', status: 'available' },
		{ id: 'K5', size: 'medium', status: 'available' },
		{ id: 'K6', size: 'large', status: 'available' },
	],
	hall_n: [
		{ id: 'N1', size: 'small', status: 'available' },
		{ id: 'N2', size: 'small', status: 'available' },
		{ id: 'N3', size: 'medium', status: 'reserved' },
		{ id: 'N4', size: 'large', status: 'available' },
		{ id: 'N5', size: 'medium', status: 'available' },
		{ id: 'N6', size: 'large', status: 'available' },
	],
	hall_m: [
		{ id: 'M1', size: 'small', status: 'available' },
		{ id: 'M2', size: 'small', status: 'reserved' },
		{ id: 'M3', size: 'medium', status: 'available' },
		{ id: 'M4', size: 'large', status: 'available' },
		{ id: 'M5', size: 'medium', status: 'available' },
		{ id: 'M6', size: 'large', status: 'available' },
	],
	hall_l: [
		{ id: 'L1', size: 'small', status: 'available' },
		{ id: 'L2', size: 'small', status: 'available' },
		{ id: 'L3', size: 'medium', status: 'reserved' },
		{ id: 'L4', size: 'large', status: 'available' },
		{ id: 'L5', size: 'medium', status: 'available' },
		{ id: 'L6', size: 'large', status: 'available' },
	],
	hall_p: [
		{ id: 'P1', size: 'small', status: 'available' },
		{ id: 'P2', size: 'small', status: 'available' },
		{ id: 'P3', size: 'medium', status: 'available' },
		{ id: 'P4', size: 'large', status: 'reserved' },
		{ id: 'P5', size: 'medium', status: 'available' },
		{ id: 'P6', size: 'large', status: 'available' },
	],
	hall_q: [
		{ id: 'Q1', size: 'small', status: 'available' },
		{ id: 'Q2', size: 'small', status: 'reserved' },
		{ id: 'Q3', size: 'medium', status: 'available' },
		{ id: 'Q4', size: 'large', status: 'available' },
		{ id: 'Q5', size: 'medium', status: 'available' },
		{ id: 'Q6', size: 'large', status: 'available' },
	],
	hall_r: [
		{ id: 'R1', size: 'small', status: 'available' },
		{ id: 'R2', size: 'small', status: 'available' },
		{ id: 'R3', size: 'medium', status: 'reserved' },
		{ id: 'R4', size: 'large', status: 'available' },
		{ id: 'R5', size: 'medium', status: 'available' },
		{ id: 'R6', size: 'large', status: 'available' },
	],
};

const StallSelection = () => {
	const [mapSource, setMapSource] = useState(MAP_IMAGE_SRC);
	const [hallStalls, setHallStalls] = useState(initialHallStalls);
	const [activeHallId, setActiveHallId] = useState(null);
	const [selectedInPopup, setSelectedInPopup] = useState([]);
	const [bookedByBusiness, setBookedByBusiness] = useState([]);

	const getHallStallKey = (hallId) => (hallId.startsWith('hall_r') ? 'hall_r' : hallId);

	const activeLocation = useMemo(
		() => mapData.locations.find((loc) => loc.id === activeHallId) || null,
		[activeHallId]
	);

	const activeStalls = activeHallId ? hallStalls[getHallStallKey(activeHallId)] || [] : [];
	const remainingSlots = MAX_SELECTION - bookedByBusiness.length;

	const openHallPopup = (hallId) => {
		if (remainingSlots <= 0) {
			window.alert('You have already reserved 3 stalls for this business.');
			return;
		}

		setActiveHallId(hallId);
		setSelectedInPopup([]);
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

		if (selectedInPopup.length >= remainingSlots) {
			window.alert(`You can reserve only ${MAX_SELECTION} stalls per business.`);
			return;
		}

		setSelectedInPopup((previous) => [...previous, stall.id]);
	};

	const bookSelectedStalls = () => {
		if (!selectedInPopup.length || !activeHallId) {
			window.alert('Please select at least one stall.');
			return;
		}

		if (selectedInPopup.length > remainingSlots) {
			window.alert(`You can reserve only ${MAX_SELECTION} stalls per business.`);
			return;
		}

		const activeHallStallKey = getHallStallKey(activeHallId);
		const bookedStallKeys = selectedInPopup.map((stallId) => `${activeHallStallKey}:${stallId}`);

		setHallStalls((previous) => ({
			...previous,
			[activeHallStallKey]: previous[activeHallStallKey].map((stall) =>
				selectedInPopup.includes(stall.id) ? { ...stall, status: 'reserved' } : stall
			),
		}));
		setBookedByBusiness((previous) => [...previous, ...bookedStallKeys]);

		window.alert(`Booked stalls in ${activeLocation?.name}: ${selectedInPopup.join(', ')}`);
		closePopup();
	};

	return (
		<div className="stall-reservation-shell">
			<div className="stall-navbar">
				<NavBar role="user" />
			</div>
			<div className="stall-reservation-page">
				<h2>BMICH Hall Map</h2>
				<p className="subtitle">
					Click a Hall button on the map to open stall booking window. Reserved: {bookedByBusiness.length}/{MAX_SELECTION}
				</p>

				<div className="overview-map-wrapper">
					<img
						src={mapSource}
						alt={mapData.map_name}
						className="overview-map-image"
						onError={() => setMapSource('/assets/map.png')}
					/>

					{mapData.locations.map((location) => {
						const isHall = location.id.startsWith('hall_');
						return (
							<button
								key={location.id}
								type="button"
								className={`map-point ${isHall ? 'hall' : 'other'}`}
								style={{ top: `${location.y}%`, left: `${location.x}%` }}
								onClick={() => (isHall ? openHallPopup(location.id) : undefined)}
								disabled={!isHall}
								title={location.name}
							>
								{location.name}
							</button>
						);
					})}
				</div>

				{activeHallId && (
					<div className="popup-backdrop" onClick={closePopup}>
						<div className="popup-card" onClick={(event) => event.stopPropagation()}>
							<div className="popup-header">
								<h3>{activeLocation?.name} - Stall Selection</h3>
								<button type="button" className="close-btn" onClick={closePopup}>✕</button>
							</div>

							<p className="popup-help">
								Select up to {remainingSlots} more stall{remainingSlots === 1 ? '' : 's'} (max {MAX_SELECTION} per business).
							</p>

							<div className="stall-grid">
								{activeStalls.map((stall) => {
									const isReserved = stall.status === 'reserved';
									const isSelected = selectedInPopup.includes(stall.id);

									return (
										<button
											key={stall.id}
											type="button"
											className={`stall-card stall-${stall.size} ${isReserved ? 'reserved' : 'available'} ${isSelected ? 'selected' : ''}`}
											onClick={() => handleStallSelect(stall)}
											disabled={isReserved}
										>
											<strong>{stall.id}</strong>
											<small>{stall.size}</small>
										</button>
									);
								})}
							</div>

							<div className="popup-footer">
								<span>Selected: {selectedInPopup.length ? selectedInPopup.join(', ') : 'None'}</span>
								<button
									type="button"
									className="book-btn"
									onClick={bookSelectedStalls}
									disabled={!selectedInPopup.length || remainingSlots <= 0}
								>
									Book Selected Stalls
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default StallSelection;
