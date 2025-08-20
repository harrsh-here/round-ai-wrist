
import React, { useState, useEffect } from 'react';
import { Battery, Wifi, Bluetooth, Phone } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface AnalogWatchProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

const AnalogWatch = ({ onNavigate }: AnalogWatchProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const secondAngle = (time.getSeconds() * 6) - 90;
  const minuteAngle = (time.getMinutes() * 6) - 90;
  const hourAngle = ((time.getHours() % 12) * 30 + time.getMinutes() * 0.5) - 90;

  const WatchHand = ({ angle, length, width, color, className = '' }: { 
    angle: number; 
    length: number; 
    width: number; 
    color: string;
    className?: string;
  }) => (
    <div
      className={`absolute origin-bottom ${className}`}
      style={{
        width: `${width}px`,
        height: `${length}px`,
        backgroundColor: color,
        left: '50%',
        top: '50%',
        transform: `translateX(-50%) translateY(-${length}px) rotate(${angle}deg)`,
        borderRadius: '2px',
        boxShadow: '0 0 10px rgba(0,0,0,0.8), 0 0 5px rgba(255,255,255,0.1)',
      }}
    />
  );

  return (
    <div 
      className="watch-content-safe cursor-pointer"
      onClick={() => onNavigate('home')}
    >
      {/* Status Bar */}
      <div className="watch-status-bar">
        <div className="flex items-center space-x-2">
          <div className="status-icon battery">
            <Battery size={10} />
            <span className="text-xs">85%</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Wifi size={8} className="text-primary" />
          <Bluetooth size={8} className="text-primary" />
          <Phone size={8} className="text-feature-call" />
        </div>
      </div>

      {/* Analog Clock Face - Full size with proper padding */}
      <div className="flex-1 relative rounded-full bg-gradient-to-br from-card via-background to-muted border border-primary/20 shadow-inner mx-4 my-2">
        
        {/* Hour Markers - Improved positioning and sizing */}
        <svg className="absolute inset-0 w-full h-full">
          {[...Array(12)].map((_, i) => {
            const angle = i * 30;
            const outerRadius = 48;
            const innerRadius = 42;
            
            const x1 = Math.cos((angle - 90) * Math.PI / 180) * outerRadius;
            const y1 = Math.sin((angle - 90) * Math.PI / 180) * outerRadius;
            const x2 = Math.cos((angle - 90) * Math.PI / 180) * innerRadius;
            const y2 = Math.sin((angle - 90) * Math.PI / 180) * innerRadius;
            
            return (
              <line
                key={i}
                x1={x1 + 50}
                y1={y1 + 50}
                x2={x2 + 50}
                y2={y2 + 50}
                stroke="hsl(var(--primary))"
                strokeWidth="2.5"
                className="drop-shadow-sm"
                style={{ transformOrigin: '50% 50%' }}
              />
            );
          })}
        </svg>

        {/* Minute Markers - Better distributed */}
        <svg className="absolute inset-0 w-full h-full">
          {[...Array(60)].map((_, i) => {
            if (i % 5 !== 0) {
              const angle = i * 6;
              const outerRadius = 49;
              const innerRadius = 46;
              
              const x1 = Math.cos((angle - 90) * Math.PI / 180) * outerRadius;
              const y1 = Math.sin((angle - 90) * Math.PI / 180) * outerRadius;
              const x2 = Math.cos((angle - 90) * Math.PI / 180) * innerRadius;
              const y2 = Math.sin((angle - 90) * Math.PI / 180) * innerRadius;
              
              return (
                <line
                  key={i}
                  x1={x1 + 50}
                  y1={y1 + 50}
                  x2={x2 + 50}
                  y2={y2 + 50}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="1"
                  opacity="0.6"
                />
              );
            }
            return null;
          })}
        </svg>

        {/* Hour Numbers - Perfect positioning */}
        {[...Array(12)].map((_, i) => {
          const hour = i === 0 ? 12 : i;
          const angle = (i * 30) - 90;
          const radius = 35;
          
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          
          return (
            <div
              key={hour}
              className="absolute text-white font-bold text-base"
              style={{
                left: `calc(50% + ${x * 2}px)`,
                top: `calc(50% + ${y * 2}px)`,
                transform: 'translate(-50%, -50%)',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              {hour}
            </div>
          );
        })}

        {/* Brand Position */}
        <div className="absolute top-[25%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-sm text-primary font-bold tracking-wider drop-shadow-md">FuzNex</div>
        </div>

        {/* Date Display */}
        <div className="absolute top-[45%] right-[20%] transform translate-x-1/2 -translate-y-1/2">
          <div className="bg-white text-black px-2 py-1 rounded text-xs font-bold border border-primary/30 shadow-lg">
            {time.getDate().toString().padStart(2, '0')}
          </div>
        </div>

        {/* Digital Time at Bottom */}
        <div className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="text-center">
            <div className="text-base font-mono font-bold text-primary">
              {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-primary/70">
              {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Clock Hands - Properly sized and positioned */}
        <WatchHand 
          angle={hourAngle} 
          length={25} 
          width={4} 
          color="hsl(var(--foreground))" 
          className="z-30 shadow-lg"
        />
        <WatchHand 
          angle={minuteAngle} 
          length={35} 
          width={2.5} 
          color="hsl(var(--foreground))" 
          className="z-20 shadow-lg"
        />
        <WatchHand 
          angle={secondAngle} 
          length={38} 
          width={1} 
          color="hsl(0 85% 60%)" 
          className="z-10 shadow-md"
        />

        {/* Center assembly - Enhanced design */}
        <div className="absolute w-4 h-4 bg-gradient-to-br from-primary to-secondary rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 border-2 border-background shadow-xl" />
        <div className="absolute w-1.5 h-1.5 bg-background rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" />
      </div>
    </div>
  );
};

export default AnalogWatch;
