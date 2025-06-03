import type { WeatherRecommendation } from '../../lib/weather/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface WeatherRecommendationsProps {
  recommendations: WeatherRecommendation[];
}

export default function WeatherRecommendations({ recommendations }: WeatherRecommendationsProps) {
  if (recommendations.length === 0) return null;

  const getCategoryColor = (category: WeatherRecommendation['category']) => {
    switch (category) {
      case 'clothing':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'activity':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'health':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'travel':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'gardening':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: WeatherRecommendation['category']) => {
    switch (category) {
      case 'clothing':
        return '👔';
      case 'activity':
        return '🏃';
      case 'health':
        return '🏥';
      case 'travel':
        return '✈️';
      case 'gardening':
        return '🌱';
      default:
        return '💡';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatValidUntil = (validUntil?: number) => {
    if (!validUntil) return null;

    const now = Date.now();
    const diffHours = Math.round((validUntil - now) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Valid for less than 1 hour';
    if (diffHours < 24) return `Valid for ${diffHours} hours`;

    const diffDays = Math.round(diffHours / 24);
    return `Valid for ${diffDays} days`;
  };

  // Group recommendations by category
  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    if (!acc[rec.category]) {
      acc[rec.category] = [];
    }
    acc[rec.category].push(rec);
    return acc;
  }, {} as Record<string, WeatherRecommendation[]>);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 text-center">
          💡 Smart Recommendations
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full">
            {recommendations.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedRecommendations).map(([category, recs]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getCategoryIcon(category as WeatherRecommendation['category'])}</span>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                {category}
              </h3>
            </div>
            <div className="space-y-3">
              {recs.map((rec) => (
                <div
                  key={rec.id}
                  className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{rec.icon}</span>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {rec.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(rec.category)}`}>
                        {rec.category}
                      </span>
                      {rec.timeRelevant && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                          Time Sensitive
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {rec.suggestion}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>{rec.reason}</span>
                    <div className="flex items-center gap-3">
                      <span className={`font-medium ${getConfidenceColor(rec.confidence)}`}>
                        {Math.round(rec.confidence * 100)}% confident
                      </span>
                      {rec.validUntil && (
                        <span className="text-orange-600 dark:text-orange-400">
                          {formatValidUntil(rec.validUntil)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
