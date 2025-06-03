import type { CurrentWeather } from '../../lib/weather/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface WindSunCardProps {
  currentWeather: CurrentWeather;
  convertWindSpeed: (speed: number) => number;
  windUnit: 'kmh' | 'mph';
  getWindDirection: (degrees: number) => string;
  timeFormat?: '12h' | '24h';
}

export default function WindSunCard({
  currentWeather,
  convertWindSpeed,
  windUnit,
  getWindDirection,
  timeFormat = '12h',
}: WindSunCardProps) {
  // Enhanced time formatting for sunrise/sunset with proper timezone handling
  const formatExactTime = (timestamp: number) => {
    // OpenWeather API returns Unix timestamps in UTC
    // The timezone field contains the UTC offset in seconds for the location

    if (currentWeather.timezone && typeof currentWeather.timezone === 'number') {
      // Create date from UTC timestamp and apply the location's timezone offset
      const utcTime = timestamp * 1000; // Convert to milliseconds
      const locationTime = utcTime + currentWeather.timezone * 1000; // Apply offset
      const locationDate = new Date(locationTime);

      return locationDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: timeFormat === '12h',
        timeZone: 'UTC', // We've already applied the offset, so use UTC to avoid double conversion
      });
    }

    // Fallback: if timezone is a string identifier, use it directly
    if (
      currentWeather.timezone &&
      typeof currentWeather.timezone === 'string' &&
      currentWeather.timezone.includes('/')
    ) {
      const date = new Date(timestamp * 1000);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: timeFormat === '12h',
        timeZone: currentWeather.timezone,
      });
    }

    // Final fallback to local browser time
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: timeFormat === '12h',
    });
  };

  // Calculate daylight duration
  const calculateDaylightDuration = () => {
    const daylightSeconds = currentWeather.sunset - currentWeather.sunrise;
    const hours = Math.floor(daylightSeconds / 3600);
    const minutes = Math.floor((daylightSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Check if it's currently day or night (using location's time)
  const isCurrentlyDay = () => {
    const now = Date.now() / 1000;
    return now >= currentWeather.sunrise && now <= currentWeather.sunset;
  };

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center justify-center gap-1 text-center text-sm sm:gap-2 sm:text-base">
          <span>🌬️ Wind & ☀️ Sun</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Wind Information */}
        <div className="space-y-1 sm:space-y-2">
          <h4 className="text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">Wind</h4>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Speed</span>
            <span className="text-sm font-medium">
              {convertWindSpeed(currentWeather.windSpeed)} {windUnit}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Direction</span>
            <span className="text-sm font-medium">
              {getWindDirection(currentWeather.windDirection)}
            </span>
          </div>
        </div>

        {/* Sun Information */}
        <div className="space-y-1 sm:space-y-2">
          <h4 className="text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
            Sun Times
          </h4>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              🌅 <span className="hidden sm:inline">Sunrise</span>
            </span>
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
              {formatExactTime(currentWeather.sunrise)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              🌇 <span className="hidden sm:inline">Sunset</span>
            </span>
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
              {formatExactTime(currentWeather.sunset)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-1 dark:border-gray-700">
            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              ⏱️ <span className="hidden sm:inline">Daylight</span>
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {calculateDaylightDuration()}
            </span>
          </div>

          {/* Current day/night indicator */}
          <div className="pt-1 text-center sm:pt-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                isCurrentlyDay()
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
              }`}
            >
              {isCurrentlyDay() ? '☀️ Day' : '🌙 Night'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
