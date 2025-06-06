import type { HourlyForecastItem } from '../../lib/weather/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface HourlyForecastProps {
  hourlyForecast: HourlyForecastItem[];
  getWeatherIcon: (iconCode: string, description: string) => string;
  convertTemperature: (temp: number) => number;
  temperatureUnit: 'celsius' | 'fahrenheit';
  formatTime: (timestamp: number) => string;
  timeFormat?: '12h' | '24h';
}

export default function HourlyForecast({
  hourlyForecast,
  getWeatherIcon,
  convertTemperature,
  temperatureUnit: _temperatureUnit,
  formatTime: _formatTime,
  timeFormat = '12h',
}: HourlyForecastProps) {
  const formatHourlyTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: timeFormat === '12h',
    });
  };

  const isNow = (timestamp: number) => {
    const now = new Date();
    const hourTime = new Date(timestamp * 1000);
    return Math.abs(now.getTime() - hourTime.getTime()) < 30 * 60 * 1000; // Within 30 minutes
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 text-center">
          <span>🕐</span>
          <span>24-Hour Forecast</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop/Tablet view */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-8 gap-3 lg:grid-cols-12">
            {hourlyForecast.map((hour, index) => (
              <div
                key={index}
                className={`flex flex-col items-center rounded-lg p-3 transition-colors ${
                  isNow(hour.time)
                    ? 'border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div
                  className={`mb-2 text-xs font-medium ${
                    isNow(hour.time)
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {isNow(hour.time) ? 'Now' : formatHourlyTime(hour.time)}
                </div>
                <div className="mb-2 text-2xl" title={hour.description}>
                  {getWeatherIcon(hour.icon, hour.description)}
                </div>
                <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {convertTemperature(hour.temperature)}°
                </div>
                {hour.precipitation > 0 && (
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {hour.precipitation}%
                  </div>
                )}
                {hour.uvIndex > 0 && (
                  <div className="mt-1 text-xs text-orange-600 dark:text-orange-400">
                    UV {hour.uvIndex}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile view */}
        <div className="block sm:hidden">
          <div className="space-y-3">
            {hourlyForecast.slice(0, 12).map((hour, index) => (
              <div
                key={index}
                className={`flex items-center justify-between rounded-lg p-3 ${
                  isNow(hour.time)
                    ? 'border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                    : 'bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                <div className="flex flex-1 items-center gap-3">
                  <div
                    className={`min-w-[60px] text-sm font-medium ${
                      isNow(hour.time)
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {isNow(hour.time) ? 'Now' : formatHourlyTime(hour.time)}
                  </div>
                  <div className="text-xl" title={hour.description}>
                    {getWeatherIcon(hour.icon, hour.description)}
                  </div>
                  <div className="flex-1 text-sm text-gray-600 capitalize dark:text-gray-400">
                    {hour.description}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {convertTemperature(hour.temperature)}°
                  </div>
                  {hour.precipitation > 0 && (
                    <div className="min-w-[35px] text-right text-sm text-blue-600 dark:text-blue-400">
                      {hour.precipitation}%
                    </div>
                  )}
                  {hour.uvIndex > 0 && (
                    <div className="min-w-[35px] text-right text-sm text-orange-600 dark:text-orange-400">
                      UV {hour.uvIndex}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
