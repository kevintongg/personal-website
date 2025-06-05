import { useEffect, useState } from 'react';
import { edmtrainService } from '../../lib/edmtrain/edmtrainService';
import type { EdmtrainLocation } from '../../lib/edmtrain/types';
import { Button } from '../ui/button';

interface LocationSelectorProps {
  onLocationSelect: (location: EdmtrainLocation | 'current' | null) => void;
  selectedLocation: EdmtrainLocation | 'current' | null;
  loading?: boolean;
}

export function LocationSelector({
  onLocationSelect,
  selectedLocation,
  loading,
}: LocationSelectorProps) {
  const [popularLocations, setPopularLocations] = useState<EdmtrainLocation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<EdmtrainLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPopularLocations();
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchLocations(searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadPopularLocations = async () => {
    try {
      setLoadingLocations(true);
      setError(null);
      const locations = await edmtrainService.getPopularLocations();
      setPopularLocations(locations.slice(0, 10)); // Show top 10 popular locations
    } catch (err) {
      setError('Failed to load popular locations');
      console.error('Error loading popular locations:', err);
    } finally {
      setLoadingLocations(false);
    }
  };

  const searchLocations = async (query: string) => {
    try {
      setIsSearching(true);
      setError(null);

      // Try searching by city name
      const results = await edmtrainService.getLocations({ city: query });
      setSearchResults(results.slice(0, 8)); // Limit results
    } catch (err) {
      console.error('Error searching locations:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationClick = (location: EdmtrainLocation | 'current') => {
    onLocationSelect(location);
    setSearchQuery('');
    setSearchResults([]);
  };

  const getLocationDisplayName = (location: EdmtrainLocation) => {
    return `${location.city}, ${location.stateCode || location.state}`;
  };

  const isLocationSelected = (location: EdmtrainLocation | 'current') => {
    if (location === 'current' && selectedLocation === 'current') {
      return true;
    }
    if (typeof location === 'object' && typeof selectedLocation === 'object' && selectedLocation) {
      return location.id === selectedLocation.id;
    }
    return false;
  };

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Select Location
        </h3>

        {/* Current Location Button */}
        <div className="mb-4">
          <Button
            onClick={() => handleLocationClick('current')}
            variant={selectedLocation === 'current' ? 'default' : 'outline'}
            disabled={loading}
            className="mr-2 mb-2"
          >
            <span className="mr-2">📍</span>
            Use Current Location
          </Button>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            disabled={loading}
          />
          {isSearching && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Searching...</div>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Search Results:
            </h4>
            <div className="flex flex-wrap gap-2">
              {searchResults.map(location => (
                <Button
                  key={location.id}
                  onClick={() => handleLocationClick(location)}
                  variant={isLocationSelected(location) ? 'default' : 'outline'}
                  size="sm"
                  disabled={loading}
                >
                  {getLocationDisplayName(location)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Locations */}
        {!searchQuery && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Popular Cities:
            </h4>

            {loadingLocations ? (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Loading popular locations...
              </div>
            ) : error ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                {error}
                <Button variant="ghost" size="sm" onClick={loadPopularLocations} className="ml-2">
                  Retry
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {popularLocations.map(location => (
                  <Button
                    key={location.id}
                    onClick={() => handleLocationClick(location)}
                    variant={isLocationSelected(location) ? 'default' : 'outline'}
                    size="sm"
                    disabled={loading}
                  >
                    {getLocationDisplayName(location)}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium text-blue-700 dark:text-blue-300">Selected: </span>
                <span className="text-blue-600 dark:text-blue-400">
                  {selectedLocation === 'current'
                    ? 'Current Location'
                    : getLocationDisplayName(selectedLocation)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLocationSelect(null)}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
