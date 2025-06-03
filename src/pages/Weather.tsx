import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { DarkModeToggle } from '../components/ui/dark-mode-toggle';
import AirQualityCard from '../components/weather/AirQualityCard';
import CurrentWeatherCard from '../components/weather/CurrentWeatherCard';
import DailyForecast from '../components/weather/DailyForecast';
import HourlyForecast from '../components/weather/HourlyForecast';
import LocationSearch from '../components/weather/LocationSearch';
import WeatherAlerts from '../components/weather/WeatherAlerts';
import WeatherDetailsCard from '../components/weather/WeatherDetailsCard';
import WeatherRecommendations from '../components/weather/WeatherRecommendations';
import WindSunCard from '../components/weather/WindSunCard';
import type {
  AirQuality,
  CurrentWeather,
  DailyForecastItem,
  HourlyForecastItem,
  SavedLocation,
  TemperatureUnit,
  WeatherAlert,
  WeatherRecommendation,
} from '../lib/weather/types';
import { weatherService } from '../lib/weather/weatherService';

export function Weather() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastItem[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecastItem[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
  const [recommendations, setRecommendations] = useState<WeatherRecommendation[]>([]);
  const [currentLocation, setCurrentLocation] = useState<SavedLocation | null>(null);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>(() => {
    const saved = localStorage.getItem('weather-temp-unit');
    return (saved as TemperatureUnit) || 'celsius';
  });
  const [windUnit, setWindUnit] = useState<'kmh' | 'mph'>(() => {
    const saved = localStorage.getItem('weather-wind-unit');
    return (saved as 'kmh' | 'mph') || 'kmh';
  });
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>(() => {
    const saved = localStorage.getItem('weather-time-format');
    return (saved as '12h' | '24h') || '12h';
  });

  // Load saved locations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('weather-saved-locations');
    if (saved) {
      try {
        setSavedLocations(JSON.parse(saved));
      } catch {
        // Error loading saved locations
      }
    }
  }, []);

  // Save locations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('weather-saved-locations', JSON.stringify(savedLocations));
  }, [savedLocations]);

  const getWeatherIcon = (iconCode: string, _description: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️',
    };
    return iconMap[iconCode] || '🌤️';
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);

      const data = await weatherService.fetchWeatherData(lat, lon);

      setCurrentWeather(data.current);
      setHourlyForecast(data.hourly);
      setDailyForecast(data.daily);
      setWeatherAlerts(data.alerts);
      setAirQuality(data.airQuality);

      // Generate recommendations if we have weather data
      if (data.current && data.hourly.length > 0) {
        const recs = weatherService.generateRecommendations(data.current, data.hourly);
        setRecommendations(recs);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const location: SavedLocation = {
            id: 'current_location',
            name: 'Current Location',
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            country: '',
            isDefault: false,
            isCurrent: true,
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
          };
          setCurrentLocation(location);
          fetchWeatherData(location.lat, location.lon);
        },
        () => {
          // Fallback to Vancouver
          const fallback: SavedLocation = {
            id: 'fallback_vancouver',
            name: 'Vancouver',
            lat: 49.2827,
            lon: -123.1207,
            country: 'CA',
            isDefault: true,
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
          };
          setCurrentLocation(fallback);
          fetchWeatherData(fallback.lat, fallback.lon);
        }
      );
    } else {
      // Fallback to Vancouver
      const fallback: SavedLocation = {
        id: 'fallback_vancouver',
        name: 'Vancouver',
        lat: 49.2827,
        lon: -123.1207,
        country: 'CA',
        isDefault: true,
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
      };
      setCurrentLocation(fallback);
      fetchWeatherData(fallback.lat, fallback.lon);
    }
  };

  const handleLocationSelect = (location: SavedLocation) => {
    setCurrentLocation(location);
    fetchWeatherData(location.lat, location.lon);

    // Update last accessed time for saved locations
    if (savedLocations.some(loc => loc.id === location.id)) {
      setSavedLocations(prev =>
        prev.map(loc => (loc.id === location.id ? { ...loc, lastAccessed: Date.now() } : loc))
      );
    }
  };

  const handleLocationSave = (location: SavedLocation) => {
    setSavedLocations(prev => [...prev, location]);
  };

  const handleLocationRemove = (locationId: string) => {
    setSavedLocations(prev => prev.filter(loc => loc.id !== locationId));

    // If the removed location was the current one, switch to current location
    if (currentLocation?.id === locationId) {
      getCurrentLocation();
    }
  };

  const toggleTemperatureUnit = () => {
    const newUnit = temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    setTemperatureUnit(newUnit);
    localStorage.setItem('weather-temp-unit', newUnit);
  };

  const toggleWindUnit = () => {
    const newUnit = windUnit === 'kmh' ? 'mph' : 'kmh';
    setWindUnit(newUnit);
    localStorage.setItem('weather-wind-unit', newUnit);
  };

  const toggleTimeFormat = () => {
    const newFormat = timeFormat === '12h' ? '24h' : '12h';
    setTimeFormat(newFormat);
    localStorage.setItem('weather-time-format', newFormat);
  };

  const convertTemperature = (temp: number) => {
    if (temperatureUnit === 'fahrenheit') {
      return Math.round((temp * 9) / 5 + 32);
    }
    return temp;
  };

  const convertWindSpeed = (speed: number) => {
    if (windUnit === 'mph') {
      return Math.round(speed * 2.237); // m/s to mph
    }
    return Math.round(speed * 3.6); // m/s to km/h
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: timeFormat === '12h',
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
  };

  const handleRefresh = () => {
    weatherService.clearCache();

    if (currentLocation) {
      fetchWeatherData(currentLocation.lat, currentLocation.lon);
    } else {
      getCurrentLocation();
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('[data-mobile-menu]') && !target.closest('[data-hamburger]')) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200/60 bg-white/95 backdrop-blur dark:border-gray-800/60 dark:bg-gray-950/95">
          <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                ← Back
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900 md:text-xl dark:text-gray-100">
                Weather Dashboard
              </span>
            </div>
            <DarkModeToggle />
          </div>
        </nav>

        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 text-6xl">🌤️</div>
              <p className="text-lg text-gray-600 dark:text-gray-400">Loading weather data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200/60 bg-white/95 backdrop-blur dark:border-gray-800/60 dark:bg-gray-950/95">
          <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                ← Back
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900 md:text-xl dark:text-gray-100">
                Weather Dashboard
              </span>
            </div>
            <DarkModeToggle />
          </div>
        </nav>

        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 text-6xl">🌩️</div>
              <p className="mb-4 text-lg text-red-600 dark:text-red-400">{error}</p>
              <Button onClick={getCurrentLocation}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-[60] w-full border-b border-gray-200/60 bg-white/95 backdrop-blur dark:border-gray-800/60 dark:bg-gray-950/95">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex flex-1 items-center space-x-2">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <span className="hidden sm:inline">← Back</span>
              <span className="sm:hidden">←</span>
            </Button>
          </div>

          <div className="flex items-center justify-center">
            <span className="text-center text-lg font-bold text-gray-900 sm:text-xl dark:text-gray-100">
              Weather Dashboard
            </span>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2">
            {/* Mobile: Hamburger menu */}
            <div className="flex items-center gap-2 sm:hidden">
              <DarkModeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                data-hamburger
              >
                <div className="space-y-1">
                  <div className="h-0.5 w-4 bg-gray-600 dark:bg-gray-400"></div>
                  <div className="h-0.5 w-4 bg-gray-600 dark:bg-gray-400"></div>
                  <div className="h-0.5 w-4 bg-gray-600 dark:bg-gray-400"></div>
                </div>
              </Button>
            </div>

            {/* Desktop: Show all controls */}
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTemperatureUnit}
                className="text-xs"
              >
                {temperatureUnit === 'celsius' ? '°F' : '°C'}
              </Button>
              <Button variant="outline" size="sm" onClick={toggleWindUnit} className="text-xs">
                {windUnit === 'kmh' ? 'mph' : 'km/h'}
              </Button>
              <Button variant="outline" size="sm" onClick={toggleTimeFormat} className="text-xs">
                {timeFormat === '12h' ? '24H' : '12H'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="text-xs">
                🔄
              </Button>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Outside navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={closeMobileMenu}></div>
          <div
            className="fixed top-0 right-0 h-full w-64 border-l border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
            data-mobile-menu
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Settings</h3>
              <button
                onClick={closeMobileMenu}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Menu Content */}
            <div className="p-4">
              {/* Temperature Unit */}
              <div className="mb-6">
                <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Temperature Unit
                </div>
                <button
                  onClick={() => {
                    toggleTemperatureUnit();
                  }}
                  className="flex h-12 w-full items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-4 text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  <span>Temperature</span>
                  <span className="text-sm">{temperatureUnit === 'celsius' ? '°C' : '°F'}</span>
                </button>
              </div>

              {/* Wind Speed Unit */}
              <div className="mb-6">
                <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Wind Speed Unit
                </div>
                <button
                  onClick={() => {
                    toggleWindUnit();
                  }}
                  className="flex h-12 w-full items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-4 text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  <span>Wind Speed</span>
                  <span className="text-sm">{windUnit}</span>
                </button>
              </div>

              {/* Time Format */}
              <div className="mb-6">
                <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Time Format
                </div>
                <button
                  onClick={() => {
                    toggleTimeFormat();
                  }}
                  className="flex h-12 w-full items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-4 text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  <span>Time Format</span>
                  <span className="text-sm">{timeFormat === '12h' ? '12H' : '24H'}</span>
                </button>
              </div>

              {/* Actions */}
              <div className="mb-6">
                <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </div>
                <button
                  onClick={() => {
                    handleRefresh();
                    closeMobileMenu();
                  }}
                  className="flex h-12 w-full items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-4 text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  <span>Refresh Data</span>
                  <span>🔄</span>
                </button>
              </div>

              {/* Theme Toggle - for consistency with portfolio */}
              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Theme
                  </span>
                  <DarkModeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-4 sm:py-8">
        {/* Location Search and Management */}
        <LocationSearch
          currentLocation={currentLocation}
          savedLocations={savedLocations}
          onLocationSelect={handleLocationSelect}
          onLocationSave={handleLocationSave}
          onLocationRemove={handleLocationRemove}
          onCurrentLocationRequest={getCurrentLocation}
        />

        {/* Weather Alerts */}
        <WeatherAlerts alerts={weatherAlerts} />

        {/* Smart Recommendations */}
        <WeatherRecommendations recommendations={recommendations} />

        {currentWeather && (
          <>
            {/* Current Weather Grid - Improved mobile responsiveness */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              <CurrentWeatherCard
                currentWeather={currentWeather}
                getWeatherIcon={getWeatherIcon}
                convertTemperature={convertTemperature}
                temperatureUnit={temperatureUnit}
              />

              <WeatherDetailsCard currentWeather={currentWeather} />

              <WindSunCard
                currentWeather={currentWeather}
                convertWindSpeed={convertWindSpeed}
                windUnit={windUnit}
                getWindDirection={getWindDirection}
                timeFormat={timeFormat}
              />

              {/* Air Quality Card */}
              {airQuality && <AirQualityCard airQuality={airQuality} />}
            </div>

            {/* Hourly Forecast */}
            {hourlyForecast.length > 0 && (
              <HourlyForecast
                hourlyForecast={hourlyForecast.slice(0, 24)} // Show 24 hours
                getWeatherIcon={getWeatherIcon}
                convertTemperature={convertTemperature}
                temperatureUnit={temperatureUnit}
                formatTime={formatTime}
                timeFormat={timeFormat}
              />
            )}

            {/* Daily Forecast */}
            {dailyForecast.length > 0 && (
              <DailyForecast
                dailyForecast={dailyForecast}
                getWeatherIcon={getWeatherIcon}
                convertTemperature={convertTemperature}
                temperatureUnit={temperatureUnit}
                formatDate={formatDate}
              />
            )}
          </>
        )}

        {/* Footer with Cache Info */}
        <div className="mt-6 text-center text-xs text-gray-500 sm:mt-8 dark:text-gray-400">
          <p>Cache size: {weatherService.getCacheSize()} entries</p>
          <p>Data refreshes automatically every 10 minutes</p>
        </div>
      </div>
    </div>
  );
}
