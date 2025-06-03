// Core weather data types
export interface CurrentWeather {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  pressure: number;
  pressureTrend?: 'rising' | 'falling' | 'steady';
  windSpeed: number;
  windDirection: number;
  windGust?: number;
  visibility: number;
  uvIndex: number;
  cloudiness: number;
  dewPoint: number;
  heatIndex?: number;
  icon: string;
  sunrise: number;
  sunset: number;
  moonPhase?: number;
  timezone: string | number; // Can be timezone identifier (e.g., "Asia/Tokyo") or UTC offset in seconds
}

export interface HourlyForecastItem {
  time: number;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  precipitation: number;
  precipitationType?: 'rain' | 'snow' | 'sleet';
  windSpeed: number;
  windDirection: number;
  pressure: number;
  humidity: number;
  uvIndex: number;
  cloudiness: number;
  visibility: number;
}

export interface DailyForecastItem {
  date: number;
  tempMax: number;
  tempMin: number;
  tempMorn: number;
  tempDay: number;
  tempEve: number;
  tempNight: number;
  description: string;
  icon: string;
  humidity: number;
  precipitation: number;
  precipitationType?: 'rain' | 'snow' | 'sleet';
  windSpeed: number;
  windDirection: number;
  pressure: number;
  uvIndex: number;
  cloudiness: number;
  sunrise: number;
  sunset: number;
  moonPhase: number;
}

// Weather alerts and warnings
export interface WeatherAlert {
  id: string;
  event: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  start: number;
  end: number;
  areas: string[];
  tags: string[];
}

// Air quality data
export interface AirQuality {
  aqi: number;
  co: number;
  no2: number;
  o3: number;
  pm2_5: number;
  pm10: number;
  so2: number;
  nh3: number;
  quality: 'good' | 'fair' | 'moderate' | 'poor' | 'very_poor';
  healthRecommendations: string[];
}

// Location management
export interface SavedLocation {
  id: string;
  name: string;
  nickname?: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  isDefault: boolean;
  isCurrent: boolean;
  notifications: LocationNotificationSettings;
  addedAt: number;
  lastAccessed: number;
}

export interface LocationNotificationSettings {
  enabled: boolean;
  rainAlerts: boolean;
  temperatureAlerts: boolean;
  severeWeatherAlerts: boolean;
  dailySummary: boolean;
  temperatureThresholds: {
    high: number;
    low: number;
  };
}

// Weather notifications
export interface WeatherNotification {
  id: string;
  type: 'rain' | 'temperature' | 'severe' | 'daily' | 'air_quality';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  locationId: string;
  timestamp: number;
  read: boolean;
  actionable: boolean;
  action?: {
    label: string;
    type: 'open_location' | 'view_alerts' | 'dismiss';
  };
}

// Smart recommendations
export interface WeatherRecommendation {
  id: string;
  category: 'clothing' | 'activity' | 'health' | 'travel' | 'gardening';
  title: string;
  suggestion: string;
  reason: string;
  confidence: number;
  icon: string;
  timeRelevant: boolean;
  validUntil?: number;
}

// Historical weather data
export interface HistoricalWeather {
  date: number;
  tempMax: number;
  tempMin: number;
  tempAvg: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

// Weather trends and analysis
export interface WeatherTrend {
  metric: 'temperature' | 'precipitation' | 'pressure' | 'humidity';
  trend: 'increasing' | 'decreasing' | 'stable';
  change: number;
  period: '24h' | '7d' | '30d';
  significance: 'low' | 'medium' | 'high';
}

// Weather maps and radar
export interface WeatherMapLayer {
  type: 'precipitation' | 'temperature' | 'clouds' | 'pressure' | 'wind';
  url: string;
  opacity: number;
  enabled: boolean;
  timestamp?: number;
  animated?: boolean;
}

// Export and sharing
export interface WeatherReport {
  id: string;
  title: string;
  locations: SavedLocation[];
  dateRange: {
    start: number;
    end: number;
  };
  includeForecasts: boolean;
  includeAlerts: boolean;
  includeRecommendations: boolean;
  format: 'pdf' | 'csv' | 'json';
  createdAt: number;
}

// Application preferences
export interface WeatherPreferences {
  temperatureUnit: 'celsius' | 'fahrenheit';
  windUnit: 'kmh' | 'mph' | 'ms' | 'knots';
  pressureUnit: 'hpa' | 'inhg' | 'mmhg';
  precipitationUnit: 'mm' | 'inches';
  timeFormat: '12h' | '24h';
  dateFormat: 'us' | 'eu' | 'iso';
  theme: 'auto' | 'light' | 'dark';
  animations: boolean;
  backgroundEffects: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // minutes
  defaultLocation?: string;
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    frequency: 'immediate' | 'hourly' | 'daily';
  };
  privacy: {
    shareLocation: boolean;
    analytics: boolean;
    crashReporting: boolean;
  };
}

// API data sources
export interface WeatherDataSource {
  name: string;
  enabled: boolean;
  priority: number;
  apiKey?: string;
  endpoints: {
    current: string;
    forecast: string;
    alerts?: string;
    airQuality?: string;
    historical?: string;
  };
  rateLimit: {
    requests: number;
    period: number; // seconds
  };
  reliability: number; // 0-1
}

// Cache management
export interface CachedWeatherData {
  locationId: string;
  current?: CurrentWeather;
  hourly?: HourlyForecastItem[];
  daily?: DailyForecastItem[];
  alerts?: WeatherAlert[];
  airQuality?: AirQuality;
  timestamp: number;
  expiresAt: number;
  source: string;
}

// Common utility types
export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindUnit = 'kmh' | 'mph' | 'ms' | 'knots';
export type PressureUnit = 'hpa' | 'inhg' | 'mmhg';
export type PrecipitationUnit = 'mm' | 'inches';
export type TimeRange = '24h' | '7d' | '30d' | '1y';
export type WeatherMetric = 'temperature' | 'precipitation' | 'pressure' | 'humidity' | 'wind' | 'uv';

// API response types
export interface WeatherAPIResponse {
  success: boolean;
  data?: any;
  error?: string;
  source: string;
  cached: boolean;
  timestamp: number;
}
