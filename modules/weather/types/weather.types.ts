// modules/weather/types/weather.type.ts

// modules/weather/types/weather.types.ts

export interface WeatherData {
  time?: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
}

export interface WeatherForecast {
  hour: string;
  temp: number;
  condition: string;
}

export interface WeatherAPIResponse {
  current: WeatherData;
  location: string;
  updatedAt: string;
  forecast?: WeatherForecast[];
}

// Untuk komponen (dengan forecast)
export interface WeatherAPIResponse extends WeatherData {
  forecast?: WeatherForecast[];
}

export type DisasterRisk = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Menghitung risiko banjir berdasarkan data cuaca
 */
export function calculateFloodRisk(weather: Partial<WeatherData>): DisasterRisk {
  if (!weather) return 'LOW';
  
  if (weather.humidity && weather.condition) {
    if (weather.humidity > 90 && weather.condition.toLowerCase().includes('hujan')) {
      return 'HIGH';
    }
    if (weather.humidity > 80) {
      return 'MEDIUM';
    }
  }
  return 'LOW';
}

/**
 * Menghitung risiko tanah longsor berdasarkan data cuaca
 */
export function calculateLandslideRisk(weather: Partial<WeatherData>): DisasterRisk {
  if (!weather) return 'LOW';
  
  const condition = weather.condition?.toLowerCase() || "";
  const windSpeed = weather.windSpeed || 0;
  
  if (condition.includes('hujan lebat') && windSpeed > 20) {
    return 'HIGH';
  }
  if (condition.includes('hujan')) {
    return 'MEDIUM';
  }
  return 'LOW';
}