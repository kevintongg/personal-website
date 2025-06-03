import { AirQuality } from '../../lib/weather/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface AirQualityCardProps {
  airQuality: AirQuality;
}

export default function AirQualityCard({ airQuality }: AirQualityCardProps) {
  const getAQIColor = (aqi: number) => {
    switch (aqi) {
      case 1:
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 2:
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 3:
        return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 4:
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 5:
        return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getAQIIcon = (quality: string) => {
    switch (quality) {
      case 'good':
        return '😊';
      case 'fair':
        return '🙂';
      case 'moderate':
        return '😐';
      case 'poor':
        return '😷';
      case 'very_poor':
        return '🤢';
      default:
        return '🌪️';
    }
  };

  const getQualityLabel = (quality: string) => {
    return quality
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatPollutant = (value: number, unit: string = 'μg/m³') => {
    return `${value.toFixed(1)} ${unit}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex flex-col items-center justify-center gap-1 text-center sm:flex-row sm:gap-2">
          <span className="text-sm sm:text-base">🌪️ Air Quality</span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getAQIColor(airQuality.aqi)}`}
          >
            {getAQIIcon(airQuality.quality)}
            <span className="hidden sm:inline">{getQualityLabel(airQuality.quality)}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* AQI Score */}
        <div className="text-center">
          <div className={`mb-1 text-2xl font-bold sm:text-3xl ${getAQIColor(airQuality.aqi)}`}>
            {airQuality.aqi}
          </div>
          <div className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
            Air Quality Index
          </div>
        </div>

        {/* Pollutant Levels */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-900 sm:text-sm dark:text-gray-100">
            Pollutant Levels
          </h4>
          <div className="grid grid-cols-2 gap-1 text-xs sm:gap-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">PM2.5</span>
              <span className="text-xs">{formatPollutant(airQuality.pm2_5)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">PM10</span>
              <span className="text-xs">{formatPollutant(airQuality.pm10)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">NO₂</span>
              <span className="text-xs">{formatPollutant(airQuality.no2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">O₃</span>
              <span className="text-xs">{formatPollutant(airQuality.o3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">CO</span>
              <span className="text-xs">{formatPollutant(airQuality.co)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">SO₂</span>
              <span className="text-xs">{formatPollutant(airQuality.so2)}</span>
            </div>
          </div>
        </div>

        {/* Health Recommendations */}
        {airQuality.healthRecommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-900 sm:text-sm dark:text-gray-100">
              Health Tips
            </h4>
            <div className="space-y-1">
              {airQuality.healthRecommendations.slice(0, 2).map((recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start gap-1 text-xs text-gray-600 dark:text-gray-400"
                >
                  <span className="mt-1 flex-shrink-0 text-blue-500">•</span>
                  <span className="leading-tight">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
