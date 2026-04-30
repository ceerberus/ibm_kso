// Geocoding utility using Nominatim (OpenStreetMap)
// Free, no API key required, respects usage policy

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
}

export interface AddressSuggestion {
  displayName: string;
  lat: number;
  lng: number;
}

/**
 * Geocode an address to coordinates
 * Biased towards Zurich area for better results
 */
export async function geocodeAddress(
  address: string
): Promise<GeocodingResult | null> {
  if (!address.trim()) return null;

  try {
    // Add "Zurich" to query if not already present for better local results
    const query = address.toLowerCase().includes('zurich') 
      ? address 
      : `${address}, Zurich, Switzerland`;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: query,
          format: 'json',
          limit: '1',
          addressdetails: '1',
          // Bias results towards Zurich
          viewbox: '8.4,47.45,8.7,47.3',
          bounded: '0',
        }),
      {
        headers: {
          'User-Agent': 'EventDiscoveryApp/1.0',
        },
      }
    );

    if (!response.ok) {
      console.error('Geocoding API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name,
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Get address suggestions as user types
 * Returns up to 5 suggestions
 */
export async function getAddressSuggestions(
  query: string
): Promise<AddressSuggestion[]> {
  if (!query.trim() || query.length < 3) return [];

  try {
    // Add "Zurich" context for better local results
    const searchQuery = query.toLowerCase().includes('zurich')
      ? query
      : `${query}, Zurich`;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: searchQuery,
          format: 'json',
          limit: '5',
          addressdetails: '1',
          // Bias results towards Zurich
          viewbox: '8.4,47.45,8.7,47.3',
          bounded: '0',
        }),
      {
        headers: {
          'User-Agent': 'EventDiscoveryApp/1.0',
        },
      }
    );

    if (!response.ok) {
      console.error('Address suggestions API error:', response.status);
      return [];
    }

    const data = await response.json();

    return data.map((item: any) => ({
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error('Address suggestions error:', error);
    return [];
  }
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait) as unknown as number;
  };
}

// Made with Bob
