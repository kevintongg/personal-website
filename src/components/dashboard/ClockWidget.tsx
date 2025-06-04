import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function ClockWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(() => {
    // Load 24-hour preference from localStorage
    const saved = localStorage.getItem('clock-24hour');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Save 24-hour preference to localStorage
    localStorage.setItem('clock-24hour', JSON.stringify(is24Hour));
  }, [is24Hour]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: !is24Hour,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatUTCTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: !is24Hour,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTimezone = (timezone: string) => {
    // Remove underscores and format nicely
    return timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
  };

  const toggleTimeFormat = () => {
    setIs24Hour(!is24Hour);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            Current Time
          </div>
          <Button variant="outline" size="sm" onClick={toggleTimeFormat} className="text-xs">
            {is24Hour ? '12H' : '24H'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {formatTime(currentTime)}
          </div>
          <div className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {formatDate(currentTime)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t pt-4 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">UTC</div>
            <div className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatUTCTime(currentTime)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">Timezone</div>
            <div className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
