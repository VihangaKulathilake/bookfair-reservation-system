import React, { useMemo, useState } from 'react';
import NavBar from '../../components/layout/NavBar';
import './StallReservation.css';

const MAX_SELECTION = 3;
const MAP_IMAGE_SRC = '/assets/map.png';
const hallPolygonById = {
	hall_m: '225,60 275,60 275,85 225,85',
	hall_l: '225,95 275,95 275,120 225,120',
	hall_p: '270,150 300,150 300,185 270,185',
	hall_q: '305,150 335,150 335,185 305,185',
	hall_r_west: '270,225 295,225 295,270 270,270',
	hall_k: '300,215 340,215 340,295 300,295',
	hall_j: '345,215 400,215 400,345 345,345',
	hall_n: '390,60 465,60 465,90 390,90',
	hall_r_south: '545,375 585,375 585,450 545,450',
	hall_a: '480,110 540,110 560,140 540,170 480,170 460,140',
	hall_b: '600,110 660,110 680,140 660,170 600,170 580,140',
	hall_c: '480,230 515,230 515,270 495,270 495,330 515,330 515,380 550,420 530,440 480,390',
	hall_d: '670,230 635,230 635,270 655,270 655,330 635,330 635,380 600,420 620,440 670,390',
};

const stallSizeDimensions = {
	small: { width: 16, height: 12 },
	medium: { width: 21, height: 15 },
	large: { width: 27, height: 18 },
};

const MIN_AISLE_WIDTH_PX = 16;

const hallGenerationConfig = {
	default: {
		densityDivisor: 130,
		minCount: 6,
		maxCount: 90,
		stepX: 8,
		stepY: 8,
		sizeCycle: ['large', 'medium', 'small', 'medium', 'small'],
		overlapPadding: 1,
		secondaryFill: false,
		entranceExitAislePx: 14,
		mainAislePx: 14,
		sideAislePx: 10,
		crossAislePx: 10,
	},
	hall_c: {
		densityDivisor: 72,
		minCount: 18,
		maxCount: 44,
		stepX: 6,
		stepY: 6,
		sizeCycle: ['small', 'small', 'medium', 'small', 'medium', 'large', 'small'],
		overlapPadding: 0,
		secondaryFill: false,
		entranceExitAislePx: 18,
		mainAislePx: 18,
		sideAislePx: 12,
		crossAislePx: 12,
	},
	hall_d: {
		densityDivisor: 72,
		minCount: 18,
		maxCount: 44,
		stepX: 6,
		stepY: 6,
		sizeCycle: ['small', 'small', 'medium', 'small', 'medium', 'large', 'small'],
		overlapPadding: 0,
		secondaryFill: false,
		entranceExitAislePx: 18,
		mainAislePx: 18,
		sideAislePx: 12,
		crossAislePx: 12,
	},
};

const parsePoints = (pointsString) =>
	pointsString.split(' ').map((point) => {
		const [x, y] = point.split(',').map(Number);
		return { x, y };
	});

const isPointOnSegment = (px, py, ax, ay, bx, by) => {
	const cross = (py - ay) * (bx - ax) - (px - ax) * (by - ay);
	if (Math.abs(cross) > 1e-6) return false;

	const dot = (px - ax) * (px - bx) + (py - ay) * (py - by);
	return dot <= 1e-6;
};

const pointInPolygonInclusive = (x, y, polygon) => {
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		if (isPointOnSegment(x, y, polygon[j].x, polygon[j].y, polygon[i].x, polygon[i].y)) {
			return true;
		}
	}

	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i].x;
		const yi = polygon[i].y;
		const xj = polygon[j].x;
		const yj = polygon[j].y;

		const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + Number.EPSILON) + xi;
		if (intersect) inside = !inside;
	}

	return inside;
};

const getPolygonBounds = (pointsString) => {
	const points = parsePoints(pointsString);
	const minX = Math.min(...points.map((point) => point.x));
	const maxX = Math.max(...points.map((point) => point.x));
	const minY = Math.min(...points.map((point) => point.y));
	const maxY = Math.max(...points.map((point) => point.y));
	return { minX, maxX, minY, maxY };
};

const pointInPolygon = (x, y, polygon) => {
	return pointInPolygonInclusive(x, y, polygon);
};

const polygonArea = (polygon) => {
	let area = 0;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		area += (polygon[j].x + polygon[i].x) * (polygon[j].y - polygon[i].y);
	}
	return Math.abs(area / 2);
};

const isRectInsidePolygon = (centerX, centerY, width, height, polygon) => {
	const checkPoints = [
		{ x: centerX, y: centerY },
		{ x: centerX - width / 2, y: centerY - height / 2 },
		{ x: centerX + width / 2, y: centerY - height / 2 },
		{ x: centerX + width / 2, y: centerY + height / 2 },
		{ x: centerX - width / 2, y: centerY + height / 2 },
		{ x: centerX, y: centerY - height / 2 },
		{ x: centerX + width / 2, y: centerY },
		{ x: centerX, y: centerY + height / 2 },
		{ x: centerX - width / 2, y: centerY },
	];

	return checkPoints.every((point) => pointInPolygonInclusive(point.x, point.y, polygon));
};

const rectanglesOverlap = (a, b, padding = 1) =>
	Math.abs(a.x - b.x) < (a.width + b.width) / 2 + padding && Math.abs(a.y - b.y) < (a.height + b.height) / 2 + padding;

const isInCirculationAisle = (x, y, minX, maxX, minY, maxY, config) => {
	const hallWidth = maxX - minX;
	const hallHeight = maxY - minY;

	if (hallWidth < 52 || hallHeight < 52) {
		return false;
	}

	const entranceBand = Math.min(Math.max(config.entranceExitAislePx, MIN_AISLE_WIDTH_PX), Math.max(4, hallHeight * 0.2));
	const mainAisleHalfWidth = Math.min(Math.max(config.mainAislePx / 2, MIN_AISLE_WIDTH_PX / 2), Math.max(2, hallWidth * 0.12));
	const sideAisleHalfWidth = Math.min(Math.max(config.sideAislePx / 2, MIN_AISLE_WIDTH_PX / 2 - 1), Math.max(2, hallWidth * 0.08));
	const crossAisleHalfWidth = Math.min(Math.max(config.crossAislePx / 2, MIN_AISLE_WIDTH_PX / 2 - 1), Math.max(2, hallHeight * 0.08));

	const northEntrance = y <= minY + entranceBand;
	const southExit = y >= maxY - entranceBand;
	if (northEntrance || southExit) return true;

	const midX = (minX + maxX) / 2;
	if (Math.abs(x - midX) <= mainAisleHalfWidth) return true;

	if (hallWidth > 100) {
		const leftSideAisleX = minX + hallWidth * 0.28;
		const rightSideAisleX = minX + hallWidth * 0.72;
		if (Math.abs(x - leftSideAisleX) <= sideAisleHalfWidth) return true;
		if (Math.abs(x - rightSideAisleX) <= sideAisleHalfWidth) return true;
	}

	if (hallHeight > 120) {
		const crossAisleY = minY + hallHeight * 0.56;
		if (Math.abs(y - crossAisleY) <= crossAisleHalfWidth) return true;
	}

	return false;
};

const generateDynamicStalls = (hallId, polygonPoints) => {
	const config = hallGenerationConfig[hallId] || hallGenerationConfig.default;
	const polygon = parsePoints(polygonPoints);
	const minX = Math.min(...polygon.map((point) => point.x));
	const maxX = Math.max(...polygon.map((point) => point.x));
	const minY = Math.min(...polygon.map((point) => point.y));
	const maxY = Math.max(...polygon.map((point) => point.y));

	const area = polygonArea(polygon);
	const targetCount = Math.max(config.minCount, Math.min(config.maxCount, Math.round(area / config.densityDivisor)));
	const stalls = [];
	const placedRects = [];
	const sizeCycle = config.sizeCycle;

	let stallIndex = 1;
	for (let y = minY + 6; y <= maxY - 6 && stalls.length < targetCount; y += config.stepY) {
		for (let x = minX + 6; x <= maxX - 6 && stalls.length < targetCount; x += config.stepX) {
			if (isInCirculationAisle(x, y, minX, maxX, minY, maxY, config)) continue;

			let placed = false;
			const preferredSize = sizeCycle[stallIndex % sizeCycle.length];
			const sizeTryOrder = [preferredSize, 'small', 'medium', 'large'];

			for (let i = 0; i < sizeTryOrder.length; i += 1) {
				const size = sizeTryOrder[i];
				const dimensions = stallSizeDimensions[size];
				const candidateRect = { x, y, width: dimensions.width, height: dimensions.height };

				if (!isRectInsidePolygon(x, y, dimensions.width, dimensions.height, polygon)) continue;
				if (placedRects.some((rect) => rectanglesOverlap(rect, candidateRect, config.overlapPadding))) continue;

				placedRects.push(candidateRect);
				stalls.push({
					id: `${hallId.toUpperCase()}-${stallIndex}`,
					x,
					y,
					size,
					status: stallIndex % 11 === 0 ? 'reserved' : 'available',
				});
				stallIndex += 1;
				placed = true;
				break;
			}

			if (!placed) {
				continue;
			}
		}
	}

	if (config.secondaryFill && stalls.length < targetCount) {
		const extraStepX = Math.max(3, config.stepX - 2);
		const extraStepY = Math.max(3, config.stepY - 2);
		const smallDimensions = stallSizeDimensions.small;

		for (let y = minY + 4; y <= maxY - 4 && stalls.length < targetCount; y += extraStepY) {
			for (let x = minX + 4; x <= maxX - 4 && stalls.length < targetCount; x += extraStepX) {
				if (isInCirculationAisle(x, y, minX, maxX, minY, maxY, config)) continue;

				const candidateRect = { x, y, width: smallDimensions.width, height: smallDimensions.height };

				if (!isRectInsidePolygon(x, y, smallDimensions.width, smallDimensions.height, polygon)) continue;
				if (placedRects.some((rect) => rectanglesOverlap(rect, candidateRect, 0))) continue;

				placedRects.push(candidateRect);
				stalls.push({
					id: `${hallId.toUpperCase()}-${stallIndex}`,
					x,
					y,
					size: 'small',
					status: stallIndex % 11 === 0 ? 'reserved' : 'available',
				});
				stallIndex += 1;
			}
		}

		if ((hallId === 'hall_c' || hallId === 'hall_d') && stalls.length < targetCount && config.secondaryFill) {
			const microStepX = 3;
			const microStepY = 3;
			for (let y = minY + 3; y <= maxY - 3 && stalls.length < targetCount; y += microStepY) {
				for (let x = minX + 3; x <= maxX - 3 && stalls.length < targetCount; x += microStepX) {
					if (isInCirculationAisle(x, y, minX, maxX, minY, maxY, config)) continue;

					const candidateRect = { x, y, width: smallDimensions.width, height: smallDimensions.height };
					if (!isRectInsidePolygon(x, y, smallDimensions.width, smallDimensions.height, polygon)) continue;
					if (placedRects.some((rect) => rectanglesOverlap(rect, candidateRect, -0.2))) continue;

					placedRects.push(candidateRect);
					stalls.push({
						id: `${hallId.toUpperCase()}-${stallIndex}`,
						x,
						y,
						size: stallIndex % 5 === 0 ? 'medium' : 'small',
						status: stallIndex % 13 === 0 ? 'reserved' : 'available',
					});
					stallIndex += 1;
				}
			}
		}
	}

	return stalls;
};

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

const buildInitialHallStalls = () => {
	const hallIds = Object.keys(hallPolygonById);
	return hallIds.reduce((accumulator, hallId) => {
		accumulator[hallId] = generateDynamicStalls(hallId, hallPolygonById[hallId]);
		return accumulator;
	}, {});
};

const StallSelection = () => {
	const [mapSource, setMapSource] = useState(MAP_IMAGE_SRC);
	const [hallStalls, setHallStalls] = useState(() => buildInitialHallStalls());
	const [activeHallId, setActiveHallId] = useState(null);
	const [selectedInPopup, setSelectedInPopup] = useState([]);
	const [bookedByBusiness, setBookedByBusiness] = useState([]);

	const getHallStallKey = (hallId) => hallId;

	const activeLocation = useMemo(
		() => mapData.locations.find((loc) => loc.id === activeHallId) || null,
		[activeHallId]
	);

	const activeStalls = activeHallId ? hallStalls[getHallStallKey(activeHallId)] || [] : [];
	const activeHallPolygon = hallPolygonById[activeHallId] || '360,250 440,250 440,320 360,320';
	const activeClipPathId = `hall-clip-${activeHallId || 'default'}`;
	const activePolygonBounds = useMemo(
		() => getPolygonBounds(activeHallPolygon),
		[activeHallPolygon]
	);
	const isLargeHallPreview = activeHallId === 'hall_c' || activeHallId === 'hall_d';
	const popupPolygonViewBox = useMemo(() => {
		const padding = isLargeHallPreview ? 8 : 16;
		const width = Math.max(40, activePolygonBounds.maxX - activePolygonBounds.minX + padding * 2);
		const height = Math.max(30, activePolygonBounds.maxY - activePolygonBounds.minY + padding * 2);
		return `${activePolygonBounds.minX - padding} ${activePolygonBounds.minY - padding} ${width} ${height}`;
	}, [activePolygonBounds, isLargeHallPreview]);
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
					<span className="subtitle-note">Click a Hall button on the map to open stall booking window.</span>
					<span className="subtitle-badge">Reserved: {bookedByBusiness.length}/{MAX_SELECTION}</span>
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
							<div className="stall-type-legend" aria-label="Stall types">
								<span className="legend-item small"><i className="legend-dot small" />Small</span>
								<span className="legend-item medium"><i className="legend-dot medium" />Medium</span>
								<span className="legend-item big"><i className="legend-dot big" />Big</span>
							</div>

							<div className={`hall-shape-preview-wrap ${isLargeHallPreview ? 'large-hall-preview' : ''}`}>
								<svg
									className={`hall-shape-preview ${isLargeHallPreview ? 'large-hall-preview-svg' : ''}`}
									viewBox={popupPolygonViewBox}
									preserveAspectRatio="xMidYMid meet"
									role="img"
									aria-label={`${activeLocation?.name} polygon shape`}
								>
									<defs>
										<clipPath id={activeClipPathId}>
											<polygon points={activeHallPolygon} />
										</clipPath>
									</defs>
									<polygon points={activeHallPolygon} className="hall-shape-outline" />
									<g clipPath={`url(#${activeClipPathId})`}>
										{activeStalls.map((stall) => {

											const isReserved = stall.status === 'reserved';
											const isSelected = selectedInPopup.includes(stall.id);
											const size = stallSizeDimensions[stall.size];
											const stallNumber = stall.id.split('-').pop();
											const labelFontSize = isLargeHallPreview
												? stall.size === 'large' ? 9.4 : stall.size === 'medium' ? 8.6 : 7.6
												: stall.size === 'large' ? 7.4 : stall.size === 'medium' ? 6.6 : 5.8;

											return (
												<g key={`stall-shape-${stall.id}`} onClick={() => handleStallSelect(stall)}>
													<rect
														x={stall.x - size.width / 2}
														y={stall.y - size.height / 2}
														width={size.width}
														height={size.height}
														rx="2"
														className={`stall-rect ${stall.size} ${isReserved ? 'reserved' : 'available'} ${isSelected ? 'selected' : ''}`}
													/>
													<text
														x={stall.x}
														y={stall.y + 0.1}
														textAnchor="middle"
														dominantBaseline="middle"
														style={{ fontSize: `${labelFontSize}px` }}
														className={`stall-rect-label ${isReserved ? 'reserved' : ''}`}
													>
														{stallNumber}
													</text>
												</g>
											);
										})}
									</g>
								</svg>
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
