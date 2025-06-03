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
  WeatherRecommendation
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
      '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️',
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
        (position) => {
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
              temperatureThresholds: { high: 30, low: 0 }
            },
            addedAt: Date.now(),
            lastAccessed: Date.now()
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
              temperatureThresholds: { high: 30, low: 0 }
            },
            addedAt: Date.now(),
            lastAccessed: Date.now()
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
          temperatureThresholds: { high: 30, low: 0 }
        },
        addedAt: Date.now(),
        lastAccessed: Date.now()
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
      setSavedLocations(prev => prev.map(loc =>
        loc.id === location.id
          ? { ...loc, lastAccessed: Date.now() }
          : loc
      ));
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
      return Math.round((temp * 9/5) + 32);
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

  useEffect(() => {
    getCurrentLocation();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur dark:bg-gray-950/95 dark:border-gray-800">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-6xl">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                ← Back to Portfolio
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Weather Dashboard</span>
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
        <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur dark:bg-gray-950/95 dark:border-gray-800">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-6xl">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                ← Back to Portfolio
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Weather Dashboard</span>
            </div>
            <DarkModeToggle />
          </div>
        </nav>

        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 text-6xl">🌩️</div>
              <p className="text-lg text-red-600 dark:text-red-400 mb-4">{error}</p>
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
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur dark:bg-gray-950/95 dark:border-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-6xl">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              ← Back to Portfolio
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Weather Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleTemperatureUnit} className="text-xs">
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
      </nav>

      <div className="container mx-auto max-w-6xl px-4 py-8">
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
            {/* Current Weather Grid */}
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
              {airQuality && (
                <AirQualityCard airQuality={airQuality} />
              )}
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
        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>Cache size: {weatherService.getCacheSize()} entries</p>
          <p>Data refreshes automatically every 10 minutes</p>
        </div>
      </div>
    </div>
  );
}
