export const HUB_CITIES = [
  // UK Hubs (GB)
  { name: 'London', lat: 51.5074, lon: -0.1278, countryCode: 'GB' },
  { name: 'Birmingham', lat: 52.4862, lon: -1.8904, countryCode: 'GB' },
  { name: 'Glasgow', lat: 55.8642, lon: -4.2518, countryCode: 'GB' },
  { name: 'Leeds', lat: 53.8008, lon: -1.5491, countryCode: 'GB' },
  { name: 'Sheffield', lat: 53.3811, lon: -1.4701, countryCode: 'GB' },
  { name: 'Liverpool', lat: 53.4084, lon: -2.9916, countryCode: 'GB' },
  { name: 'Manchester', lat: 53.4808, lon: -2.2426, countryCode: 'GB' },
  { name: 'Bristol', lat: 51.4545, lon: -2.5879, countryCode: 'GB' },
  { name: 'Newcastle', lat: 54.9783, lon: -1.6174, countryCode: 'GB' },
  { name: 'Nottingham', lat: 52.9548, lon: -1.1581, countryCode: 'GB' },
  { name: 'Edinburgh', lat: 55.9533, lon: -3.1883, countryCode: 'GB' },
  { name: 'Cardiff', lat: 51.4816, lon: -3.1791, countryCode: 'GB' },

  // India Hubs (IN)
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777, countryCode: 'IN' },
  { name: 'Nashik', lat: 20.0110, lon: 73.7903, countryCode: 'IN' },
  { name: 'Delhi', lat: 28.6139, lon: 77.2090, countryCode: 'IN' },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946, countryCode: 'IN' },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639, countryCode: 'IN' },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707, countryCode: 'IN' },
  { name: 'Pune', lat: 18.5204, lon: 73.8567, countryCode: 'IN' },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, countryCode: 'IN' },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, countryCode: 'IN' },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873, countryCode: 'IN' },

  // USA Hubs (US)
  { name: 'New York', lat: 40.7128, lon: -74.0060, countryCode: 'US' },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, countryCode: 'US' },
  { name: 'Chicago', lat: 41.8781, lon: -87.6298, countryCode: 'US' },
  { name: 'Houston', lat: 29.7604, lon: -95.3698, countryCode: 'US' },
  { name: 'Miami', lat: 25.7617, lon: -80.1918, countryCode: 'US' },
  { name: 'Seattle', lat: 47.6062, lon: -122.3321, countryCode: 'US' },
  { name: 'Boston', lat: 42.3601, lon: -71.0589, countryCode: 'US' },
  { name: 'Atlanta', lat: 33.7490, lon: -84.3880, countryCode: 'US' },
  { name: 'Dallas', lat: 32.7767, lon: -96.7970, countryCode: 'US' },
  { name: 'Denver', lat: 39.7392, lon: -104.9903, countryCode: 'US' },
  { name: 'Phoenix', lat: 33.4484, lon: -112.0740, countryCode: 'US' },
  { name: 'San Francisco', lat: 37.7749, lon: -122.4194, countryCode: 'US' },

  // Rest of World (DE, JP, BR, AU, AE)
  { name: 'Berlin', lat: 52.5200, lon: 13.4050, countryCode: 'DE' },
  { name: 'Munich', lat: 48.1351, lon: 11.5820, countryCode: 'DE' },
  { name: 'Frankfurt', lat: 50.1109, lon: 8.6821, countryCode: 'DE' },
  
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, countryCode: 'JP' },
  { name: 'Osaka', lat: 34.6937, lon: 135.5023, countryCode: 'JP' },
  
  { name: 'Sao Paulo', lat: -23.5505, lon: -46.6333, countryCode: 'BR' },
  { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, countryCode: 'BR' },
  
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, countryCode: 'AU' },
  { name: 'Melbourne', lat: -37.8136, lon: 144.9631, countryCode: 'AU' },
  { name: 'Brisbane', lat: -27.4698, lon: 153.0251, countryCode: 'AU' },
  
  { name: 'Dubai', lat: 25.2048, lon: 55.2708, countryCode: 'AE' },
  { name: 'Abu Dhabi', lat: 24.4539, lon: 54.3773, countryCode: 'AE' }
];

/**
 * Calculates the great-circle distance between two points on the Earth's surface using the Haversine formula.
 * @returns {number} Distance in kilometers
 */
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the closest predefined major hub city for a given coordinate.
 * Falls back to the provided state or local city if no hub is found within the same country.
 */
export function getClosestHubCity(lat, lon, countryCode, fallbackName) {
  const countryHubs = HUB_CITIES.filter(hub => hub.countryCode === countryCode);
  
  if (countryHubs.length === 0) {
    return fallbackName; // No predefined hubs for this country, fallback
  }

  let closestHub = null;
  let minDistance = Infinity;

  for (const hub of countryHubs) {
    const dist = getHaversineDistance(lat, lon, hub.lat, hub.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closestHub = hub;
    }
  }

  // If the closest hub is insanely far away (>2000km), fallback. Otherwise use hub.
  if (minDistance > 2000) {
    return fallbackName;
  }

  return closestHub.name;
}
