import type { CurrentWeather } from '../../lib/weather/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface CurrentWeatherCardProps {
  currentWeather: CurrentWeather;
  getWeatherIcon: (iconCode: string, description: string) => string;
  convertTemperature: (temp: number) => number;
  temperatureUnit: 'celsius' | 'fahrenheit';
}

export default function CurrentWeatherCard({
  currentWeather,
  getWeatherIcon,
  convertTemperature,
  temperatureUnit,
}: CurrentWeatherCardProps) {
  return (
    <Card className="md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{currentWeather.location}</span>
          <span className="text-2xl">{getWeatherIcon(currentWeather.icon, currentWeather.description)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {convertTemperature(currentWeather.temperature)}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
          </div>
          <div className="text-lg text-gray-600 dark:text-gray-400 mb-2 capitalize">
            {currentWeather.description}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            Feels like {convertTemperature(currentWeather.feelsLike)}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
