import axios from 'axios';
import type {
  EdmtrainEvent,
  EdmtrainLocation,
  EventSearchParams,
  LocationSearchParams,
  NearbyEventsParams,
} from './types';

const EDMTRAIN_BASE_URL = 'https://edmtrain.com';
const API_KEY = import.meta.env.VITE_EDMTRAIN_API_KEY;

if (!API_KEY) {
  console.warn(
    'Edmtrain API key not found. Set VITE_EDMTRAIN_API_KEY in your environment variables.'
  );
}

class EdmtrainService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  private getCacheKey(endpoint: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce(
        (result, key) => {
          result[key] = params[key];
          return result;
        },
        {} as Record<string, any>
      );

    return `${endpoint}_${JSON.stringify(sortedParams)}`;
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    if (!API_KEY) {
      throw new Error(
        'Edmtrain API key is required. Please set VITE_EDMTRAIN_API_KEY in your environment variables.'
      );
    }

    const cacheKey = this.getCacheKey(endpoint, params);
    const cachedData = this.getCachedData(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const url = `${EDMTRAIN_BASE_URL}/${endpoint}`;
    const requestParams = { ...params, client: API_KEY };

    try {
      const response = await axios.get(url, {
        params: requestParams,
        timeout: 10000,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'EDM-Events-Portfolio-App/1.0',
        },
      });

      if (response.data && response.data.success === false) {
        throw new Error(response.data.message || 'API request failed');
      }

      const data = response.data?.data || response.data;
      this.setCachedData(cacheKey, data);

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid API key. Please check your Edmtrain API credentials.');
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout. Please check your internet connection.');
        }
      }

      console.error('Edmtrain API Error:', error);
      throw new Error('Failed to fetch events data. Please try again later.');
    }
  }

  async getEvents(params: EventSearchParams = {}): Promise<EdmtrainEvent[]> {
    const defaultParams = {
      includeElectronicGenreInd: true,
      includeOtherGenreInd: false,
      startDate: new Date().toISOString().split('T')[0], // Today's date
      ...params,
    };

    return this.makeRequest<EdmtrainEvent[]>('events', defaultParams);
  }

  async getNearbyEvents(params: NearbyEventsParams): Promise<EdmtrainEvent[]> {
    const defaultParams = {
      includeElectronicGenreInd: true,
      includeOtherGenreInd: false,
      ...params,
    };

    return this.makeRequest<EdmtrainEvent[]>('events', defaultParams);
  }

  async getLocations(params: LocationSearchParams = {}): Promise<EdmtrainLocation[]> {
    return this.makeRequest<EdmtrainLocation[]>('locations', params);
  }

  async getPopularLocations(): Promise<EdmtrainLocation[]> {
    return this.getLocations(); // No params returns popular locations
  }

  // Helper method to get events for a specific city
  async getEventsByCity(city: string, state?: string): Promise<EdmtrainEvent[]> {
    try {
      // First, get the location ID for the city
      const locations = await this.getLocations({ city, state });

      if (locations.length === 0) {
        throw new Error(`No events found for ${city}${state ? `, ${state}` : ''}`);
      }

      // Use the first matching location
      const location = locations[0];

      // Then get events for that location
      return this.getEvents({
        locationIds: [location.id],
        includeElectronicGenreInd: true,
      });
    } catch (error) {
      console.error('Error fetching events by city:', error);
      throw error;
    }
  }

  // Helper method to get user's current location events
  async getCurrentLocationEvents(): Promise<EdmtrainEvent[]> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async position => {
          try {
            // For the geolocation API, we need to determine the state
            // This is a simplified approach - in a real app you might want to use a reverse geocoding service
            const events = await this.getNearbyEvents({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              state: 'Unknown', // This would need to be determined via reverse geocoding
              includeElectronicGenreInd: true,
            });
            resolve(events);
          } catch (error) {
            reject(error);
          }
        },
        _error => {
          reject(new Error('Unable to retrieve your location'));
        },
        {
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
          enableHighAccuracy: false,
        }
      );
    });
  }

  // Helper method to categorize events by genre based on artist names and event names
  categorizeEventsByGenre(events: EdmtrainEvent[]): Record<string, EdmtrainEvent[]> {
    const genres: Record<string, EdmtrainEvent[]> = {
      All: events,
      House: [],
      Techno: [],
      Trance: [],
      Dubstep: [],
      'Drum & Bass': [],
      Progressive: [],
      Other: [],
    };

    events.forEach(event => {
      const eventText =
        `${event.name || ''} ${event.artists.map(a => a.name).join(' ')}`.toLowerCase();

      let categorized = false;

      // House music keywords
      if (
        eventText.includes('house') ||
        eventText.includes('deep') ||
        eventText.includes('progressive house')
      ) {
        genres['House'].push(event);
        categorized = true;
      }

      // Techno keywords
      if (
        eventText.includes('techno') ||
        eventText.includes('industrial') ||
        eventText.includes('minimal')
      ) {
        genres['Techno'].push(event);
        categorized = true;
      }

      // Trance keywords
      if (
        eventText.includes('trance') ||
        eventText.includes('uplifting') ||
        eventText.includes('psytrance')
      ) {
        genres['Trance'].push(event);
        categorized = true;
      }

      // Dubstep/Bass keywords
      if (
        eventText.includes('dubstep') ||
        eventText.includes('bass') ||
        eventText.includes('trap')
      ) {
        genres['Dubstep'].push(event);
        categorized = true;
      }

      // Drum & Bass keywords
      if (eventText.includes('drum') || eventText.includes('dnb') || eventText.includes('jungle')) {
        genres['Drum & Bass'].push(event);
        categorized = true;
      }

      // Progressive keywords
      if (eventText.includes('progressive') && !categorized) {
        genres['Progressive'].push(event);
        categorized = true;
      }

      // If not categorized, put in Other
      if (!categorized) {
        genres['Other'].push(event);
      }
    });

    return genres;
  }

  // Clear cache method
  clearCache(): void {
    this.cache.clear();
  }
}

export const edmtrainService = new EdmtrainService();
