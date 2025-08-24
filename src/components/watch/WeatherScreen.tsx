import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, ArrowLeft } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface WeatherScreenProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

const WeatherScreen = ({ onNavigate }: WeatherScreenProps) => {
  const [currentWeather, setCurrentWeather] = useState({
    temp: 24,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    uvIndex: 6
  });

  const [forecast, setForecast] = useState([
    { time: '12PM', temp: 26, icon: Sun, condition: 'Sunny' },
    { time: '3PM', temp: 28, icon: Cloud, condition: 'Cloudy' },
    { time: '6PM', temp: 23, icon: CloudRain, condition: 'Rain' },
    { time: '9PM', temp: 20, icon: Cloud, condition: 'Cloudy' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate weather updates
      setCurrentWeather(prev => ({
        ...prev,
        temp: prev.temp + (Math.random() - 0.5) * 2,
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 10)),
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 5)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = () => {
    const conditions = [Sun, Cloud, CloudRain];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  const WeatherIcon = getWeatherIcon();

  return (
    <div className="relative flex flex-col items-center justify-start h-full">
      {/* Fixed Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-transparent backdrop-blur-sm">
        <div className="text-center py-5 watch-slide-up">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('features')}
            className="absolute left-[78px] top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0 glass-bg hover:bg-white/15 z-20 "
          >
            <ArrowLeft size={14} className="text-white" />
          </Button>
          <h2 className="text-lg font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            Weather
          </h2>
          <div className="text-xs text-white/60">Current Conditions</div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="watch-content-safe flex flex-col items-center w-full watch-scroll overflow-y-auto pt-24 pb-4 px-4">
      {/* Current Weather */}
      <div className="glass-bg p-4 rounded-2xl text-center mb-4 w-full max-w-[200px] watch-glow ">
        <WeatherIcon size={32} className="text-feature-weather mx-auto mb-2" />
        <div className="text-2xl font-bold text-white mb-1">
          {Math.round(currentWeather.temp)}°C
        </div>
        <div className="text-sm text-white/70 mb-3">
          {currentWeather.condition}
        </div>
        
        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <Droplets size={10} className="text-blue-400" />
            <span className="text-white/60">{Math.round(currentWeather.humidity)}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <Wind size={10} className="text-green-400" />
            <span className="text-white/60">{Math.round(currentWeather.windSpeed)}km/h</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye size={10} className="text-purple-400" />
            <span className="text-white/60">{currentWeather.visibility}km</span>
          </div>
          <div className="flex items-center space-x-1">
            <Thermometer size={10} className="text-orange-400" />
            <span className="text-white/60">UV {currentWeather.uvIndex}</span>
          </div>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="w-full max-w-[220px] mb-4 pb-8">
        <div className="text-sm text-white/80 mb-2 text-center">Today's Forecast</div>
        <div className="flex justify-between space-x-1">
          {forecast.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.time}
                className="glass-bg p-2 rounded-lg text-center flex-1 watch-glow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-xs text-white/60 mb-1">{item.time}</div>
                <Icon size={12} className="text-white mx-auto mb-1" />
                <div className="text-xs font-semibold text-white">
                  {item.temp}°
                </div>
              </div>
            );
          })}
        </div>
      </div>

     </div>
    </div>
  );
};

export default WeatherScreen;