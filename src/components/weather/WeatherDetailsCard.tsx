import type { CurrentWeather } from '../../lib/weather/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface WeatherDetailsCardProps {
  currentWeather: CurrentWeather;
}

export default function WeatherDetailsCard({ currentWeather }: WeatherDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Humidity</span>
          <span>{currentWeather.humidity}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Pressure</span>
          <span>{currentWeather.pressure} hPa</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Visibility</span>
          <span>{currentWeather.visibility} km</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">UV Index</span>
          <span>{currentWeather.uvIndex}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Cloudiness</span>
          <span>{currentWeather.cloudiness}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
