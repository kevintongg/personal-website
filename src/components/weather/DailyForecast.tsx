import type { DailyForecastItem } from '../../lib/weather/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface DailyForecastProps {
  dailyForecast: DailyForecastItem[];
  getWeatherIcon: (iconCode: string, description: string) => string;
  convertTemperature: (temp: number) => number;
  temperatureUnit: 'celsius' | 'fahrenheit';
  formatDate: (timestamp: number) => string;
}

export default function DailyForecast({
  dailyForecast,
  getWeatherIcon,
  convertTemperature,
  temperatureUnit: _temperatureUnit,
  formatDate,
}: DailyForecastProps) {
  // Generate dynamic title based on available days
  const getForecastTitle = () => {
    const dayCount = dailyForecast.length;
    if (dayCount === 0) return 'Daily Forecast';
    if (dayCount >= 7) return '7-Day Forecast';
    return `${dayCount}-Day Forecast`;
  };

  const getForecastSubtitle = () => {
    const dayCount = dailyForecast.length;
    if (dayCount === 0) return 'No forecast data available';
    if (dayCount >= 7) return 'Extended weather outlook';
    return `${dayCount} days available`;
  };

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <div className="text-center">
          <CardTitle className="mb-1 text-lg font-bold text-gray-900 sm:text-xl dark:text-gray-100">
            {getForecastTitle()}
          </CardTitle>
          <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            {getForecastSubtitle()}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {dailyForecast.length === 0 ? (
          <div className="py-6 text-center text-gray-500 sm:py-8 dark:text-gray-400">
            <div className="mb-2 text-3xl sm:text-4xl">📅</div>
            <p className="text-sm sm:text-base">No daily forecast data available</p>
            <p className="mt-1 text-xs sm:text-sm">This may be due to API limitations</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {dailyForecast.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-200 py-2 last:border-b-0 sm:py-2 dark:border-gray-700"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                  <span className="flex-shrink-0 text-xl sm:text-2xl">
                    {getWeatherIcon(day.icon, day.description)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium sm:text-base">
                      {formatDate(day.date)}
                    </div>
                    <div className="truncate text-xs text-gray-600 capitalize sm:text-sm dark:text-gray-400">
                      {day.description}
                    </div>
                  </div>
                </div>
                <div className="ml-2 flex-shrink-0 text-right">
                  <div className="text-sm font-medium sm:text-base">
                    {convertTemperature(day.tempMax)}° / {convertTemperature(day.tempMin)}°
                  </div>
                  <div className="text-xs text-blue-600 sm:text-sm dark:text-blue-400">
                    {day.precipitation}% rain
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
