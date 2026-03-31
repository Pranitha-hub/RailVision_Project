// ============================================
// Indian Station Reference Data (static lookup)
// Used for station pickers and map coordinates
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

// Crowd level helpers (pure function, no server needed)
export function getCrowdLevel(density) {
  if (density <= 40) return 'low';
  if (density <= 70) return 'moderate';
  return 'high';
}
