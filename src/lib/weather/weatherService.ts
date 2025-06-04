import type {
  AirQuality,
  CachedWeatherData,
  CurrentWeather,
  DailyForecastItem,
  HourlyForecastItem,
  SavedLocation,
  WeatherAlert,
  WeatherDataSource,
  WeatherRecommendation,
  WeatherTrend,
} from './types';

class WeatherService {
  private cache: Map<string, CachedWeatherData> = new Map();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  private readonly API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  private dataSources: WeatherDataSource[] = [
    {
      name: 'OpenWeatherMap',
      enabled: true,
      priority: 1,
      apiKey: this.API_KEY,
      endpoints: {
        current: 'https://api.openweathermap.org/data/3.0/onecall', // Primary: OneCall 3.0
        forecast: 'https://api.openweathermap.org/data/3.0/onecall',
        alerts: 'https://api.openweathermap.org/data/3.0/onecall',
        airQuality: 'https://api.openweathermap.org/data/2.5/air_pollution', // Keep 2.5 (free)
        historical: 'https://api.openweathermap.org/data/3.0/onecall/timemachine',
      },
      rateLimit: { requests: 1000, period: 86400 }, // 1000 calls per day (24 hours)
      reliability: 0.95,
    },
  ];

  // Enhanced weather icon mapping with fallbacks
  private getWeatherIcon = (iconCode: string, description: string): string => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️',
    };

    if (iconMap[iconCode]) return iconMap[iconCode];

    // Fallback based on description
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('rain')) return '🌧️';
    if (lowerDesc.includes('drizzle')) return '🌦️';
    if (lowerDesc.includes('snow')) return '❄️';
    if (lowerDesc.includes('cloud')) return '☁️';
    if (lowerDesc.includes('clear')) return iconCode.includes('n') ? '🌙' : '☀️';
    if (lowerDesc.includes('storm') || lowerDesc.includes('thunder')) return '⛈️';
    if (lowerDesc.includes('fog') || lowerDesc.includes('mist')) return '🌫️';

    return '🌤️';
  };

  // Cache management
  private getCacheKey(lat: number, lon: number, type: string): string {
    return `${lat.toFixed(4)}_${lon.toFixed(4)}_${type}`;
  }

  private isDataCached(key: string): boolean {
    const cached = this.cache.get(key);
    return cached ? cached.expiresAt > Date.now() : false;
  }

  private getCachedData(key: string): CachedWeatherData | null {
    if (this.isDataCached(key)) {
      return this.cache.get(key) || null;
    }
    return null;
  }

  private setCachedData(key: string, data: Partial<CachedWeatherData>): void {
    const existing = this.cache.get(key) || {
      locationId: key,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_DURATION,
      source: 'OpenWeatherMap',
    };

    this.cache.set(key, {
      ...existing,
      ...data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_DURATION,
    });
  }

  // Calculate derived weather metrics
  private calculateDewPoint(temp: number, humidity: number): number {
    const a = 17.27;
    const b = 237.7;
    const alpha = (a * temp) / (b + temp) + Math.log(humidity / 100);
    return (b * alpha) / (a - alpha);
  }

  private calculateHeatIndex(temp: number, humidity: number): number {
    if (temp < 27) return temp; // Heat index not applicable below 80°F/27°C

    const T = temp;
    const R = humidity;

    const HI =
      -8.78469475556 +
      1.61139411 * T +
      2.33854883889 * R +
      -0.14611605 * T * R +
      -0.012308094 * T * T +
      -0.0164248277778 * R * R +
      0.002211732 * T * T * R +
      0.00072546 * T * R * R +
      -0.000003582 * T * T * R * R;

    return Math.round(HI);
  }

  private determinePrecipitationType(temp: number): 'rain' | 'snow' | 'sleet' {
    if (temp <= 0) return 'snow';
    if (temp <= 2) return 'sleet';
    return 'rain';
  }

  // Fetch comprehensive weather data using OneCall 3.0 API
  async fetchWeatherData(
    lat: number,
    lon: number
  ): Promise<{
    current: CurrentWeather | null;
    hourly: HourlyForecastItem[];
    daily: DailyForecastItem[];
    alerts: WeatherAlert[];
    airQuality: AirQuality | null;
  }> {
    const cacheKey = this.getCacheKey(lat, lon, 'comprehensive');
    const cached = this.getCachedData(cacheKey);

    if (cached && cached.current && cached.hourly && cached.daily) {
      return {
        current: cached.current,
        hourly: cached.hourly,
        daily: cached.daily,
        alerts: cached.alerts || [],
        airQuality: cached.airQuality || null,
      };
    }

    if (!this.API_KEY) {
      throw new Error('Weather API key not configured');
    }

    // Use OneCall 3.0 API for comprehensive weather data
    return this.fetchOneCallWeatherData(lat, lon);
  }

  // Fetch data using OneCall 3.0 API
  private async fetchOneCallWeatherData(
    lat: number,
    lon: number
  ): Promise<{
    current: CurrentWeather | null;
    hourly: HourlyForecastItem[];
    daily: DailyForecastItem[];
    alerts: WeatherAlert[];
    airQuality: AirQuality | null;
  }> {
    try {
      // OneCall 3.0 API call
      const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${this.API_KEY}`;
      const oneCallResponse = await fetch(oneCallUrl);

      if (!oneCallResponse.ok) {
        throw new Error(`OneCall API error: ${oneCallResponse.status}`);
      }

      const oneCallData = await oneCallResponse.json();

      // Fetch air quality separately (still available in free tier)
      const airQuality = await this.fetchAirQuality(lat, lon);

      // Get location name for the current weather
      const locationName = await this.getLocationName(lat, lon);

      // Process current weather
      const current: CurrentWeather = {
        location: locationName,
        country: '', // Will be set in getLocationName result
        temperature: Math.round(oneCallData.current.temp),
        feelsLike: Math.round(oneCallData.current.feels_like),
        humidity: oneCallData.current.humidity,
        pressure: oneCallData.current.pressure,
        visibility: oneCallData.current.visibility / 1000, // Convert m to km
        uvIndex: oneCallData.current.uvi || 0, // Now we have UV index!
        description: oneCallData.current.weather[0].description,
        icon: this.getWeatherIcon(
          oneCallData.current.weather[0].icon,
          oneCallData.current.weather[0].description
        ),
        dewPoint: Math.round(oneCallData.current.dew_point),
        cloudiness: oneCallData.current.clouds,
        // Store wind speed in m/s and convert for display later
        windSpeed: oneCallData.current.wind_speed,
        windDirection: oneCallData.current.wind_deg || 0,
        windGust: oneCallData.current.wind_gust || undefined,
        sunrise: oneCallData.current.sunrise,
        sunset: oneCallData.current.sunset,
        timezone: oneCallData.timezone,
      };

      // Process hourly forecast (48 hours available in OneCall 3.0)
      const hourly: HourlyForecastItem[] = oneCallData.hourly.slice(0, 24).map((hour: any) => ({
        time: hour.dt,
        temperature: Math.round(hour.temp),
        feelsLike: Math.round(hour.feels_like),
        humidity: hour.humidity,
        pressure: hour.pressure,
        uvIndex: hour.uvi || 0, // UV index available in hourly too!
        description: hour.weather[0].description,
        icon: this.getWeatherIcon(hour.weather[0].icon, hour.weather[0].description),
        // Wind speed returned in m/s
        windSpeed: hour.wind_speed,
        windDirection: hour.wind_deg || 0,
        cloudiness: hour.clouds,
        precipitation: hour.rain ? hour.rain['1h'] || 0 : hour.snow ? hour.snow['1h'] || 0 : 0,
        precipitationType: this.determinePrecipitationType(hour.temp),
        visibility: hour.visibility ? hour.visibility / 1000 : 10,
      }));

      // Process daily forecast (8 days available in OneCall 3.0)
      const daily: DailyForecastItem[] = oneCallData.daily.slice(0, 7).map((day: any) => ({
        date: day.dt,
        description: day.summary || day.weather[0].description,
        icon: this.getWeatherIcon(day.weather[0].icon, day.weather[0].description),
        tempMin: Math.round(day.temp.min),
        tempMax: Math.round(day.temp.max),
        tempMorn: Math.round(day.temp.morn),
        tempDay: Math.round(day.temp.day),
        tempEve: Math.round(day.temp.eve),
        tempNight: Math.round(day.temp.night),
        humidity: day.humidity,
        pressure: day.pressure,
        uvIndex: day.uvi || 0, // UV index for daily forecast too!
        // Wind speed returned in m/s
        windSpeed: day.wind_speed,
        windDirection: day.wind_deg || 0,
        cloudiness: day.clouds,
        precipitation: day.rain || day.snow || 0,
        precipitationType: this.determinePrecipitationType(day.temp.day),
        sunrise: day.sunrise,
        sunset: day.sunset,
        moonPhase: day.moon_phase,
      }));

      // Process weather alerts
      const alerts: WeatherAlert[] = (oneCallData.alerts || []).map(
        (alert: any, index: number) => ({
          id: `alert_${index}_${alert.start}`,
          event: alert.event,
          description: alert.description,
          severity: this.mapAlertSeverity(alert.event),
          start: alert.start,
          end: alert.end,
          areas: alert.tags || [],
          tags: alert.tags || [],
        })
      );

      // Cache the data
      const cacheKey = this.getCacheKey(lat, lon, 'comprehensive');
      this.setCachedData(cacheKey, {
        current,
        hourly,
        daily,
        alerts,
        airQuality: airQuality || undefined,
      });

      return {
        current,
        hourly,
        daily,
        alerts,
        airQuality,
      };
    } catch {
      // Fallback to basic weather data if OneCall fails
      return this.fetchBasicWeatherData(lat, lon);
    }
  }

  // Fetch air quality data
  async fetchAirQuality(lat: number, lon: number): Promise<AirQuality | null> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`
      );

      if (!response.ok) return null;

      const data = await response.json();
      const components = data.list[0].components;
      const aqi = data.list[0].main.aqi;

      const qualityMap = {
        1: 'good',
        2: 'fair',
        3: 'moderate',
        4: 'poor',
        5: 'very_poor',
      } as const;

      const healthRecommendations = this.getHealthRecommendations(aqi);

      return {
        aqi,
        co: components.co,
        no2: components.no2,
        o3: components.o3,
        pm2_5: components.pm2_5,
        pm10: components.pm10,
        so2: components.so2,
        nh3: components.nh3,
        quality: qualityMap[aqi as keyof typeof qualityMap] || 'moderate',
        healthRecommendations,
      };
    } catch {
      // Error fetching air quality data
      return null;
    }
  }

  // Fetch basic weather data (fallback)
  private async fetchBasicWeatherData(
    lat: number,
    lon: number
  ): Promise<{
    current: CurrentWeather | null;
    hourly: HourlyForecastItem[];
    daily: DailyForecastItem[];
    alerts: WeatherAlert[];
    airQuality: AirQuality | null;
  }> {
    try {
      // Fetch current weather and 5-day forecast in parallel
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
        ),
      ]);

      if (!currentResponse.ok) {
        throw new Error(`Current weather API error: ${currentResponse.status}`);
      }

      const currentData = await currentResponse.json();

      // Process current weather
      const current: CurrentWeather = {
        location: currentData.name,
        country: currentData.sys.country,
        temperature: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        windSpeed: currentData.wind.speed,
        windDirection: currentData.wind.deg || 0,
        windGust: currentData.wind.gust,
        visibility: currentData.visibility / 1000,
        uvIndex: 0, // Not available in basic weather API
        cloudiness: currentData.clouds.all,
        dewPoint: this.calculateDewPoint(currentData.main.temp, currentData.main.humidity),
        heatIndex: this.calculateHeatIndex(currentData.main.temp, currentData.main.humidity),
        icon: currentData.weather[0].icon,
        sunrise: currentData.sys.sunrise,
        sunset: currentData.sys.sunset,
        timezone: currentData.timezone, // UTC offset in seconds
      };

      let hourly: HourlyForecastItem[] = [];
      let daily: DailyForecastItem[] = [];

      // Process 5-day forecast if available (fallback when OneCall API fails)
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();

        // Convert 3-hour forecast to hourly (limited data)
        hourly = forecastData.list.slice(0, 16).map((item: any) => ({
          time: item.dt,
          temperature: Math.round(item.main.temp),
          feelsLike: Math.round(item.main.feels_like),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          precipitation: (item.pop || 0) * 100,
          precipitationType: this.determinePrecipitationType(item.main.temp),
          windSpeed: item.wind.speed,
          windDirection: item.wind.deg || 0,
          pressure: item.main.pressure,
          humidity: item.main.humidity,
          uvIndex: 0, // Not available in basic forecast API
          cloudiness: item.clouds.all,
          visibility: item.visibility ? item.visibility / 1000 : 10,
        }));

        // Group forecast by day for daily forecast
        const dailyMap = new Map<string, any[]>();
        forecastData.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000).toDateString();
          if (!dailyMap.has(date)) {
            dailyMap.set(date, []);
          }
          dailyMap.get(date)!.push(item);
        });

        // Create daily forecast from grouped data
        // Note: Basic forecast API provides ~5 days of data in 3-hour intervals
        // We'll process all available days to maximize the forecast length
        const allDays = Array.from(dailyMap.entries());

        // Skip today if we're past midday, otherwise include it
        const now = new Date();
        const startIndex = now.getHours() >= 15 ? 1 : 0; // Skip today if after 3 PM

        daily = allDays.slice(startIndex).map(([_date, items]) => {
          const temps = items.map(item => item.main.temp);
          const maxTemp = Math.max(...temps);
          const minTemp = Math.min(...temps);
          const midday =
            items.find(item => {
              const hour = new Date(item.dt * 1000).getHours();
              return hour >= 12 && hour <= 15;
            }) || items[Math.floor(items.length / 2)];

          return {
            date: items[0].dt,
            tempMax: Math.round(maxTemp),
            tempMin: Math.round(minTemp),
            tempMorn: Math.round(items[0]?.main.temp || minTemp),
            tempDay: Math.round(midday.main.temp),
            tempEve: Math.round(items[items.length - 1]?.main.temp || maxTemp),
            tempNight: Math.round(minTemp),
            description: midday.weather[0].description,
            icon: midday.weather[0].icon,
            humidity: midday.main.humidity,
            precipitation: Math.max(...items.map(item => (item.pop || 0) * 100)),
            precipitationType: this.determinePrecipitationType(midday.main.temp),
            windSpeed: midday.wind.speed,
            windDirection: midday.wind.deg || 0,
            pressure: midday.main.pressure,
            uvIndex: 0, // Not available in basic forecast API
            cloudiness: midday.clouds.all,
            sunrise: 0, // Would need additional API call
            sunset: 0, // Would need additional API call
            moonPhase: 0, // Not available in basic forecast API
          };
        });
      }

      // Try to fetch air quality (available in basic tier)
      let airQuality: AirQuality | null = null;
      try {
        airQuality = await this.fetchAirQuality(lat, lon);
      } catch {
        // Air quality data not available
      }

      // Cache the results
      const cacheKey = this.getCacheKey(lat, lon, 'comprehensive');
      this.setCachedData(cacheKey, {
        current,
        hourly,
        daily,
        alerts: [], // No alerts in basic API
        airQuality: airQuality || undefined,
      });

      return {
        current,
        hourly,
        daily,
        alerts: [], // Weather alerts not available in basic API
        airQuality,
      };
    } catch {
      // Error fetching basic weather data
      return {
        current: null,
        hourly: [],
        daily: [],
        alerts: [],
        airQuality: null,
      };
    }
  }

  // Get location name from coordinates
  private async getLocationName(lat: number, lon: number): Promise<string> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.API_KEY}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          return `${data[0].name}, ${data[0].country}`;
        }
      }
    } catch {
      // Error fetching location name
    }

    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  }

  // Generate weather recommendations
  generateRecommendations(
    current: CurrentWeather,
    hourly: HourlyForecastItem[]
  ): WeatherRecommendation[] {
    const recommendations: WeatherRecommendation[] = [];
    const temp = current.temperature;
    // const humidity = current.humidity; // Available for future use
    const uvIndex = current.uvIndex;
    const precipitation = hourly.slice(0, 12).some(h => h.precipitation > 30);

    // Clothing recommendations
    if (temp < 0) {
      recommendations.push({
        id: 'clothing_cold',
        category: 'clothing',
        title: 'Bundle Up!',
        suggestion: 'Wear heavy winter clothes, gloves, and a warm hat. Layer up!',
        reason: `It's ${temp}°C - very cold conditions`,
        confidence: 0.9,
        icon: '🧥',
        timeRelevant: true,
      });
    } else if (temp < 10) {
      recommendations.push({
        id: 'clothing_cool',
        category: 'clothing',
        title: 'Dress Warmly',
        suggestion: 'Wear a jacket or coat. Consider layers for comfort.',
        reason: `Cool temperature of ${temp}°C`,
        confidence: 0.8,
        icon: '🧥',
        timeRelevant: true,
      });
    } else if (temp > 30) {
      recommendations.push({
        id: 'clothing_hot',
        category: 'clothing',
        title: 'Stay Cool',
        suggestion: 'Wear light, breathable clothing. Choose light colors.',
        reason: `Hot temperature of ${temp}°C`,
        confidence: 0.9,
        icon: '👕',
        timeRelevant: true,
      });
    }

    // Rain recommendations
    if (precipitation) {
      recommendations.push({
        id: 'rain_alert',
        category: 'activity',
        title: 'Rain Expected',
        suggestion: 'Bring an umbrella or raincoat. Plan indoor activities.',
        reason: 'High chance of rain in the next 12 hours',
        confidence: 0.8,
        icon: '☔',
        timeRelevant: true,
        validUntil: Date.now() + 12 * 60 * 60 * 1000,
      });
    }

    // UV recommendations
    if (uvIndex >= 8) {
      recommendations.push({
        id: 'uv_high',
        category: 'health',
        title: 'High UV Alert',
        suggestion: 'Use SPF 30+ sunscreen. Wear sunglasses and a hat. Seek shade.',
        reason: `Very high UV index of ${uvIndex}`,
        confidence: 0.95,
        icon: '☀️',
        timeRelevant: true,
      });
    } else if (uvIndex >= 6) {
      recommendations.push({
        id: 'uv_moderate',
        category: 'health',
        title: 'UV Protection',
        suggestion: 'Use sunscreen and wear sunglasses during peak hours.',
        reason: `Moderate to high UV index of ${uvIndex}`,
        confidence: 0.8,
        icon: '🕶️',
        timeRelevant: true,
      });
    }

    // Activity recommendations
    if (temp >= 15 && temp <= 25 && !precipitation && current.windSpeed < 5) {
      recommendations.push({
        id: 'perfect_weather',
        category: 'activity',
        title: 'Perfect Weather!',
        suggestion: 'Great day for outdoor activities like hiking, cycling, or picnics.',
        reason: 'Ideal temperature and low wind with no rain expected',
        confidence: 0.9,
        icon: '🌞',
        timeRelevant: true,
      });
    }

    return recommendations;
  }

  // Map alert severity
  private mapAlertSeverity(event: string): 'minor' | 'moderate' | 'severe' | 'extreme' {
    const severe = ['tornado', 'hurricane', 'flood', 'blizzard'];
    const moderate = ['thunderstorm', 'wind', 'snow', 'ice'];

    const lowerEvent = event.toLowerCase();

    if (severe.some(s => lowerEvent.includes(s))) return 'severe';
    if (moderate.some(m => lowerEvent.includes(m))) return 'moderate';
    return 'minor';
  }

  // Get health recommendations based on air quality
  private getHealthRecommendations(aqi: number): string[] {
    switch (aqi) {
      case 1:
        return ['Air quality is good. Great day for outdoor activities!'];
      case 2:
        return ['Air quality is fair. Sensitive individuals should be cautious.'];
      case 3:
        return [
          'Moderate air quality. Consider reducing outdoor exercise.',
          'Sensitive groups should limit prolonged outdoor activities.',
        ];
      case 4:
        return [
          'Poor air quality. Limit outdoor activities.',
          'Use air purifiers indoors.',
          'Sensitive individuals should stay indoors.',
        ];
      case 5:
        return [
          'Very poor air quality. Avoid outdoor activities.',
          'Keep windows closed.',
          'Use air purifiers and masks when going outside.',
          'Vulnerable populations should stay indoors.',
        ];
      default:
        return ['Monitor air quality conditions.'];
    }
  }

  // Search locations
  async searchLocations(query: string): Promise<SavedLocation[]> {
    try {
      if (!this.API_KEY) {
        return [];
      }

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${this.API_KEY}`
      );

      if (!response.ok) return [];

      const data = await response.json();

      return data.map((location: any, index: number) => ({
        id: `search_${index}_${Date.now()}`,
        name: location.name,
        lat: location.lat,
        lon: location.lon,
        country: location.country,
        state: location.state,
        isDefault: false,
        isCurrent: false,
        notifications: {
          enabled: false,
          rainAlerts: false,
          temperatureAlerts: false,
          severeWeatherAlerts: false,
          dailySummary: false,
          temperatureThresholds: { high: 30, low: 0 },
        },
        addedAt: Date.now(),
        lastAccessed: Date.now(),
      }));
    } catch {
      // Error searching locations
      return [];
    }
  }

  // Get weather trends
  async getWeatherTrends(_lat: number, _lon: number): Promise<WeatherTrend[]> {
    // This would require historical data API calls
    // For now, return mock trends based on current conditions
    return [
      {
        metric: 'temperature',
        trend: 'stable',
        change: 0.5,
        period: '24h',
        significance: 'low',
      },
    ];
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache size
  getCacheSize(): number {
    return this.cache.size;
  }
}

export const weatherService = new WeatherService();
