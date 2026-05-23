// Date dropdown helpers (mobile + desktop)
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getToday() {
  return formatDate(new Date());
}

function getTomorrow() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDate(tomorrow);
}

function updateDateUI(selectEl, pickerEl, labelEl, value) {
  if (!selectEl || !labelEl) return;

  if (value === 'all') {
    labelEl.textContent = '📅 All Dates';
    if (pickerEl) pickerEl.style.display = 'none';
    return;
  }

  if (value === 'today') {
    labelEl.textContent = `📅 Today (${getToday()})`;
    if (pickerEl) pickerEl.style.display = 'none';
    return;
  }

  if (value === 'tomorrow') {
    labelEl.textContent = `📅 Tomorrow (${getTomorrow()})`;
    if (pickerEl) pickerEl.style.display = 'none';
    return;
  }

  if (value === 'calendar' && pickerEl) {
    pickerEl.style.display = 'inline-block';
    pickerEl.value = pickerEl.value || getToday();
    labelEl.textContent = `📅 ${pickerEl.value}`;
  }
}

function initDateDropdown(selectId, pickerId, labelId) {
  const selectEl = document.getElementById(selectId);
  const pickerEl = document.getElementById(pickerId);
  const labelEl = document.getElementById(labelId);

  if (!selectEl) return;

  const update = () => {
    updateDateUI(selectEl, pickerEl, labelEl, selectEl.value);
  };

  selectEl.addEventListener('change', update);

  if (pickerEl) {
    pickerEl.addEventListener('change', () => {
      if (selectEl.value === 'calendar' && labelEl && pickerEl.value) {
        labelEl.textContent = `📅 ${pickerEl.value}`;
      }
    });
  }

  update();
}

// Bus data
const busesRaw = [
  { name: 'NBS Express', route: 'BUS 42A', baseMin: 3, capacity: 'Moderate', extra: 'Pradhan Nagar crossing', lat: 26.7210, lng: 88.3920 },
  { name: 'Hill Queen', route: 'BUS 17', baseMin: 12, capacity: 'Empty', extra: null, lat: 26.7105, lng: 88.3865 },
  { name: 'City Link', route: 'BUS 09C', baseMin: 24, capacity: 'Crowded', extra: null, lat: 26.7302, lng: 88.4001 }
];

const now0 = Date.now();
const buses = busesRaw.map(bus => ({
  ...bus,
  arrivalTs: now0 + bus.baseMin * 60000
}));

const routeIndex = [
  { pickup: 'Siliguri Bus Stand', destination: 'Sukna Bus Stop', buses: ['NBS Express', 'Hill Queen'] },
  { pickup: 'Siliguri Bus Stand', destination: 'Salbari Chowk', buses: ['NBS Express', 'City Link'] },
  { pickup: 'Siliguri Bus Stand', destination: 'City Centre Mall', buses: ['City Link'] },
  { pickup: 'Siliguri Bus Stand', destination: 'Matigara', buses: ['Hill Queen', 'City Link'] },
  { pickup: 'Siliguri Bus Stand', destination: 'Bagdogra Airport', buses: ['NBS Express'] },
  { pickup: 'Raiganj State Garrage', destination: 'Kolkata', buses: ['NBS Express', 'City Link'] },
  { pickup: 'Kolkata', destination: 'Raiganj State Garrage', buses: ['NBS Express', 'City Link'] },
  { pickup: 'Malda', destination: 'Kolkata', buses: ['NBS Express'] },
  { pickup: 'Kolkata', destination: 'Malda', buses: ['NBS Express'] },
  { pickup: 'Raiganj State Garrage', destination: 'Malda', buses: ['Hill Queen'] },
  { pickup: 'Malda', destination: 'Raiganj State Garrage', buses: ['Hill Queen'] },
  { pickup: 'Sevoke Rd', destination: 'Sukna Bus Stop', buses: ['NBS Express'] },
  { pickup: 'Sevoke Rd', destination: 'Salbari Chowk', buses: ['NBS Express', 'City Link'] },
  { pickup: 'Sevoke Rd', destination: 'City Centre Mall', buses: ['City Link'] },
  { pickup: 'Sevoke Rd', destination: 'Matigara', buses: ['Hill Queen', 'City Link'] },
  { pickup: 'Sevoke Rd', destination: 'Bagdogra Airport', buses: ['NBS Express'] }
];

const stopCoordinates = {
  'siliguri bus stand': { name: 'Siliguri Bus Stand', lat: 26.7271, lng: 88.3953 },
  'sevoke rd': { name: 'Sevoke Rd', lat: 26.7361, lng: 88.4217 },
  'sukna bus stop': { name: 'Sukna Bus Stop', lat: 26.7893, lng: 88.3638 },
  'salbari chowk': { name: 'Salbari Chowk', lat: 26.7046, lng: 88.3539 },
  'city centre mall': { name: 'City Centre Mall', lat: 26.7482, lng: 88.4335 },
  matigara: { name: 'Matigara', lat: 26.7167, lng: 88.3833 },
  'bagdogra airport': { name: 'Bagdogra Airport', lat: 26.6812, lng: 88.3286 },
  'pradhan nagar': { name: 'Pradhan Nagar', lat: 26.7161, lng: 88.4104 },
  raiganj: { name: 'Raiganj State Garrage', lat: 25.6128, lng: 88.1245 },
  'raiganj state garrage': { name: 'Raiganj State Garrage', lat: 25.6128, lng: 88.1245 },
  malda: { name: 'Malda State Bus Stand', lat: 25.0044, lng: 88.1458 },
  kolkata: { name: 'Kolkata State Bus Stand, Esplanade', lat: 22.5625, lng: 88.3498 },
  howrah: { name: 'Howrah', lat: 22.5892, lng: 88.3103 },
  'howrah station': { name: 'Howrah Station', lat: 22.5839, lng: 88.3426 },
  digha: { name: 'Digha', lat: 21.6278, lng: 87.5197 },
  darjeeling: { name: 'Darjeeling', lat: 27.0410, lng: 88.2663 },
  kalimpong: { name: 'Kalimpong', lat: 27.0594, lng: 88.4695 },
  jalpaiguri: { name: 'Jalpaiguri', lat: 26.5215, lng: 88.7196 },
  'cooch behar': { name: 'Cooch Behar', lat: 26.3242, lng: 89.4510 },
  alipurduar: { name: 'Alipurduar', lat: 26.4919, lng: 89.5271 },
  'new town': { name: 'New Town, Kolkata', lat: 22.5810, lng: 88.4529 },
  'salt lake': { name: 'Salt Lake, Kolkata', lat: 22.5867, lng: 88.4171 },
  barasat: { name: 'Barasat', lat: 22.7248, lng: 88.4854 },
  barrackpore: { name: 'Barrackpore', lat: 22.7674, lng: 88.3883 },
  krishnanagar: { name: 'Krishnanagar', lat: 23.4009, lng: 88.5014 },
  baharampur: { name: 'Baharampur', lat: 24.0988, lng: 88.2679 },
  bolpur: { name: 'Bolpur', lat: 23.6693, lng: 87.6889 },
  durgapur: { name: 'Durgapur', lat: 23.5204, lng: 87.3119 },
  asansol: { name: 'Asansol', lat: 23.6739, lng: 86.9524 },
  burdwan: { name: 'Burdwan', lat: 23.2324, lng: 87.8615 },
  midnapore: { name: 'Midnapore', lat: 22.4257, lng: 87.3199 },
  kharagpur: { name: 'Kharagpur', lat: 22.3460, lng: 87.2320 },
  haldia: { name: 'Haldia', lat: 22.0667, lng: 88.0698 },
  purulia: { name: 'Purulia', lat: 23.3321, lng: 86.3652 },
  bankura: { name: 'Bankura', lat: 23.2325, lng: 87.0716 },
  tarakeswar: { name: 'Tarakeswar', lat: 22.8861, lng: 88.0136 },
  chandannagar: { name: 'Chandannagar', lat: 22.8623, lng: 88.3670 },
  serampore: { name: 'Serampore', lat: 22.7528, lng: 88.3422 },
  bongaon: { name: 'Bongaon', lat: 23.0441, lng: 88.8277 },
  basirhat: { name: 'Basirhat', lat: 22.6574, lng: 88.8672 }
};

const WEST_BENGAL_BOUNDS = {
  minLat: 21.35,
  maxLat: 27.35,
  minLng: 85.75,
  maxLng: 89.95
};
const GEOCODE_CACHE_KEY = 'smartBusWbGeocodeCache';

function loadGeocodeCache() {
  try {
    return JSON.parse(sessionStorage.getItem(GEOCODE_CACHE_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function saveGeocodeCache(cache) {
  sessionStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
}

function stopOptionList() {
  const seen = new Set();
  return Object.values(stopCoordinates).filter(stop => {
    const key = normalizeStop(stop.name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function localPlaceSuggestions(query, limit = 6) {
  const q = normalizeStop(query);
  if (!q) return stopOptionList().slice(0, limit);

  return stopOptionList()
    .map(stop => {
      const name = normalizeStop(stop.name);
      let score = 0;
      if (name === q) score = 100;
      else if (name.startsWith(q)) score = 80;
      else if (name.includes(q)) score = 50;
      return { ...stop, score };
    })
    .filter(stop => stop.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit);
}

const curatedRoutePaths = {
  'raiganj state garrage|kolkata': [
    [25.6128, 88.1245],
    [25.5350, 88.1325],
    [25.4210, 88.1280],
    [25.2940, 88.1285],
    [25.1600, 88.1370],
    [25.0044, 88.1458],
    [24.8800, 88.1250],
    [24.7850, 88.0910],
    [24.6900, 88.0350],
    [24.5600, 88.0300],
    [24.3900, 88.0750],
    [24.1850, 88.2700],
    [24.0750, 88.2650],
    [23.9100, 88.2450],
    [23.7900, 88.2750],
    [23.6700, 88.2950],
    [23.5500, 88.3350],
    [23.4050, 88.3800],
    [23.2550, 88.4450],
    [23.0700, 88.5050],
    [22.8750, 88.4750],
    [22.7350, 88.4050],
    [22.6400, 88.3750],
    [22.5625, 88.3498]
  ]
};

const curatedRouteDistances = {
  'raiganj state garrage|kolkata': 409
};

const STOP_ALIASES = {
  'raiganj': 'raiganj state garrage',
  'raiganj state bus garage': 'raiganj state garrage',
  'raiganj state garage': 'raiganj state garrage'
};

function arrivalText(ts) {
  const diff = Math.max(0, ts - Date.now());
  const m = Math.floor(diff / 60000);
  return m === 0 ? 'Arriving now' : `${m} min`;
}

function timeText(ts) {
  return new Date(ts).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit'
  });
}

function normalizeStop(value) {
  const key = (value || '').trim().replace(/\s+/g, ' ').toLowerCase();
  return STOP_ALIASES[key] || key;
}

function getMatchingBuses(pickup, destination) {
  const p = normalizeStop(pickup);
  const d = normalizeStop(destination);

  const matched = routeIndex.find(r =>
    normalizeStop(r.pickup) === p &&
    normalizeStop(r.destination) === d
  );

  if (!matched) return [];
  return buses.filter(bus => matched.buses.includes(bus.name));
}

function seededNumber(seed) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function routeOperator(start, end, index) {
  const northRoute = Math.max(start.lat, end.lat) >= 25.4 || start.name.toLowerCase().includes('siliguri') || end.name.toLowerCase().includes('siliguri');
  const southRoute = Math.min(start.lat, end.lat) <= 24.6 || start.name.toLowerCase().includes('kolkata') || end.name.toLowerCase().includes('kolkata');
  if (northRoute && southRoute) return index % 2 === 0 ? 'NBSTC' : 'SBSTC';
  return northRoute ? 'NBSTC' : 'SBSTC';
}

function generatedRouteBuses(pickup, destination, start, end) {
  const seed = seededNumber(`${normalizeStop(pickup)}|${normalizeStop(destination)}`);
  const count = 3 + (seed % 3);
  const capacities = ['Empty', 'Moderate', 'Crowded'];
  const types = ['Express', 'Rocket', 'Deluxe', 'Local'];
  const firstDeparture = Date.now() - (15 + (seed % 55)) * 60000;

  return Array.from({ length: count }, (_, index) => {
    const operator = routeOperator(start, end, index);
    const serviceNo = String(1000 + ((seed + index * 173) % 8900));
    const departureTs = firstDeparture + index * (22 + ((seed + index * 7) % 19)) * 60000;
    const capacity = capacities[(seed + index) % capacities.length];

    return {
      name: `${operator} ${serviceNo}`,
      route: `${operator} ${types[(seed + index) % types.length]}`,
      baseMin: Math.max(0, Math.round((departureTs - Date.now()) / 60000)),
      arrivalTs: departureTs,
      departureTs,
      capacity,
      extra: `Starts ${timeText(departureTs)} from ${start.name}`,
      pickup,
      destination,
      lat: start.lat,
      lng: start.lng,
      generated: true
    };
  });
}

function isInsideWestBengal(point) {
  return point.lat >= WEST_BENGAL_BOUNDS.minLat &&
    point.lat <= WEST_BENGAL_BOUNDS.maxLat &&
    point.lng >= WEST_BENGAL_BOUNDS.minLng &&
    point.lng <= WEST_BENGAL_BOUNDS.maxLng;
}

function looksLikeWestBengalResult(result) {
  const state = (result.address?.state || '').toLowerCase();
  const country = (result.address?.country || '').toLowerCase();
  const displayName = (result.display_name || '').toLowerCase();
  return state === 'west bengal' ||
    (country === 'india' && displayName.includes('west bengal')) ||
    displayName.includes('west bengal, india');
}

async function resolveWestBengalPlace(value) {
  const key = normalizeStop(value);
  if (!key) return null;

  const localStop = stopCoordinates[key];
  if (localStop) return localStop;

  const cache = loadGeocodeCache();
  if (cache[key]) return cache[key];

  const query = `${value}, West Bengal, India`;
  const params = new URLSearchParams({
    format: 'jsonv2',
    addressdetails: '1',
    limit: '5',
    countrycodes: 'in',
    q: query,
    viewbox: `${WEST_BENGAL_BOUNDS.minLng},${WEST_BENGAL_BOUNDS.maxLat},${WEST_BENGAL_BOUNDS.maxLng},${WEST_BENGAL_BOUNDS.minLat}`,
    bounded: '1'
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
  if (!response.ok) throw new Error('Place search failed');

  const data = await response.json();
  const match = data.find(result => {
    const point = { lat: Number(result.lat), lng: Number(result.lon) };
    return Number.isFinite(point.lat) &&
      Number.isFinite(point.lng) &&
      isInsideWestBengal(point) &&
      looksLikeWestBengalResult(result);
  });

  if (!match) return null;

  const resolved = {
    name: match.name || value,
    lat: Number(match.lat),
    lng: Number(match.lon)
  };
  cache[key] = resolved;
  saveGeocodeCache(cache);
  return resolved;
}

async function fetchWestBengalSuggestions(value) {
  const key = normalizeStop(value);
  if (key.length < 2) return [];

  const params = new URLSearchParams({
    format: 'jsonv2',
    addressdetails: '1',
    limit: '5',
    countrycodes: 'in',
    q: `${value}, West Bengal, India`,
    viewbox: `${WEST_BENGAL_BOUNDS.minLng},${WEST_BENGAL_BOUNDS.maxLat},${WEST_BENGAL_BOUNDS.maxLng},${WEST_BENGAL_BOUNDS.minLat}`,
    bounded: '1'
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
  if (!response.ok) return [];

  const data = await response.json();
  const cache = loadGeocodeCache();
  const seen = new Set();
  const suggestions = [];

  data.forEach(result => {
    const point = { lat: Number(result.lat), lng: Number(result.lon) };
    if (!Number.isFinite(point.lat) ||
      !Number.isFinite(point.lng) ||
      !isInsideWestBengal(point) ||
      !looksLikeWestBengalResult(result)) {
      return;
    }

    const name = result.name || result.address?.city || result.address?.town || result.address?.village || value;
    const normalizedName = normalizeStop(name);
    if (!normalizedName || seen.has(normalizedName)) return;
    seen.add(normalizedName);

    const place = {
      name,
      lat: point.lat,
      lng: point.lng,
      detail: result.address?.county || result.address?.state_district || 'West Bengal'
    };
    suggestions.push(place);
    cache[normalizedName] = { name: place.name, lat: place.lat, lng: place.lng };
  });

  saveGeocodeCache(cache);
  return suggestions;
}

async function resolveTripPlaces(pickup, destination) {
  const [start, end] = await Promise.all([
    resolveWestBengalPlace(pickup),
    resolveWestBengalPlace(destination)
  ]);

  return { start, end };
}

function busCardHTML(bus) {
  const cap = bus.capacity;
  const icon = cap === 'Empty' ? 'fa-user-check' : cap === 'Crowded' ? 'fa-users-slash' : 'fa-users';
  const timing = bus.departureTs
    ? `<span class="arrival-time"><i class="far fa-clock"></i>Starts ${timeText(bus.departureTs)}</span>`
    : `<span class="arrival-time"><i class="far fa-clock"></i>${arrivalText(bus.arrivalTs)}</span>`;

  return `
    <div class="bus-card" role="button" tabindex="0" data-bus-name="${bus.name}" title="Show ${bus.name} on map">
      <div class="bus-header">
        <div class="bus-name"><i class="fas fa-bus"></i>${bus.name}</div>
        <span class="bus-route">${bus.route}</span>
      </div>
      <div class="bus-meta">
        ${timing}
        <span class="capacity ${cap}"><i class="fas ${icon}"></i>${cap}</span>
      </div>
      ${bus.extra ? `<div class="extra-location"><i class="fas fa-location-dot"></i>${bus.extra}</div>` : ''}
    </div>
  `;
}

function renderBusList(containerId, list) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = list.map(busCardHTML).join('');
}

function escapeHTML(value) {
  return String(value || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function routeActionHTML(pickup, destination, label = 'Show route on map') {
  const safePickup = escapeHTML(pickup);
  const safeDestination = escapeHTML(destination);
  return `
    <button class="route-result-btn" type="button" data-show-route data-pickup="${safePickup}" data-destination="${safeDestination}">
      <i class="fas fa-route"></i>${escapeHTML(label)}
    </button>
  `;
}

function renderMatchedSearchList(prefix, list) {
  const container = document.getElementById(`${prefix}BusList`);
  if (!container) return;

  const pickup = document.getElementById(`${prefix}PickupInput`)?.value.trim() || selectedPickup;
  const destination = document.getElementById(`${prefix}DestinationInput`)?.value.trim() || selectedDestination;
  const routeAction = prefix === 'mob' ? '' : routeActionHTML(pickup, destination, 'View full route');
  container.innerHTML = `${routeAction}${list.map(busCardHTML).join('')}`;
}

function searchResult(list = [], routeReady = false) {
  list.routeReady = routeReady;
  return list;
}

function placeSuggestionHTML(place, active = false) {
  return `
    <button class="place-suggest-item${active ? ' active' : ''}" type="button" data-place-name="${escapeHTML(place.name)}">
      <span class="place-suggest-icon"><i class="fas fa-location-dot"></i></span>
      <span class="place-suggest-main">
        <strong>${escapeHTML(place.name)}</strong>
        <span>${escapeHTML(place.detail || 'West Bengal, India')}</span>
      </span>
    </button>
  `;
}

function setupPlaceSuggest(inputId, isDestination = false) {
  const input = document.getElementById(inputId);
  if (!input || input.dataset.suggestReady === 'true') return;

  input.dataset.suggestReady = 'true';
  const wrap = document.createElement('div');
  wrap.className = `place-input-wrap${isDestination ? ' destination-wrap' : ''}`;
  input.parentNode.insertBefore(wrap, input);
  wrap.appendChild(input);

  const panel = document.createElement('div');
  panel.className = 'place-suggest-panel';
  wrap.appendChild(panel);

  let activeIndex = -1;
  let latestQuery = '';
  let timer = null;

  const render = (places, message = '') => {
    activeIndex = -1;
    if (message) {
      panel.innerHTML = `<div class="place-suggest-empty">${escapeHTML(message)}</div>`;
      panel.classList.add('show');
      return;
    }

    if (!places.length) {
      panel.innerHTML = '';
      panel.classList.remove('show');
      return;
    }

    panel.innerHTML = places.map(place => placeSuggestionHTML(place)).join('');
    panel.classList.add('show');
  };

  const choose = name => {
    input.value = name;
    panel.classList.remove('show');
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const updateActive = items => {
    items.forEach((item, index) => item.classList.toggle('active', index === activeIndex));
  };

  const update = async () => {
    const query = input.value.trim();
    latestQuery = query;
    const local = localPlaceSuggestions(query);
    render(local, query.length < 2 && !local.length ? 'Start typing a West Bengal place' : '');
  };

  input.addEventListener('input', () => {
    clearTimeout(timer);
    render(localPlaceSuggestions(input.value.trim()));
    timer = setTimeout(update, 280);
  });

  input.addEventListener('focus', () => {
    render(localPlaceSuggestions(input.value.trim()));
  });

  input.addEventListener('keydown', event => {
    const items = [...panel.querySelectorAll('.place-suggest-item')];
    if (!items.length || !panel.classList.contains('show')) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      updateActive(items);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      updateActive(items);
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      choose(items[activeIndex].dataset.placeName);
    } else if (event.key === 'Escape') {
      panel.classList.remove('show');
    }
  });

  panel.addEventListener('mousedown', event => {
    const item = event.target.closest('.place-suggest-item');
    if (!item) return;
    event.preventDefault();
    choose(item.dataset.placeName);
  });

  document.addEventListener('click', event => {
    if (!wrap.contains(event.target)) panel.classList.remove('show');
  });
}

function initPlaceSuggesters() {
  setupPlaceSuggest('mobPickupInput');
  setupPlaceSuggest('mobDestinationInput', true);
  setupPlaceSuggest('deskPickupInput');
  setupPlaceSuggest('deskDestinationInput', true);
}

async function runSearch(prefix) {
  const pickupEl = document.getElementById(`${prefix}PickupInput`);
  const destinationEl = document.getElementById(`${prefix}DestinationInput`);
  const hint = document.getElementById(`${prefix}SearchHint`);
  const wrap = document.getElementById(`${prefix}ResultsWrap`);
  const count = document.getElementById(`${prefix}BusCountLive`);
  const list = document.getElementById(`${prefix}BusList`);

  const pickup = pickupEl ? pickupEl.value.trim() : '';
  const destination = destinationEl ? destinationEl.value.trim() : '';

  if (!pickup || !destination) {
    if (hint) hint.textContent = 'Please enter both pickup and destination.';
    if (wrap) wrap.style.display = 'none';
    if (list) list.innerHTML = '';
    return searchResult();
  }

  if (hint) hint.textContent = 'Searching West Bengal places...';
  let matched = getMatchingBuses(pickup, destination);
  let places = { start: getStop(pickup), end: getStop(destination) };

  if (!places.start || !places.end) {
    try {
      places = await resolveTripPlaces(pickup, destination);
    } catch (error) {
      if (hint) hint.textContent = 'Place search is unavailable right now. Try again in a moment.';
      if (wrap) wrap.style.display = 'none';
      if (list) list.innerHTML = '';
      return searchResult();
    }
  }

  if (!places.start || !places.end) {
    if (hint) hint.textContent = 'Could not find both places inside West Bengal.';
    if (wrap) wrap.style.display = 'none';
    if (list) list.innerHTML = '';
    return searchResult();
  }

  saveActiveTrip('', pickup, destination);
  if (hint) hint.textContent = `${places.start.name} to ${places.end.name}`;
  if (wrap) wrap.style.display = 'block';

  if (!matched.length) {
    matched = generatedRouteBuses(pickup, destination, places.start, places.end);
  } else {
    matched = matched.map((bus, index) => ({
      ...bus,
      departureTs: bus.departureTs || Date.now() + (bus.baseMin + index * 14) * 60000,
      extra: bus.extra || `Starts from ${places.start.name}`,
      pickup,
      destination,
      lat: places.start.lat,
      lng: places.start.lng
    }));
  }

  rememberRouteBuses(matched);
  if (count) count.textContent = `${matched.length} found`;
  renderMatchedSearchList(prefix, matched);

  return searchResult(matched, true);
}
/*

  if (hint) hint.textContent = `${pickup} → ${destination}`;
}

*/
// Live map data and helpers
const mapBuses = buses.map((bus, index) => ({
  ...bus,
  currentLat: bus.lat,
  currentLng: bus.lng,
  drift: 0.0008 + index * 0.00025,
  direction: index % 2 === 0 ? 1 : -1
}));

function rememberRouteBuses(list) {
  if (!Array.isArray(list) || !list.length) return;

  saveRouteBuses(list);
  list.forEach(bus => {
    const existing = mapBuses.find(item => item.name === bus.name);
    if (existing) {
      Object.assign(existing, bus, {
        currentLat: bus.lat,
        currentLng: bus.lng
      });
      return;
    }

    mapBuses.push({
      ...bus,
      currentLat: bus.lat,
      currentLng: bus.lng,
      drift: 0.0006 + (mapBuses.length % 5) * 0.00018,
      direction: mapBuses.length % 2 === 0 ? 1 : -1
    });
  });
}

let deskMapHome = null;
let deskMapFull = null;
let mobMap = null;
let mapsReady = false;
const routeParams = new URLSearchParams(window.location.search);
const ACTIVE_TRIP_KEY = 'smartBusActiveTrip';
const ACTIVE_ROUTE_BUSES_KEY = 'smartBusRouteBuses';
const MAP_LOCATION_REQUEST_KEY = 'smartBusAskLocationOnMap';
const savedTrip = loadActiveTrip();
rememberRouteBuses(loadRouteBuses());
let selectedBusName = routeParams.get('bus') || savedTrip.bus || '';
let selectedPickup = routeParams.get('pickup') || savedTrip.pickup || '';
let selectedDestination = routeParams.get('destination') || savedTrip.destination || '';
let guestLocation = null;
let insideBusMode = false;
let insideBusSuggested = false;
let locationWatchId = null;
let locationWatchStarted = false;
let lastLiveRouteRefresh = 0;
let liveRouteRefreshTimer = null;
let plannedRouteState = null;
const LIVE_ROUTE_REFRESH_MS = 12000;
const INSIDE_BUS_ROUTE_TOLERANCE_DEG = 0.02;
const INSIDE_BUS_ROUTE_TOLERANCE_KM = 2.0;

function loadActiveTrip() {
  try {
    return JSON.parse(sessionStorage.getItem(ACTIVE_TRIP_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function saveActiveTrip(bus, pickup, destination) {
  sessionStorage.setItem(ACTIVE_TRIP_KEY, JSON.stringify({ bus, pickup, destination }));
}

function loadRouteBuses() {
  try {
    return JSON.parse(sessionStorage.getItem(ACTIVE_ROUTE_BUSES_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveRouteBuses(list) {
  sessionStorage.setItem(ACTIVE_ROUTE_BUSES_KEY, JSON.stringify(list || []));
}

function queueMapLocationRequest() {
  sessionStorage.setItem(MAP_LOCATION_REQUEST_KEY, '1');
}

function shouldAskLocationOnMap() {
  const shouldAsk = sessionStorage.getItem(MAP_LOCATION_REQUEST_KEY) === '1';
  sessionStorage.removeItem(MAP_LOCATION_REQUEST_KEY);
  return shouldAsk;
}

function mapPageUrl(busName, pickup, destination) {
  const encodedBus = encodeURIComponent(busName || '');
  const encodedPickup = encodeURIComponent(pickup || '');
  const encodedDestination = encodeURIComponent(destination || '');
  const path = window.location.pathname.replace(/\\/g, '/');
  const base = path.includes('/maps/') ? 'maps.html' : './maps/maps.html';
  return `${base}?bus=${encodedBus}&pickup=${encodedPickup}&destination=${encodedDestination}`;
}

function storedMapPageUrl() {
  const trip = loadActiveTrip();
  if (trip.bus || trip.pickup || trip.destination) {
    return mapPageUrl(trip.bus, trip.pickup, trip.destination);
  }

  const path = window.location.pathname.replace(/\\/g, '/');
  return path.includes('/maps/') ? 'maps.html' : './maps/maps.html';
}

function bindMapNavigationLinks() {
  document.querySelectorAll('[data-map-link]').forEach(element => {
    element.addEventListener('click', event => {
      event.preventDefault();
      window.location.href = storedMapPageUrl();
    });
  });
}

function getMapIcon(type) {
  const icons = {
    bus: { html: '<i class="fas fa-bus"></i>', className: 'running-bus-icon', size: [32, 32] },
    guest: { html: '<i class="fas fa-location-dot"></i>', className: 'guest-location-icon', size: [28, 28] }
  };
  const icon = icons[type] || icons.bus;

  return L.divIcon({
    html: icon.html,
    className: icon.className,
    iconSize: icon.size,
    iconAnchor: [icon.size[0] / 2, icon.size[1] / 2],
    popupAnchor: [0, -icon.size[1] / 2]
  });
}

function initMapWithFeatures(containerId) {
  if (!window.L || !document.getElementById(containerId)) return null;

  const map = L.map(containerId).setView([25.0, 88.2], 7);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  setTimeout(() => map.invalidateSize(), 150);
  return { map, userMarker: null, destinationMarker: null, routeLine: null, busMarker: null };
}

function initTransitMaps() {
  if (mapsReady || !window.L) return;
  mapsReady = true;

  deskMapHome = initMapWithFeatures('deskMapContainer');
  deskMapFull = initMapWithFeatures('deskMapFull');
  mobMap = initMapWithFeatures('mobFullMap');
}

function refreshActiveMap(id, mode) {
  const mapRef = mode === 'mobile'
    ? mobMap
    : id === 'map'
      ? deskMapFull
      : deskMapHome;

  if (mapRef && mapRef.map) {
    setTimeout(() => mapRef.map.invalidateSize(), 120);
  }
}

function focusBusOnMap(mapRef, busName) {
  if (!mapRef || !mapRef.map || !busName) return;

  const bus = mapBuses.find(item => item.name === busName);
  if (!bus) return;

  setTimeout(() => {
    mapRef.map.invalidateSize();
    mapRef.map.setView([bus.lat, bus.lng], 11, { animate: true });
  }, 150);
}

function showGuestLocation(mapRef, position) {
  if (!mapRef || !mapRef.map || !position) return;

  guestLocation = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };

  const latLng = [guestLocation.lat, guestLocation.lng];
  renderUserMarker(mapRef, latLng);
}

function showLiveLocationOnMaps(position, options = {}) {
  if (!position) return;

  showGuestLocation(deskMapFull, position);
  showGuestLocation(mobMap, position);
  showGuestLocation(deskMapHome, position);

  if (insideBusMode) {
    clearBusMarkers();
    updateMapStatus(selectedBusName
      ? `You are inside ${selectedBusName}. Your live location is following the route.`
      : 'Inside bus mode is on. Your live location is following the route.');
    return;
  }

  suggestInsideBusToggle();
  refreshLiveTripOnMaps(options.force);
}

function refreshLiveTripOnMaps(force = false) {
  if (!guestLocation) return;

  const now = Date.now();
  if (!force && now - lastLiveRouteRefresh < LIVE_ROUTE_REFRESH_MS) {
    clearTimeout(liveRouteRefreshTimer);
    liveRouteRefreshTimer = setTimeout(() => refreshLiveTripOnMaps(true), LIVE_ROUTE_REFRESH_MS);
    return;
  }

  lastLiveRouteRefresh = now;
  renderTripOnMap(deskMapFull);
  renderTripOnMap(mobMap);
  renderTripOnMap(deskMapHome);
}

function renderUserMarker(mapRef, latLng) {
  const markerMode = insideBusMode ? 'photo' : 'dot';

  if (mapRef.userMarker && mapRef.userMarkerMode !== markerMode) {
    mapRef.map.removeLayer(mapRef.userMarker);
    mapRef.userMarker = null;
  }

  if (mapRef.userMarker) {
    mapRef.userMarker.setLatLng(latLng);
    return;
  }

  mapRef.userMarkerMode = markerMode;
  mapRef.userMarker = insideBusMode
    ? L.marker(latLng, { icon: getUserPhotoPinIcon() })
    : L.circleMarker(latLng, {
      radius: 8,
      color: '#ffffff',
      weight: 3,
      fillColor: '#2563eb',
      fillOpacity: 1
    });

  mapRef.userMarker
    .bindPopup(insideBusMode ? '<b>You are inside the bus</b>' : '<b>Your location</b>')
    .addTo(mapRef.map);
}

function getUserPhotoPinIcon() {
  const customer = window.ProfileSync?.loadStoredCustomer?.();
  const avatar = window.ProfileSync?.isSignedIn?.() && customer?.avatar
    ? `<img src="${customer.avatar}" alt="${customer.name || 'You'}" />`
    : '<i class="fas fa-user"></i>';

  return L.divIcon({
    html: `<div class="user-photo-pin">${avatar}</div>`,
    className: 'user-photo-pin-wrap',
    iconSize: [44, 44],
    iconAnchor: [22, 42],
    popupAnchor: [0, -42]
  });
}

function askGuestLocation(mapRef) {
  if (!navigator.geolocation || !mapRef) return;

  updateMapStatus('Allow location access to show where you are and calculate trip time.');
  navigator.geolocation.getCurrentPosition(
    position => {
      showGuestLocation(mapRef, position);
      refreshLiveTripOnMaps(true);
      startLocationWatch();
    },
    () => updateMapStatus('Location permission was blocked. Allow location to calculate your ETA.'),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}

function askTripLocation() {
  if (!navigator.geolocation) {
    updateMapStatus('Location is not available in this browser.');
    return;
  }

  updateMapStatus('Allow location access so the map can place you on this route.');
  navigator.geolocation.getCurrentPosition(
    position => {
      showLiveLocationOnMaps(position, { force: true });
    },
    () => updateMapStatus('Location permission was blocked. Allow location to calculate your ETA.'),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Location is not available in this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 15000
    });
  });
}

async function enterInsideBusMode() {
  if (!selectedBusName) {
    warnNotInsideSelectedBus();
    return;
  }

  updateMapStatus('Checking your location against this bus route...');

  let position;
  try {
    position = await getCurrentPosition();
  } catch (error) {
    updateMapStatus('Location permission was blocked. Allow location to use Inside bus.');
    return;
  }

  guestLocation = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };

  try {
    await ensurePlannedRouteState();
  } catch (error) {
    updateMapStatus('Could not verify this bus route right now. Showing the route only.');
    return;
  }

  if (!isGuestOnSelectedRoute()) {
    warnNotInsideSelectedBus();
    return;
  }

  insideBusSuggested = false;
  setInsideBusMode(true);
  clearBusMarkers();
  showLiveLocationOnMaps(position, { force: true });
  startLocationWatch();
  updateMapStatus(`You are inside ${selectedBusName}. Your live location is now following this route.`);
}

function exitInsideBusMode() {
  setInsideBusMode(false);
  stopLocationWatch();
  renderPlannedRoute(deskMapFull);
  renderPlannedRoute(mobMap);
  renderPlannedRoute(deskMapHome);
  updateMapStatus(selectedBusName
    ? `${selectedBusName} route shown. Inside bus mode is off.`
    : 'Inside bus mode is off.');
}

function startLocationWatch() {
  if (!navigator.geolocation || locationWatchStarted) return;

  locationWatchStarted = true;
  locationWatchId = navigator.geolocation.watchPosition(
    position => showLiveLocationOnMaps(position),
    () => {
      locationWatchStarted = false;
      locationWatchId = null;
      updateMapStatus('Live location stopped. Allow location access to keep the journey updated.');
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
  );
}

function stopLocationWatch() {
  if (!navigator.geolocation || locationWatchId === null) return;
  navigator.geolocation.clearWatch(locationWatchId);
  locationWatchId = null;
  locationWatchStarted = false;
}

function setInsideBusMode(active) {
  insideBusMode = active;
  document.querySelectorAll('[data-inside-bus-toggle]').forEach(toggle => {
    toggle.classList.toggle('active', insideBusMode);
    toggle.classList.toggle('suggested', insideBusSuggested && !insideBusMode);
    toggle.setAttribute('aria-pressed', insideBusMode ? 'true' : 'false');
  });
}

function suggestInsideBusToggle() {
  if (!selectedBusName || insideBusMode) return;

  insideBusSuggested = true;
  setInsideBusMode(false);
  updateMapStatus(`Location found. Tap Inside bus if you are travelling in ${selectedBusName}.`);
}

function bindInsideBusToggles() {
  document.querySelectorAll('[data-inside-bus-toggle]').forEach(button => {
    button.addEventListener('click', async () => {
      if (insideBusMode) {
        exitInsideBusMode();
        return;
      }

      await enterInsideBusMode();
    });
  });
}

function openMapForBus(busName, mode) {
  selectedBusName = busName;
  plannedRouteState = null;
  const prefix = mode === 'mobile' ? 'mob' : 'desk';
  const pickup = document.getElementById(`${prefix}PickupInput`)?.value.trim() || '';
  const destination = document.getElementById(`${prefix}DestinationInput`)?.value.trim() || '';
  saveActiveTrip(busName, pickup, destination);
  queueMapLocationRequest();
  window.location.href = mapPageUrl(busName, pickup, destination);
}

function openMapForRoute(pickup, destination) {
  selectedBusName = '';
  selectedPickup = pickup;
  selectedDestination = destination;
  plannedRouteState = null;
  saveActiveTrip('', pickup, destination);
  queueMapLocationRequest();
  window.location.href = mapPageUrl('', pickup, destination);
}

function showRouteOnDashboard(pickup, destination, busName = '') {
  selectedBusName = busName;
  selectedPickup = pickup;
  selectedDestination = destination;
  plannedRouteState = null;
  saveActiveTrip(busName, pickup, destination);
  updateTripRouteLabel();
  refreshActiveMap('home', 'desktop');
  renderPlannedRoute(deskMapHome);
  if (guestLocation) {
    refreshLiveTripOnMaps(true);
  } else {
    askTripLocation();
  }
}

function getStop(value) {
  const key = normalizeStop(value);
  return stopCoordinates[key] || loadGeocodeCache()[key];
}

function distanceKm(a, b) {
  const toRad = deg => deg * Math.PI / 180;
  const earthKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthKm * Math.asin(Math.sqrt(h));
}

function pathDistanceKm(points) {
  return points.slice(1).reduce((total, point, index) => {
    const previous = points[index];
    return total + distanceKm(
      { lat: previous[0], lng: previous[1] },
      { lat: point[0], lng: point[1] }
    );
  }, 0);
}

function projectPointForDistance(point) {
  const latRad = point.lat * Math.PI / 180;
  return {
    x: point.lng * Math.cos(latRad) * 111.32,
    y: point.lat * 110.57
  };
}

function distanceToSegmentKm(point, start, end) {
  const p = projectPointForDistance(point);
  const a = projectPointForDistance({ lat: start[0], lng: start[1] });
  const b = projectPointForDistance({ lat: end[0], lng: end[1] });
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq)) : 0;
  const closest = { x: a.x + t * dx, y: a.y + t * dy };
  return Math.hypot(p.x - closest.x, p.y - closest.y);
}

function distanceToRouteKm(point, routePoints = []) {
  if (!routePoints.length) return Infinity;
  if (routePoints.length === 1) {
    return distanceKm(point, { lat: routePoints[0][0], lng: routePoints[0][1] });
  }

  return routePoints.slice(1).reduce((nearest, current, index) => {
    const segmentDistance = distanceToSegmentKm(point, routePoints[index], current);
    return Math.min(nearest, segmentDistance);
  }, Infinity);
}

function isGuestOnSelectedRoute() {
  if (!guestLocation || !plannedRouteState?.route?.points?.length) return false;
  return distanceToRouteKm(guestLocation, plannedRouteState.route.points) <= INSIDE_BUS_ROUTE_TOLERANCE_KM;
}

async function ensurePlannedRouteState() {
  if (plannedRouteState?.route?.points?.length) return plannedRouteState;
  if (!selectedPickup || !selectedDestination) return null;

  let pickup = getStop(selectedPickup);
  let destination = getStop(selectedDestination);

  if (!pickup || !destination) {
    const places = await resolveTripPlaces(selectedPickup, selectedDestination);
    pickup = places.start;
    destination = places.end;
  }

  if (!pickup || !destination) return null;

  const route = await resolveRoutePath(pickup, destination, selectedPickup, selectedDestination);
  plannedRouteState = { route, pickup, destination };
  return plannedRouteState;
}

function warnNotInsideSelectedBus() {
  setInsideBusMode(false);
  stopLocationWatch();
  Promise.allSettled([
    renderPlannedRoute(deskMapFull),
    renderPlannedRoute(mobMap),
    renderPlannedRoute(deskMapHome)
  ]).finally(() => updateMapStatus('Not in the Bus', { warning: true }));
}

function clearBusMarker(mapRef) {
  if (!mapRef?.map || !mapRef.busMarker) return;
  mapRef.map.removeLayer(mapRef.busMarker);
  mapRef.busMarker = null;
}

function clearBusMarkers() {
  clearBusMarker(deskMapFull);
  clearBusMarker(mobMap);
  clearBusMarker(deskMapHome);
}

function pointAlongPath(points, distanceFromStart) {
  if (!points.length) return null;
  if (points.length === 1 || distanceFromStart <= 0) return points[0];

  let travelled = 0;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const segment = distanceKm(
      { lat: previous[0], lng: previous[1] },
      { lat: current[0], lng: current[1] }
    );

    if (travelled + segment >= distanceFromStart) {
      const ratio = segment ? (distanceFromStart - travelled) / segment : 0;
      return [
        previous[0] + (current[0] - previous[0]) * ratio,
        previous[1] + (current[1] - previous[1]) * ratio
      ];
    }

    travelled += segment;
  }

  return points[points.length - 1];
}

function selectedBusProgress(bus, routeDistance) {
  if (!bus?.departureTs || !routeDistance) return 0;

  const busKmph = bus.route?.toLowerCase().includes('express') || bus.route?.toLowerCase().includes('rocket') ? 52 : 42;
  const tripMs = Math.max(20 * 60000, (routeDistance / busKmph) * 60 * 60000);
  const elapsedMs = Date.now() - bus.departureTs;
  return Math.max(0, Math.min(0.98, elapsedMs / tripMs));
}

function etaText(distance) {
  const busKmph = 50;
  const minutes = Math.max(1, Math.round((distance / busKmph) * 60));
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const duration = hours ? `${hours} hr ${mins} min` : `${mins} min`;
  const arrival = new Date(Date.now() + minutes * 60000).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit'
  });
  return { duration, arrival };
}

function updateMapStatus(message, options = {}) {
  document.querySelectorAll('[data-map-status]').forEach(element => {
    element.textContent = message;
    element.classList.toggle('map-status-warning', Boolean(options.warning));
  });
}

function updateTripSummary(distance, eta) {
  updateEndpointLabels();

  document.querySelectorAll('[data-trip-route]').forEach(element => {
    element.textContent = selectedPickup && selectedDestination
      ? `${routePlaceName(selectedPickup)} to ${routePlaceName(selectedDestination)}`
      : 'Live route';
  });
  document.querySelectorAll('[data-trip-distance]').forEach(element => {
    element.textContent = `${distance.toFixed(1)} km left`;
  });
  document.querySelectorAll('[data-trip-duration]').forEach(element => {
    element.textContent = eta.duration;
  });
  document.querySelectorAll('[data-trip-arrival]').forEach(element => {
    element.textContent = eta.arrival;
  });
}

function updateTripRouteLabel() {
  updateEndpointLabels();

  document.querySelectorAll('[data-trip-route]').forEach(element => {
    element.textContent = selectedPickup && selectedDestination
      ? `${routePlaceName(selectedPickup)} to ${routePlaceName(selectedDestination)}`
      : 'Live route';
  });
}

function updateEndpointLabels() {
  document.querySelectorAll('[data-trip-pickup]').forEach(element => {
    element.textContent = selectedPickup ? routePlaceName(selectedPickup) : '--';
  });
  document.querySelectorAll('[data-trip-destination]').forEach(element => {
    element.textContent = selectedDestination ? routePlaceName(selectedDestination) : '--';
  });
}

function routePlaceName(value) {
  return getStop(value)?.name || value;
}

function routeKey(from, to) {
  return `${normalizeStop(from)}|${normalizeStop(to)}`;
}

function curatedRoutePath(from, to) {
  const forwardKey = routeKey(from, to);
  const reverseKey = routeKey(to, from);

  if (curatedRoutePaths[forwardKey]) return curatedRoutePaths[forwardKey];
  if (curatedRoutePaths[reverseKey]) return [...curatedRoutePaths[reverseKey]].reverse();
  return null;
}

async function fetchRoadRoute(start, destination) {
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Route service failed');

  const data = await response.json();
  const route = data.routes?.[0];
  const coordinates = route?.geometry?.coordinates;
  if (!coordinates?.length) throw new Error('No route geometry');

  return {
    points: coordinates.map(([lng, lat]) => [lat, lng]),
    distance: route.distance / 1000
  };
}

async function resolveRoutePath(start, destination, fromLabel, toLabel) {
  try {
    return await fetchRoadRoute(start, destination);
  } catch (error) {
    const fallback = curatedRoutePath(fromLabel, toLabel);
    if (fallback) {
      const fallbackDistance = curatedRouteDistances[routeKey(fromLabel, toLabel)] ||
        curatedRouteDistances[routeKey(toLabel, fromLabel)] ||
        pathDistanceKm(fallback);

      return {
        points: fallback,
        distance: fallbackDistance
      };
    }

    const points = [[start.lat, start.lng], [destination.lat, destination.lng]];
    return {
      points,
      distance: distanceKm(start, destination)
    };
  }
}

function setDestinationMarker(mapRef, destination) {
  const destinationLatLng = [destination.lat, destination.lng];

  if (mapRef.destinationMarker) {
    mapRef.destinationMarker.setLatLng(destinationLatLng);
    return;
  }

  mapRef.destinationMarker = L.marker(destinationLatLng, { icon: getRoutePinIcon('destination') })
    .bindPopup(`<b>${escapeHTML(destination.name)}</b>`)
    .addTo(mapRef.map);
}

function getRoutePinIcon(type) {
  const isPickup = type === 'pickup';
  return L.divIcon({
    html: `
      <span class="route-map-pin ${isPickup ? 'pickup-pin' : 'destination-pin'}">
        <i class="fas ${isPickup ? 'fa-location-dot' : 'fa-map-marker-alt'}"></i>
      </span>
    `,
    className: 'route-map-pin-wrap',
    iconSize: [34, 42],
    iconAnchor: [17, 41],
    popupAnchor: [0, -38]
  });
}

function setRouteLine(mapRef, points) {
  if (mapRef.routeLine) {
    mapRef.routeLine.setLatLngs(points);
    return;
  }

  mapRef.routeLine = L.polyline(points, {
    color: '#0ea5e9',
    weight: 5,
    opacity: 0.85,
    dashArray: '10 8'
  }).addTo(mapRef.map);
}

function setSelectedBusMarker(mapRef, route, pickup, destination) {
  if (!mapRef || !mapRef.map || !selectedBusName) return null;

  const bus = mapBuses.find(item => item.name === selectedBusName);
  if (!bus) return null;

  const progress = selectedBusProgress(bus, route.distance);
  const travelledKm = route.distance * progress;
  const remainingKm = Math.max(0, route.distance - travelledKm);
  const busPoint = pointAlongPath(route.points, travelledKm) || [pickup.lat, pickup.lng];
  const busLatLng = [busPoint[0], busPoint[1]];

  bus.currentLat = busLatLng[0];
  bus.currentLng = busLatLng[1];
  bus.lat = busLatLng[0];
  bus.lng = busLatLng[1];

  const popup = `
    <b>${escapeHTML(bus.name)}</b><br>
    ${escapeHTML(bus.route || 'Route bus')}<br>
    Started: ${bus.departureTs ? timeText(bus.departureTs) : 'Not available'}<br>
    Covered: ${travelledKm.toFixed(1)} km<br>
    Left: ${remainingKm.toFixed(1)} km
  `;

  if (mapRef.busMarker) {
    mapRef.busMarker.setLatLng(busLatLng).setPopupContent(popup);
  } else {
    mapRef.busMarker = L.marker(busLatLng, { icon: getMapIcon('bus') })
      .bindPopup(popup)
      .addTo(mapRef.map);
  }

  return { bus, busLatLng, travelledKm, remainingKm, progress };
}

async function renderPlannedRoute(mapRef) {
  if (!mapRef || !mapRef.map || !selectedPickup || !selectedDestination) return;

  updateMapStatus('Searching route places in West Bengal...');
  let pickup = getStop(selectedPickup);
  let destination = getStop(selectedDestination);

  if (!pickup || !destination) {
    try {
      const places = await resolveTripPlaces(selectedPickup, selectedDestination);
      pickup = places.start;
      destination = places.end;
    } catch (error) {
      updateMapStatus('Place search is unavailable right now. Try again in a moment.');
      return;
    }
  }

  if (!pickup || !destination) {
    updateMapStatus('Could not find both route places inside West Bengal.');
    return;
  }

  const pickupLatLng = [pickup.lat, pickup.lng];
  const destinationLatLng = [destination.lat, destination.lng];

  if (mapRef.pickupMarker) {
    mapRef.pickupMarker.setLatLng(pickupLatLng);
  } else {
    mapRef.pickupMarker = L.circleMarker(pickupLatLng, {
      radius: 8,
      color: '#ffffff',
      weight: 3,
      fillColor: '#10b981',
      fillOpacity: 1
    })
      .bindPopup(`<b>${escapeHTML(pickup.name)}</b>`)
      .addTo(mapRef.map);
  }

  setDestinationMarker(mapRef, destination);
  updateMapStatus('Loading road route...');

  const route = await resolveRoutePath(pickup, destination, selectedPickup, selectedDestination);
  plannedRouteState = { route, pickup, destination };
  setRouteLine(mapRef, route.points);

  const busState = insideBusMode ? null : setSelectedBusMarker(mapRef, route, pickup, destination);
  if (insideBusMode) clearBusMarker(mapRef);
  const summaryDistance = busState ? busState.remainingKm : route.distance;
  const eta = etaText(summaryDistance);
  const boundsPoints = busState ? [...route.points, busState.busLatLng] : route.points;

  mapRef.map.fitBounds(L.latLngBounds(boundsPoints).pad(0.16), { animate: true });
  updateTripSummary(summaryDistance, eta);
  updateMapStatus(busState
    ? `${busState.bus.name} is ${busState.travelledKm.toFixed(1)} km from ${pickup.name}. ${busState.remainingKm.toFixed(1)} km left to ${destination.name}.`
    : 'Route shown. Select a bus to see where it is on this route.');
}

async function renderTripOnMap(mapRef) {
  if (!mapRef || !mapRef.map || !guestLocation) return;

  let destination = getStop(selectedDestination);
  if (!destination && selectedDestination) {
    try {
      destination = await resolveWestBengalPlace(selectedDestination);
    } catch (error) {
      updateMapStatus('Place search is unavailable right now. Try again in a moment.');
      return;
    }
  }

  if (!destination) {
    mapRef.map.setView([guestLocation.lat, guestLocation.lng], 14, { animate: true });
    updateMapStatus('Your location is shown. Choose a West Bengal destination to calculate ETA.');
    return;
  }

  const userPoint = { lat: guestLocation.lat, lng: guestLocation.lng };
  const destinationLatLng = [destination.lat, destination.lng];
  const userLatLng = [userPoint.lat, userPoint.lng];

  setDestinationMarker(mapRef, destination);
  if (insideBusMode) clearBusMarker(mapRef);
  updateMapStatus('Loading road route from your location...');

  const route = await resolveRoutePath(userPoint, destination, selectedPickup, selectedDestination);
  setRouteLine(mapRef, route.points);

  const eta = etaText(route.distance);
  const bounds = L.latLngBounds(route.points.length > 1 ? route.points : [userLatLng, destinationLatLng]).pad(0.16);

  mapRef.map.fitBounds(bounds, { animate: true });
  updateTripSummary(route.distance, eta);
  if (insideBusMode) {
    updateMapStatus(selectedBusName
      ? `You are inside ${selectedBusName}. Your live position is shown on this route.`
      : `You are inside the bus. Your live position is shown on this route.`);
  } else if (insideBusSuggested && selectedBusName) {
    updateMapStatus(`${selectedBusName}: your location is on the selected route. Tap Inside bus if you are travelling in it.`);
  } else {
    updateMapStatus(selectedBusName
      ? `${selectedBusName}: your location is on the selected route. ETA is ${eta.duration}.`
      : `Your location is on the selected route. ETA is ${eta.duration}.`);
  }
}

let mobSearchResults = [];
let deskSearchResults = [];

function showRouteOnMobileMap(busName) {
  selectedBusName = busName;
  plannedRouteState = null;

  const pickup = document.getElementById('mobPickupInput')?.value.trim() || '';
  const destination = document.getElementById('mobDestinationInput')?.value.trim() || '';
  selectedPickup = pickup;
  selectedDestination = destination;
  saveActiveTrip(busName, pickup, destination);

  switchMobPage('map');

  setTimeout(() => {
    if (mobMap?.map) mobMap.map.invalidateSize();

    if (pickup && destination) {
      renderPlannedRoute(mobMap);
    } else {
      focusBusOnMap(mobMap, busName);
      updateMapStatus(`${busName} selected. Search a route to track ETA and use Inside bus.`);
    }
  }, 180);
}

function initApp() {
  if (window.ProfileSync) window.ProfileSync.sync();
  initDashboardAlertPopup();
  bindMapNavigationLinks();
  bindInsideBusToggles();
  initPlaceSuggesters();

  initDateDropdown('mobDateSelect', 'mobDatePicker', 'mobSelectedDateLabel');
  initDateDropdown('deskDateSelect', 'deskDatePicker', 'deskSelectedDateLabel');

  const mobSearchBtn = document.getElementById('mobSearchBtn');
  const deskSearchBtn = document.getElementById('deskSearchBtn');

  if (mobSearchBtn) {
    mobSearchBtn.addEventListener('click', async () => {
      mobSearchResults = await runSearch('mob');
    });
  }

  if (deskSearchBtn) {
    deskSearchBtn.addEventListener('click', async () => {
      deskSearchResults = await runSearch('desk');
      if (deskSearchResults.routeReady) {
        const pickup = document.getElementById('deskPickupInput')?.value.trim() || '';
        const destination = document.getElementById('deskDestinationInput')?.value.trim() || '';
        showRouteOnDashboard(pickup, destination);
      }
    });
  }

  const mobBusList = document.getElementById('mobBusList');
  const deskBusList = document.getElementById('deskBusList');

  if (mobBusList) {
    mobBusList.addEventListener('click', event => {
      const routeButton = event.target.closest('[data-show-route]');
      if (routeButton) {
        openMapForRoute(routeButton.dataset.pickup, routeButton.dataset.destination);
        return;
      }
      const card = event.target.closest('.bus-card[data-bus-name]');
      if (card) showRouteOnMobileMap(card.dataset.busName);
    });
    mobBusList.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const card = event.target.closest('.bus-card[data-bus-name]');
      if (card) {
        event.preventDefault();
        showRouteOnMobileMap(card.dataset.busName);
      }
    });
  }

  if (deskBusList) {
    deskBusList.addEventListener('click', event => {
      const routeButton = event.target.closest('[data-show-route]');
      if (routeButton) {
        showRouteOnDashboard(routeButton.dataset.pickup, routeButton.dataset.destination);
        return;
      }
      const card = event.target.closest('.bus-card[data-bus-name]');
      if (card) {
        const pickup = document.getElementById('deskPickupInput')?.value.trim() || selectedPickup;
        const destination = document.getElementById('deskDestinationInput')?.value.trim() || selectedDestination;
        showRouteOnDashboard(pickup, destination, card.dataset.busName);
      }
    });
    deskBusList.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const card = event.target.closest('.bus-card[data-bus-name]');
      if (card) {
        event.preventDefault();
        const pickup = document.getElementById('deskPickupInput')?.value.trim() || selectedPickup;
        const destination = document.getElementById('deskDestinationInput')?.value.trim() || selectedDestination;
        showRouteOnDashboard(pickup, destination, card.dataset.busName);
      }
    });
  }

  const mobWrap = document.getElementById('mobResultsWrap');
  const deskWrap = document.getElementById('deskResultsWrap');
  if (mobWrap) mobWrap.style.display = 'none';
  if (deskWrap) deskWrap.style.display = 'none';

  initTransitMaps();

  updateTripRouteLabel();

  if (selectedBusName || selectedPickup || selectedDestination) {
    saveActiveTrip(selectedBusName, selectedPickup, selectedDestination);
  }

  const arrivedFromBusClick = shouldAskLocationOnMap();
  if (selectedBusName || selectedDestination) {
    if (selectedDestination) {
      renderPlannedRoute(deskMapFull);
      renderPlannedRoute(mobMap);
    } else {
      focusBusOnMap(deskMapFull, selectedBusName);
      focusBusOnMap(mobMap, selectedBusName);
    }
  }

  if (arrivedFromBusClick || selectedDestination) {
    askTripLocation();
  }
}

function initDashboardAlertPopup() {
  const alertBtn = document.getElementById('dashboardAlertBtn');
  const popover = document.getElementById('dashboardAlertPopover');
  if (!alertBtn || !popover) return;

  alertBtn.addEventListener('click', event => {
    event.stopPropagation();
    popover.classList.toggle('show');
  });

  popover.addEventListener('click', event => event.stopPropagation());
  document.addEventListener('click', () => popover.classList.remove('show'));
}

document.addEventListener('DOMContentLoaded', initApp);

let mobActivePage = 'home';

function switchMobPage(id) {
  document.querySelectorAll('#mobMainContent .page').forEach(p => p.classList.remove('active-page'));
  const activePage = document.getElementById(`mob-${id}Page`);
  if (activePage) activePage.classList.add('active-page');

  document.querySelectorAll('.mobile-only .nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-nav') === id);
  });

  mobActivePage = id;

  if (id === 'home' && mobSearchResults.length) {
    renderBusList('mobBusList', mobSearchResults);
  }

  if (id === 'map') {
    refreshActiveMap(id, 'mobile');
    focusBusOnMap(mobMap, selectedBusName);
  }
}

document.querySelectorAll('.mobile-only .nav-item[data-nav]:not([onclick])').forEach(btn => {
  btn.addEventListener('click', () => switchMobPage(btn.getAttribute('data-nav')));
});

let deskActivePage = 'home';
const deskTitles = {
  home: 'Dashboard',
  map: 'Live Map',
  alerts: 'Alerts & Notices',
  profile: 'My Profile'
};

function switchDeskPage(id) {
  document.querySelectorAll('.d-page').forEach(p => p.classList.remove('d-active'));
  const activePage = document.getElementById(`desk-${id}Page`);
  if (activePage) activePage.classList.add('d-active');

  document.querySelectorAll('.sd-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-dsk') === id);
  });

  const titleEl = document.getElementById('deskPageTitle');
  if (titleEl && deskTitles[id]) titleEl.textContent = deskTitles[id];
  const alertMenu = document.querySelector('.alert-menu-wrap');
  if (alertMenu) {
    alertMenu.style.display = id === 'home' ? '' : 'none';
    if (id !== 'home') {
      document.getElementById('dashboardAlertPopover')?.classList.remove('show');
    }
  }

  deskActivePage = id;

  if (id === 'home' && deskSearchResults.length) {
    renderBusList('deskBusList', deskSearchResults);
  }

  if (id === 'home' || id === 'map') {
    refreshActiveMap(id, 'desktop');
    if (id === 'map') focusBusOnMap(deskMapFull, selectedBusName);
  }
}

document.querySelectorAll('.sd-nav-item[data-dsk]').forEach(btn => {
  btn.addEventListener('click', () => switchDeskPage(btn.getAttribute('data-dsk')));
});

setInterval(() => {
  if (mobActivePage === 'home' && mobSearchResults.length) {
    renderMatchedSearchList('mob', mobSearchResults);
  }
  if (deskActivePage === 'home' && deskSearchResults.length) {
    renderMatchedSearchList('desk', deskSearchResults);
  }
}, 1000);

// PRELOADER
const DASHBOARD_PRELOADER_SEEN_KEY = 'smartBusDashboardPreloaderSeen';
const preloader = document.getElementById('preloader');

if (preloader && localStorage.getItem(DASHBOARD_PRELOADER_SEEN_KEY) === '1') {
  preloader.classList.add('hide');
  preloader.style.display = 'none';
}

window.addEventListener('load', () => {
  const dashboardPreloader = document.getElementById('preloader');
  if (!dashboardPreloader) return;

  if (localStorage.getItem(DASHBOARD_PRELOADER_SEEN_KEY) === '1') {
    dashboardPreloader.classList.add('hide');
    dashboardPreloader.style.display = 'none';
    return;
  }

  setTimeout(() => {
    dashboardPreloader.classList.add('hide');
    localStorage.setItem(DASHBOARD_PRELOADER_SEEN_KEY, '1');
  }, 2700);
});
