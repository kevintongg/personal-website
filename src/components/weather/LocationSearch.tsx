import { useEffect, useState } from 'react';
import type { SavedLocation } from '../../lib/weather/types';
import { weatherService } from '../../lib/weather/weatherService';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface LocationSearchProps {
  currentLocation: SavedLocation | null;
  savedLocations: SavedLocation[];
  onLocationSelect: (location: SavedLocation) => void;
  onLocationSave: (location: SavedLocation) => void;
  onLocationRemove: (locationId: string) => void;
  onCurrentLocationRequest: () => void;
}

export default function LocationSearch({
  currentLocation,
  savedLocations,
  onLocationSelect,
  onLocationSave,
  onLocationRemove,
  onCurrentLocationRequest,
}: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SavedLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await weatherService.searchLocations(searchQuery);
          setSearchResults(results);
        } catch {
          // Error searching locations
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const handleLocationSelect = (location: SavedLocation) => {
    onLocationSelect(location);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleLocationSave = (location: SavedLocation) => {
    const savedLocation = {
      ...location,
      id: `saved_${Date.now()}`,
      notifications: {
        enabled: true,
        rainAlerts: true,
        temperatureAlerts: false,
        severeWeatherAlerts: true,
        dailySummary: false,
        temperatureThresholds: { high: 30, low: 0 },
      },
    };
    onLocationSave(savedLocation);
  };

  const isLocationSaved = (lat: number, lon: number) => {
    return savedLocations.some(
      loc => Math.abs(loc.lat - lat) < 0.01 && Math.abs(loc.lon - lon) < 0.01
    );
  };

  const formatLocationDisplay = (location: SavedLocation) => {
    const parts = [location.name];
    if (location.state) parts.push(location.state);
    parts.push(location.country);
    return parts.join(', ');
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 text-center">
          <span>📍 Locations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Location Button */}
        <Button
          variant={currentLocation?.isCurrent ? 'default' : 'outline'}
          size="sm"
          onClick={onCurrentLocationRequest}
          className="w-full sm:w-auto"
        >
          📍 Current Location
        </Button>

        {/* Search Interface - Always Visible */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a city or location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
            {isSearching && (
              <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {searchResults.map(location => (
                <div
                  key={location.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formatLocationDisplay(location)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!isLocationSaved(location.lat, location.lon) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          handleLocationSave(location);
                        }}
                      >
                        💾 Save
                      </Button>
                    )}
                    <Button
                      variant="default"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        handleLocationSelect(location);
                      }}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">
              No locations found for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Saved Locations */}
        {savedLocations.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Saved Locations
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {savedLocations.map(location => (
                <div
                  key={location.id}
                  className={`group relative flex items-center justify-between rounded-lg border p-2 transition-colors ${
                    currentLocation?.id === location.id
                      ? 'border-blue-500 bg-blue-100 dark:border-blue-500 dark:bg-blue-900/30'
                      : 'hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLocationSelect(location)}
                    className="h-auto flex-1 justify-start p-0 text-left"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {location.nickname || location.name}
                      </p>
                      <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                        {location.country}
                      </p>
                    </div>
                  </Button>

                  {/* Remove button (visible on hover) */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLocationRemove(location.id)}
                    className="h-6 w-6 p-1 text-red-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-700"
                  >
                    ✕
                  </Button>

                  {/* Notification indicator */}
                  {location.notifications.enabled && (
                    <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Access Cities */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Popular Cities</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Vancouver', country: 'CA', lat: 49.2827, lon: -123.1207 },
              { name: 'Hong Kong', country: 'HK', lat: 22.3193, lon: 114.1694 },
              { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 },
              { name: 'New York', country: 'US', lat: 40.7128, lon: -74.006 },
              { name: 'Tokyo', country: 'JP', lat: 35.6858, lon: 139.7514 },
              { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
            ].map(city => (
              <Button
                key={`${city.name}-${city.country}`}
                variant={
                  currentLocation?.lat === city.lat && currentLocation?.lon === city.lon
                    ? 'default'
                    : 'outline'
                }
                size="sm"
                onClick={() =>
                  handleLocationSelect({
                    id: `quick_${city.name}_${city.country}`,
                    name: city.name,
                    lat: city.lat,
                    lon: city.lon,
                    country: city.country,
                    isDefault: false,
                    isCurrent: false,
                    notifications: {
                      enabled: false,
                      rainAlerts: false,
                      temperatureAlerts: false,
                      severeWeatherAlerts: false,
                      dailySummary: false,
                      temperatureThresholds: { high: 30, low: 0 },
                    },
                    addedAt: Date.now(),
                    lastAccessed: Date.now(),
                  })
                }
              >
                {city.name}, {city.country}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
