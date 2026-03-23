// ============================================
// RailVision Mock Data Engine
// Realistic Indian Railway data simulation
// ============================================

// ─── Station Database ───
export const stations = [
  { code: 'NDLS', name: 'New Delhi', city: 'Delhi', zone: 'NR', lat: 28.6419, lng: 77.2195 },
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', zone: 'CR', lat: 18.9398, lng: 72.8354 },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', zone: 'ER', lat: 22.5838, lng: 88.3425 },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai', zone: 'SR', lat: 13.0827, lng: 80.2707 },
  { code: 'SBC', name: 'Bangalore City', city: 'Bangalore', zone: 'SWR', lat: 12.9785, lng: 77.5713 },
  { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai', zone: 'WR', lat: 18.9691, lng: 72.8198 },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', zone: 'NWR', lat: 26.9194, lng: 75.7875 },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', zone: 'WR', lat: 23.0245, lng: 72.6010 },
  { code: 'LKO', name: 'Lucknow', city: 'Lucknow', zone: 'NR', lat: 26.8341, lng: 80.9177 },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna', zone: 'ECR', lat: 25.6078, lng: 85.0991 },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', zone: 'SCR', lat: 17.3607, lng: 78.4699 },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', zone: 'CR', lat: 18.5284, lng: 73.8745 },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', zone: 'NCR', lat: 26.4534, lng: 80.3500 },
  { code: 'AGC', name: 'Agra Cantt', city: 'Agra', zone: 'NCR', lat: 27.1565, lng: 78.0099 },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', zone: 'WCR', lat: 23.2688, lng: 77.4123 },
  { code: 'CDG', name: 'Chandigarh', city: 'Chandigarh', zone: 'NR', lat: 30.6920, lng: 76.7870 },
  { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', zone: 'NER', lat: 26.7463, lng: 83.3696 },
  { code: 'UDZ', name: 'Udaipur City', city: 'Udaipur', zone: 'NWR', lat: 24.5780, lng: 73.6828 },
  { code: 'VSKP', name: 'Visakhapatnam', city: 'Visakhapatnam', zone: 'ECoR', lat: 17.7264, lng: 83.3176 },
  { code: 'RJT', name: 'Rajkot Junction', city: 'Rajkot', zone: 'WR', lat: 22.3027, lng: 70.7975 },
  { code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur', zone: 'CR', lat: 21.1497, lng: 79.0882 },
  { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', zone: 'NR', lat: 25.3170, lng: 83.0098 },
  { code: 'GWL', name: 'Gwalior Junction', city: 'Gwalior', zone: 'NCR', lat: 26.2191, lng: 78.1811 },
  { code: 'DHN', name: 'Dhanbad Junction', city: 'Dhanbad', zone: 'ECR', lat: 23.7911, lng: 86.4304 },
  { code: 'RNC', name: 'Ranchi Junction', city: 'Ranchi', zone: 'SER', lat: 23.3435, lng: 85.3181 },
  { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', zone: 'SR', lat: 8.4895, lng: 76.9522 },
  { code: 'CBE', name: 'Coimbatore Junction', city: 'Coimbatore', zone: 'SR', lat: 11.0018, lng: 76.9674 },
  { code: 'MDU', name: 'Madurai Junction', city: 'Madurai', zone: 'SR', lat: 9.9194, lng: 78.1254 },
  { code: 'GHY', name: 'Guwahati', city: 'Guwahati', zone: 'NFR', lat: 26.1854, lng: 91.6832 },
  { code: 'JAT', name: 'Jammu Tawi', city: 'Jammu', zone: 'NR', lat: 32.7101, lng: 74.8665 },
];

// ─── Train Names ───
const trainPrefixes = ['Rajdhani', 'Shatabdi', 'Duronto', 'Garib Rath', 'Sampark Kranti', 'Jan Shatabdi', 'Humsafar', 'Tejas', 'Vande Bharat', 'Antyodaya'];
const trainSuffixes = ['Express', 'Superfast', 'Mail', 'Special'];

// ─── Route Generator ───
function generateRoutes() {
  const routes = [];
  const routePairs = [
    ['NDLS', 'CSMT'], ['NDLS', 'HWH'], ['NDLS', 'MAS'], ['NDLS', 'SBC'],
    ['CSMT', 'MAS'], ['CSMT', 'SBC'], ['HWH', 'MAS'], ['HWH', 'SBC'],
    ['NDLS', 'JP'], ['NDLS', 'ADI'], ['NDLS', 'LKO'], ['NDLS', 'PNBE'],
    ['CSMT', 'PUNE'], ['CSMT', 'ADI'], ['CSMT', 'NGP'], ['CSMT', 'HYB'],
    ['HWH', 'PNBE'], ['HWH', 'BSB'], ['HWH', 'GHY'], ['MAS', 'TVC'],
    ['MAS', 'CBE'], ['SBC', 'HYB'], ['JP', 'ADI'], ['LKO', 'BSB'],
    ['NDLS', 'CDG'], ['NDLS', 'JAT'], ['NDLS', 'BSB'], ['NDLS', 'BPL'],
    ['CSMT', 'BPL'], ['HWH', 'DHN'],
  ];

  routePairs.forEach(([from, to], i) => {
    const fromStation = stations.find(s => s.code === from);
    const toStation = stations.find(s => s.code === to);
    const prefix = trainPrefixes[i % trainPrefixes.length];
    const suffix = trainSuffixes[i % trainSuffixes.length];

    // Generate 2-3 trains per route
    const trainCount = 2 + Math.floor(seededRandom(i * 17) * 2);
    for (let t = 0; t < trainCount; t++) {
      const trainNum = 12000 + i * 10 + t * 2;
      const depHour = (5 + Math.floor(seededRandom(i * 7 + t * 3) * 18)) % 24;
      const depMin = Math.floor(seededRandom(i * 11 + t * 5) * 4) * 15;
      const duration = 4 + Math.floor(seededRandom(i * 13 + t * 7) * 20);
      const arrHour = (depHour + duration) % 24;
      const arrMin = (depMin + Math.floor(seededRandom(i * 19 + t * 11) * 4) * 15) % 60;

      routes.push({
        id: `train-${trainNum}`,
        trainNumber: trainNum,
        trainName: `${fromStation.city}-${toStation.city} ${prefix} ${suffix}`,
        from: fromStation,
        to: toStation,
        departure: `${String(depHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`,
        arrival: `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`,
        duration: `${duration}h ${arrMin}m`,
        daysOfWeek: generateDaysOfWeek(seededRandom(i * 23 + t * 13)),
        coaches: generateCoaches(seededRandom(i * 29 + t * 17)),
      });
    }
  });

  return routes;
}

function generateDaysOfWeek(seed) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  if (seed > 0.7) return days; // daily
  const selected = days.filter((_, i) => seededRandom(seed * 100 + i) > 0.35);
  return selected.length > 0 ? selected : days;
}

function generateCoaches(seed) {
  const types = ['General', 'Sleeper', '3A', '2A', '1A'];
  return types.map((type, i) => ({
    type,
    totalSeats: type === 'General' ? 90 : type === 'Sleeper' ? 72 : type === '3A' ? 64 : type === '2A' ? 48 : 24,
    count: type === 'General' ? Math.floor(seed * 3) + 3 : type === 'Sleeper' ? Math.floor(seed * 4) + 4 : Math.floor(seed * 2) + 1,
  }));
}

// ─── Seeded Random ───
function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ─── Crowd Density Generator ───
export function getCrowdDensity(trainId, hour, dayOfWeek, dateOffset = 0) {
  const trainSeed = hashCode(trainId);

  // Base density from train popularity
  let baseDensity = 30 + (seededRandom(trainSeed) * 30);

  // Time-of-day pattern (peaks at 8-10 AM and 5-7 PM)
  const morningPeak = Math.exp(-Math.pow(hour - 9, 2) / 8) * 35;
  const eveningPeak = Math.exp(-Math.pow(hour - 18, 2) / 8) * 30;
  const lateNightDip = hour >= 22 || hour <= 4 ? -20 : 0;

  // Day-of-week pattern (higher on Fri, Sun)
  const dayMultiplier = [1.0, 0.85, 0.85, 0.9, 1.15, 1.1, 1.2][dayOfWeek];

  // Seasonal variation
  const dayOfYear = (dateOffset + 75) % 365;
  const festivalBoost =
    (dayOfYear > 280 && dayOfYear < 310) ? 25 :  // Diwali season
    (dayOfYear > 85 && dayOfYear < 100) ? 15 :   // Holi season
    (dayOfYear > 150 && dayOfYear < 170) ? 10 :  // Summer holidays
    0;

  // Random noise
  const noise = (seededRandom(trainSeed + hour * 100 + dayOfWeek * 1000 + dateOffset * 7) - 0.5) * 20;

  let density = (baseDensity + morningPeak + eveningPeak + lateNightDip + festivalBoost + noise) * dayMultiplier;
  density = Math.max(5, Math.min(100, density));

  return Math.round(density);
}

export function getCrowdLevel(density) {
  if (density <= 40) return 'low';
  if (density <= 70) return 'moderate';
  return 'high';
}

export function getCrowdLabel(level) {
  return { low: 'Low', moderate: 'Moderate', high: 'High' }[level];
}

export function getCrowdColor(level) {
  return {
    low: 'var(--crowd-low)',
    moderate: 'var(--crowd-moderate)',
    high: 'var(--crowd-high)'
  }[level];
}

// ─── Historical Data Generator ───
export function generateHistoricalData(trainId, days = 30) {
  const data = [];
  const now = new Date();

  for (let d = days - 1; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const dayOfWeek = date.getDay();
    const hourlyData = [];

    for (let h = 0; h < 24; h++) {
      hourlyData.push({
        hour: h,
        density: getCrowdDensity(trainId, h, dayOfWeek, d),
      });
    }

    data.push({
      date: date.toISOString().split('T')[0],
      dayOfWeek,
      dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
      hourlyData,
      avgDensity: Math.round(hourlyData.reduce((sum, h) => sum + h.density, 0) / 24),
      peakDensity: Math.max(...hourlyData.map(h => h.density)),
      peakHour: hourlyData.reduce((max, h) => h.density > max.density ? h : max, hourlyData[0]).hour,
    });
  }

  return data;
}

// ─── Alerts Generator ───
export function generateAlerts(trains) {
  const alerts = [];
  const alertTypes = [
    { type: 'overcrowding', severity: 'danger', template: 'Overcrowding detected on {train} at {station}' },
    { type: 'delay', severity: 'warning', template: '{train} running {mins} mins late from {station}' },
    { type: 'advisory', severity: 'info', template: 'Extra coaches added to {train} due to high demand' },
    { type: 'platform', severity: 'info', template: 'Platform change for {train} at {station}: Now Platform {platform}' },
  ];

  for (let i = 0; i < 15; i++) {
    const train = trains[Math.floor(seededRandom(i * 31) * trains.length)];
    const alertDef = alertTypes[Math.floor(seededRandom(i * 37) * alertTypes.length)];
    const minsAgo = Math.floor(seededRandom(i * 41) * 120);

    let message = alertDef.template
      .replace('{train}', train.trainName.split(' ').slice(0, 3).join(' '))
      .replace('{station}', seededRandom(i * 43) > 0.5 ? train.from.name : train.to.name)
      .replace('{mins}', String(Math.floor(seededRandom(i * 47) * 45) + 15))
      .replace('{platform}', String(Math.floor(seededRandom(i * 53) * 8) + 1));

    alerts.push({
      id: `alert-${i}`,
      type: alertDef.type,
      severity: alertDef.severity,
      message,
      train: train.trainName,
      timestamp: new Date(Date.now() - minsAgo * 60000).toISOString(),
      timeAgo: minsAgo < 60 ? `${minsAgo}m ago` : `${Math.floor(minsAgo / 60)}h ${minsAgo % 60}m ago`,
    });
  }

  return alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// ─── Reports Generator ───
export function generateReports() {
  return [
    { id: 'r1', station: 'New Delhi', density: 'high', notes: 'Platform 5 very crowded', time: '15 mins ago', user: 'Passenger' },
    { id: 'r2', station: 'Mumbai Central', density: 'moderate', notes: 'General coach full', time: '32 mins ago', user: 'Passenger' },
    { id: 'r3', station: 'Howrah Junction', density: 'high', notes: 'Extremely crowded, need extra coaches', time: '1h ago', user: 'Staff' },
    { id: 'r4', station: 'Chennai Central', density: 'low', notes: 'Morning rush has cleared', time: '1h 15m ago', user: 'Passenger' },
    { id: 'r5', station: 'Jaipur Junction', density: 'moderate', notes: 'Tourist season, moderate crowd', time: '2h ago', user: 'Staff' },
  ];
}

// ─── Dashboard KPIs ───
export function getDashboardKPIs(trains) {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  let totalPassengers = 0;
  let totalDensity = 0;
  let overcrowdingAlerts = 0;

  trains.forEach(train => {
    const density = getCrowdDensity(train.id, hour, day);
    const coaches = train.coaches.reduce((sum, c) => sum + c.count * c.totalSeats, 0);
    totalPassengers += Math.round((density / 100) * coaches);
    totalDensity += density;
    if (density > 75) overcrowdingAlerts++;
  });

  return {
    totalPassengers,
    avgDensity: Math.round(totalDensity / trains.length),
    overcrowdingAlerts,
    activeReports: 5 + Math.floor(seededRandom(hour * 7 + day * 3) * 20),
    activeTrains: trains.length,
  };
}

// ─── Peak Hours Heatmap Data ───
export function getHeatmapData(trains) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = [];

  days.forEach((dayName, dayIdx) => {
    const row = { day: dayName, hours: [] };
    for (let h = 0; h < 24; h++) {
      let avgDensity = 0;
      trains.forEach(train => {
        avgDensity += getCrowdDensity(train.id, h, dayIdx);
      });
      avgDensity = Math.round(avgDensity / trains.length);
      row.hours.push(avgDensity);
    }
    data.push(row);
  });

  return data;
}

// ─── High-Density Route Data ───
export function getHighDensityRoutes(trains) {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  return trains.map(train => {
    const density = getCrowdDensity(train.id, hour, day);
    const history = generateHistoricalData(train.id, 7);
    const avgDensity = Math.round(history.reduce((sum, d) => sum + d.avgDensity, 0) / history.length);
    const peakHour = history.reduce((max, d) => d.peakDensity > max.peakDensity ? d : max, history[0]);

    return {
      id: train.id,
      route: `${train.from.code} → ${train.to.code}`,
      routeFull: `${train.from.name} → ${train.to.name}`,
      trainName: train.trainName,
      currentDensity: density,
      avgDensity,
      peakHour: `${String(peakHour.peakHour).padStart(2, '0')}:00`,
      level: getCrowdLevel(density),
    };
  }).sort((a, b) => b.currentDensity - a.currentDensity);
}

// ─── Hash Code Utility ───
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// ─── Initialize All Data ───
let backendTrains = [];
try {
  const res = await fetch('http://localhost:8000/trains');
  const d = await res.json();
  backendTrains = d.data.map(t => ({
    id: t.train_id,
    trainNumber: t.train_id.split('-')[1] || t.train_id,
    trainName: Object.keys(t).includes("train_name") ? t.train_name : t.train_id,
    from: stations.find(s => s.code === t.source) || {code: t.source, name: t.source},
    to: stations.find(s => s.code === t.destination) || {code: t.destination, name: t.destination},
    departure: new Date(t.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    arrival: new Date(new Date(t.departure_time).getTime() + 4*3600*1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    duration: "4h",
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    coaches: generateCoaches(0.7)
  }));
} catch(e) {
  console.log('Backend fetch failed. Returning empty. Error:', e);
}

export const allTrains = backendTrains;
export const allAlerts = allTrains.length > 0 ? generateAlerts(allTrains) : [];
export const allReports = generateReports();

// ─── Search Trains ───
export function searchTrains(fromCode, toCode) {
  if (!fromCode || !toCode) return allTrains.slice(0, 10);

  const results = allTrains.filter(t =>
    t.from.code === fromCode && t.to.code === toCode
  );

  // Also include reverse direction
  const reverse = allTrains.filter(t =>
    t.from.code === toCode && t.to.code === fromCode
  );

  if (results.length === 0 && reverse.length === 0) {
    // Return some trains from/to these stations
    return allTrains.filter(t =>
      t.from.code === fromCode || t.to.code === toCode
    ).slice(0, 6);
  }

  return results.length > 0 ? results : reverse;
}
