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
    <Card className="sm:col-span-2 lg:col-span-1">
      <CardHeader className="pb-2 sm:pb-6">
        <CardTitle className="text-center text-base sm:text-lg">
          {currentWeather.location}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="mb-2 flex items-center justify-center gap-2 sm:gap-3">
            <span className="text-3xl sm:text-4xl">
              {getWeatherIcon(currentWeather.icon, currentWeather.description)}
            </span>
            <div className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-gray-100">
              {convertTemperature(currentWeather.temperature)}°
              {temperatureUnit === 'celsius' ? 'C' : 'F'}
            </div>
          </div>
          <div className="mb-2 text-base text-gray-600 capitalize sm:text-lg dark:text-gray-400">
            {currentWeather.description}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            Feels like {convertTemperature(currentWeather.feelsLike)}°
            {temperatureUnit === 'celsius' ? 'C' : 'F'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
