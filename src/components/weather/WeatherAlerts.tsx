import { WeatherAlert } from '../../lib/weather/types';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

export default function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  if (alerts.length === 0) return null;

  const getSeverityColor = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'extreme':
        return 'bg-red-100 border-red-500 text-red-900 dark:bg-red-900/20 dark:border-red-500 dark:text-red-200';
      case 'severe':
        return 'bg-orange-100 border-orange-500 text-orange-900 dark:bg-orange-900/20 dark:border-orange-500 dark:text-orange-200';
      case 'moderate':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-500 dark:text-yellow-200';
      case 'minor':
        return 'bg-blue-100 border-blue-500 text-blue-900 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-200';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-900 dark:bg-gray-900/20 dark:border-gray-500 dark:text-gray-200';
    }
  };

  const getSeverityIcon = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'extreme':
        return '🚨';
      case 'severe':
        return '⚠️';
      case 'moderate':
        return '⚡';
      case 'minor':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 text-center">
          🚨 Weather Alerts
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {alerts.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map(alert => (
          <Alert key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
            <div className="flex items-start gap-3">
              <span className="mt-1 text-xl">{getSeverityIcon(alert.severity)}</span>
              <div className="min-w-0 flex-1">
                <AlertTitle className="mb-2 flex items-center gap-2">
                  <span className="font-semibold">{alert.event}</span>
                  <span className="bg-opacity-20 inline-flex items-center rounded-full bg-current px-2 py-1 text-xs font-medium">
                    {alert.severity.toUpperCase()}
                  </span>
                </AlertTitle>
                <AlertDescription className="mb-3 text-sm">{alert.description}</AlertDescription>
                <div className="grid grid-cols-1 gap-2 text-xs opacity-75 sm:grid-cols-2">
                  <div>
                    <strong>Starts:</strong> {formatDateTime(alert.start)}
                  </div>
                  <div>
                    <strong>Ends:</strong> {formatDateTime(alert.end)}
                  </div>
                  {alert.areas.length > 0 && (
                    <div className="sm:col-span-2">
                      <strong>Areas:</strong> {alert.areas.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
