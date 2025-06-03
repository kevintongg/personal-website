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
      <CardHeader>
        <div className="text-center">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {getForecastTitle()}
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {getForecastSubtitle()}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {dailyForecast.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📅</div>
            <p>No daily forecast data available</p>
            <p className="text-sm mt-1">This may be due to API limitations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dailyForecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getWeatherIcon(day.icon, day.description)}</span>
                  <div>
                    <div className="font-medium">{formatDate(day.date)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {day.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {convertTemperature(day.tempMax)}° / {convertTemperature(day.tempMin)}°
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
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
