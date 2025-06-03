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
    return quality.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatPollutant = (value: number, unit: string = 'μg/m³') => {
    return `${value.toFixed(1)} ${unit}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🌪️ Air Quality
          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getAQIColor(airQuality.aqi)}`}>
            {getAQIIcon(airQuality.quality)}
            {getQualityLabel(airQuality.quality)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AQI Score */}
        <div className="text-center">
          <div className={`text-3xl font-bold mb-1 ${getAQIColor(airQuality.aqi)}`}>
            {airQuality.aqi}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Air Quality Index
          </div>
        </div>

        {/* Pollutant Levels */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Pollutant Levels
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">PM2.5</span>
              <span>{formatPollutant(airQuality.pm2_5)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">PM10</span>
              <span>{formatPollutant(airQuality.pm10)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">NO₂</span>
              <span>{formatPollutant(airQuality.no2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">O₃</span>
              <span>{formatPollutant(airQuality.o3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">CO</span>
              <span>{formatPollutant(airQuality.co)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">SO₂</span>
              <span>{formatPollutant(airQuality.so2)}</span>
            </div>
          </div>
        </div>

        {/* Health Recommendations */}
        {airQuality.healthRecommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Health Recommendations
            </h4>
            <div className="space-y-1">
              {airQuality.healthRecommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1"
                >
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
