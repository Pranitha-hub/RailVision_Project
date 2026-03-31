// ============================================
// Indian Station Reference Data (static lookup)
// Used for station pickers, map coordinates,
// and GPS-based nearest station detection
// ============================================

export const stations = [
  { code: 'NDLS', name: 'New Delhi',                       city: 'Delhi',             lat: 28.6419, lng: 77.2195 },
  { code: 'CSMT', name: 'Chhatrapati Shivaji Term.',       city: 'Mumbai',            lat: 18.9398, lng: 72.8354 },
  { code: 'HWH',  name: 'Howrah Junction',                 city: 'Kolkata',           lat: 22.5838, lng: 88.3425 },
  { code: 'MAS',  name: 'Chennai Central',                 city: 'Chennai',           lat: 13.0827, lng: 80.2707 },
  { code: 'SBC',  name: 'Bangalore City',                  city: 'Bangalore',         lat: 12.9785, lng: 77.5713 },
  { code: 'BCT',  name: 'Mumbai Central',                  city: 'Mumbai',            lat: 18.9691, lng: 72.8198 },
  { code: 'JP',   name: 'Jaipur Junction',                 city: 'Jaipur',            lat: 26.9194, lng: 75.7875 },
  { code: 'ADI',  name: 'Ahmedabad Junction',              city: 'Ahmedabad',         lat: 23.0245, lng: 72.6010 },
  { code: 'LKO',  name: 'Lucknow',                         city: 'Lucknow',           lat: 26.8341, lng: 80.9177 },
  { code: 'PNBE', name: 'Patna Junction',                  city: 'Patna',             lat: 25.6078, lng: 85.0991 },
  { code: 'SC',   name: 'Secundarabad Junction',           city: 'Hyderabad',         lat: 17.4399, lng: 78.4983 },
  { code: 'PUNE', name: 'Pune Junction',                   city: 'Pune',              lat: 18.5284, lng: 73.8745 },
  { code: 'JU',   name: 'Jodhpur Junction',                city: 'Jodhpur',           lat: 26.2785, lng: 73.0297 },
  { code: 'NGP',  name: 'Nagpur Junction',                 city: 'Nagpur',            lat: 21.1497, lng: 79.0882 },
  { code: 'BSB',  name: 'Varanasi Junction',               city: 'Varanasi',          lat: 25.3170, lng: 83.0098 },
  { code: 'GWL',  name: 'Gwalior Junction',                city: 'Gwalior',           lat: 26.2191, lng: 78.1811 },
  { code: 'TVC',  name: 'Thiruvananthapuram Central',      city: 'Thiruvananthapuram',lat:  8.4895, lng: 76.9522 },
  { code: 'CBE',  name: 'Coimbatore Junction',             city: 'Coimbatore',        lat: 11.0018, lng: 76.9674 },
  { code: 'GHY',  name: 'Guwahati',                        city: 'Guwahati',          lat: 26.1854, lng: 91.6832 },
  { code: 'JAT',  name: 'Jammu Tawi',                      city: 'Jammu',             lat: 32.7101, lng: 74.8665 },
];

// ── Crowd Level Helpers ──
export function getCrowdLevel(density) {
  if (density <= 40) return 'low';
  if (density <= 70) return 'moderate';
  return 'high';
}

// ── Haversine Distance (km) ──
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius km
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
          + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Find the nearest station to a GPS coordinate.
 * @param {number} lat
 * @param {number} lng
 * @returns {{ station: Object, distance: number }} station object + km
 */
export function findNearestStation(lat, lng) {
  let best = null;
  let bestDist = Infinity;

  for (const st of stations) {
    const d = haversine(lat, lng, st.lat, st.lng);
    if (d < bestDist) {
      bestDist = d;
      best = st;
    }
  }

  return { station: best, distance: Math.round(bestDist) };
}

/**
 * Calculate a crowd adjustment factor based on weather.
 * Rain/storms tend to increase station crowding (people shelter).
 * Extreme heat reduces suburban commuters but increases long-distance AC demand.
 * @param {number} weatherCode WMO weather code
 * @param {number} temperature degrees C
 * @returns {number} multiplier (e.g. 1.15 = +15% crowd)
 */
export function getWeatherCrowdFactor(weatherCode, temperature) {
  let factor = 1.0;

  // Rain increases station crowding
  if (weatherCode >= 61 && weatherCode <= 65) factor += 0.12;  // rain
  if (weatherCode >= 80 && weatherCode <= 82) factor += 0.18;  // heavy showers
  if (weatherCode >= 95) factor += 0.25;                       // thunderstorm

  // Fog reduces travel
  if (weatherCode >= 45 && weatherCode <= 48) factor -= 0.08;

  // Extreme heat (> 42°C) or cold (< 5°C) reduces crowd
  if (temperature > 42) factor -= 0.10;
  if (temperature < 5)  factor -= 0.12;

  return Math.max(0.6, Math.min(1.4, factor));
}
