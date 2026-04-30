/**
 * Swiss cities data with coordinates
 * Following best practices: accurate data, proper typing
 */

import { City } from '@/types';

export const swissCities: City[] = [
  { name: 'Zurich', lat: 47.3769, lng: 8.5417 },
  { name: 'Geneva', lat: 46.2044, lng: 6.1432 },
  { name: 'Basel', lat: 47.5596, lng: 7.5886 },
  { name: 'Bern', lat: 46.9480, lng: 7.4474 },
  { name: 'Lausanne', lat: 46.5197, lng: 6.6323 },
  { name: 'Lucerne', lat: 47.0502, lng: 8.3093 },
  { name: 'St. Gallen', lat: 47.4245, lng: 9.3767 },
  { name: 'Lugano', lat: 46.0037, lng: 8.9511 },
  { name: 'Winterthur', lat: 47.5000, lng: 8.7500 },
  { name: 'Thun', lat: 46.7578, lng: 7.6281 },
];

export const getCityByName = (name: string): City | undefined => {
  return swissCities.find(city => city.name.toLowerCase() === name.toLowerCase());
};

export const getCityNames = (): string[] => {
  return swissCities.map(city => city.name);
};

// Made with Bob
