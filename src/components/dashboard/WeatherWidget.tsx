import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

type TemperatureUnit = 'celsius' | 'fahrenheit';
type WindUnit = 'kmh' | 'mph';

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>(() => {
    const saved = localStorage.getItem('weather-temp-unit');
    return (saved as TemperatureUnit) || 'celsius';
  });
  const [windUnit, setWindUnit] = useState<WindUnit>(() => {
    const saved = localStorage.getItem('weather-wind-unit');
    return (saved as WindUnit) || 'kmh';
  });

  // Enhanced fallback icon mappings for different weather conditions
  const getWeatherIcon = (iconCode: string, description: string) => {
    const lowerDesc = description.toLowerCase();

    // Map OpenWeather icon codes to appropriate weather symbols
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', // clear sky day
      '01n': '🌙', // clear sky night
      '02d': '⛅', // few clouds day
      '02n': '☁️', // few clouds night
      '03d': '☁️', // scattered clouds
      '03n': '☁️', // scattered clouds
      '04d': '☁️', // broken clouds
      '04n': '☁️', // broken clouds
      '09d': '🌧️', // shower rain
      '09n': '🌧️', // shower rain
      '10d': '🌦️', // rain day
      '10n': '🌧️', // rain night
      '11d': '⛈️', // thunderstorm
      '11n': '⛈️', // thunderstorm
      '13d': '❄️', // snow
      '13n': '❄️', // snow
      '50d': '🌫️', // mist
      '50n': '🌫️', // mist
    };

    // Try exact icon code match first
    if (iconMap[iconCode]) {
      return iconMap[iconCode];
    }

    // Fallback based on description
    if (lowerDesc.includes('rain')) return '🌧️';
    if (lowerDesc.includes('drizzle')) return '🌦️';
    if (lowerDesc.includes('snow')) return '❄️';
    if (lowerDesc.includes('cloud')) return '☁️';
    if (lowerDesc.includes('clear')) return iconCode.includes('n') ? '🌙' : '☀️';
    if (lowerDesc.includes('storm') || lowerDesc.includes('thunder')) return '⛈️';
    if (lowerDesc.includes('fog') || lowerDesc.includes('mist') || lowerDesc.includes('haze'))
      return '🌫️';
    if (lowerDesc.includes('wind')) return '💨';

    return '🌤️'; // default partly cloudy
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo-key';
      // Always fetch in metric from API, then convert as needed for display
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather data unavailable');
      }

      const data = await response.json();

      // Store raw metric values and convert for display
      const tempCelsius = Math.round(data.main.temp);
      const windMps = data.wind.speed; // m/s from API

      setWeather({
        location: `${data.name}, ${data.sys.country}`,
        temperature: tempCelsius,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: windMps,
        icon: data.weather[0].icon,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Fallback to a default location (Vancouver, Canada as example)
          fetchWeather(49.2827, -123.1207);
        }
      );
    } else {
      fetchWeather(49.2827, -123.1207);
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

  const getDisplayTemperature = () => {
    if (!weather) return '';
    if (temperatureUnit === 'fahrenheit') {
      return Math.round((weather.temperature * 9) / 5 + 32) + '°F';
    }
    return weather.temperature + '°C';
  };

  const getDisplayWindSpeed = () => {
    if (!weather) return '';
    if (windUnit === 'mph') {
      // Convert m/s to mph: m/s * 2.237
      return Math.round(weather.windSpeed * 2.237) + ' mph';
    }
    // Convert m/s to km/h: m/s * 3.6
    return Math.round(weather.windSpeed * 3.6) + ' km/h';
  };

  useEffect(() => {
    getLocation();
  }, []); // Only fetch once, conversion happens in display functions

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 15h4l3-8 4 8h4" />
              </svg>
              Weather
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTemperatureUnit}
                className="px-2 text-xs"
              >
                {temperatureUnit === 'celsius' ? '°F' : '°C'}
              </Button>
              <Button variant="outline" size="sm" onClick={toggleWindUnit} className="px-2 text-xs">
                {windUnit === 'kmh' ? 'mph' : 'km/h'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600 dark:border-blue-400"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 15h4l3-8 4 8h4" />
              </svg>
              Weather
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTemperatureUnit}
                className="px-2 text-xs"
              >
                {temperatureUnit === 'celsius' ? '°F' : '°C'}
              </Button>
              <Button variant="outline" size="sm" onClick={toggleWindUnit} className="px-2 text-xs">
                {windUnit === 'kmh' ? 'mph' : 'km/h'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>{error}</p>
            <Button variant="outline" size="sm" onClick={getLocation} className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 15h4l3-8 4 8h4" />
            </svg>
            Weather
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTemperatureUnit}
              className="px-2 text-xs"
            >
              {temperatureUnit === 'celsius' ? '°F' : '°C'}
            </Button>
            <Button variant="outline" size="sm" onClick={toggleWindUnit} className="px-2 text-xs">
              {windUnit === 'kmh' ? 'mph' : 'km/h'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {weather && (
          <>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <div
                  className="flex h-12 w-12 items-center justify-center text-3xl"
                  title={`Weather: ${weather.description} (Icon: ${weather.icon})`}
                >
                  {getWeatherIcon(weather.icon, weather.description)}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {getDisplayTemperature()}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600 capitalize dark:text-gray-400">
                {weather.description}
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {weather.location}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t pt-4 dark:border-gray-700">
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">Humidity</div>
                <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                  {weather.humidity}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">Wind</div>
                <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                  {getDisplayWindSpeed()}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
