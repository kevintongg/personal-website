import type { CurrentWeather } from '../../lib/weather/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface WeatherDetailsCardProps {
  currentWeather: CurrentWeather;
}

export default function WeatherDetailsCard({ currentWeather }: WeatherDetailsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-center text-base sm:text-lg">Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Humidity</span>
          <span className="text-sm font-medium">{currentWeather.humidity}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Pressure</span>
          <span className="text-sm font-medium">{currentWeather.pressure} hPa</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Visibility</span>
          <span className="text-sm font-medium">{currentWeather.visibility} km</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">UV Index</span>
          <span className="text-sm font-medium">{currentWeather.uvIndex}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Cloudiness</span>
          <span className="text-sm font-medium">{currentWeather.cloudiness}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
