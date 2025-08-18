
import React, { useState, useEffect } from 'react';
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
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      }}
    />
  );

  // Generate hour numbers positions with safe padding
  const hourNumbers = [];
  for (let i = 1; i <= 12; i++) {
    const angle = (i * 30) - 90;
    const radius = 120; // Adjusted for better positioning
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    
    hourNumbers.push(
      <div
        key={i}
        className="analog-number text-foreground font-bold text-lg drop-shadow-lg"
        style={{
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
        }}
      >
        {i}
      </div>
    );
  }

  // Generate minute markers with proper spacing
  const minuteMarkers = [];
  for (let i = 0; i < 60; i++) {
    if (i % 5 !== 0) {
      const angle = i * 6;
      const outerRadius = 145;
      const innerRadius = 135;
      
      const x1 = Math.cos((angle - 90) * Math.PI / 180) * outerRadius;
      const y1 = Math.sin((angle - 90) * Math.PI / 180) * outerRadius;
      const x2 = Math.cos((angle - 90) * Math.PI / 180) * innerRadius;
      const y2 = Math.sin((angle - 90) * Math.PI / 180) * innerRadius;
      
      minuteMarkers.push(
        <line
          key={i}
          x1={x1 + 150}
          y1={y1 + 150}
          x2={x2 + 150}
          y2={y2 + 150}
          stroke="hsl(var(--foreground))"
          strokeWidth="1"
          opacity="0.3"
        />
      );
    }
  }

  return (
    <div 
      className="watch-content-safe flex items-center justify-center cursor-pointer p-2"
      onClick={() => onNavigate('home')}
    >
      {/* Analog Clock Face - Properly sized and centered */}
      <div className="relative w-full h-full max-w-[280px] max-h-[280px] rounded-full bg-gradient-to-br from-card via-background to-muted border-2 border-primary/30 shadow-inner">
        
        {/* Hour Markers - Properly positioned */}
        {[...Array(12)].map((_, i) => {
          const angle = i * 30;
          const outerRadius = 125;
          const innerRadius = 105;
          
          const x1 = Math.cos((angle - 90) * Math.PI / 180) * outerRadius;
          const y1 = Math.sin((angle - 90) * Math.PI / 180) * outerRadius;
          const x2 = Math.cos((angle - 90) * Math.PI / 180) * innerRadius;
          const y2 = Math.sin((angle - 90) * Math.PI / 180) * innerRadius;
          
          return (
            <svg key={i} className="absolute inset-0 w-full h-full">
              <line
                x1={x1 + 140}
                y1={y1 + 140}
                x2={x2 + 140}
                y2={y2 + 140}
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                className="drop-shadow-sm"
              />
            </svg>
          );
        })}

        {/* Minute Markers - Better spacing */}
        <svg className="absolute inset-0 w-full h-full">
          {[...Array(60)].map((_, i) => {
            if (i % 5 !== 0) {
              const angle = i * 6;
              const outerRadius = 130;
              const innerRadius = 120;
              
              const x1 = Math.cos((angle - 90) * Math.PI / 180) * outerRadius;
              const y1 = Math.sin((angle - 90) * Math.PI / 180) * outerRadius;
              const x2 = Math.cos((angle - 90) * Math.PI / 180) * innerRadius;
              const y2 = Math.sin((angle - 90) * Math.PI / 180) * innerRadius;
              
              return (
                <line
                  key={i}
                  x1={x1 + 140}
                  y1={y1 + 140}
                  x2={x2 + 140}
                  y2={y2 + 140}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
              );
            }
            return null;
          })}
        </svg>

        {/* Hour Numbers - Properly positioned with safe padding */}
        {[...Array(12)].map((_, i) => {
          const hour = i === 0 ? 12 : i;
          const angle = (i * 30) - 90;
          const radius = 85; // Safe distance from edge
          
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          
          return (
            <div
              key={hour}
              className="absolute text-white font-bold text-lg"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)',
              }}
            >
              {hour}
            </div>
          );
        })}

        {/* Brand Position - FuzNex */}
        <div className="absolute top-[25%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-sm text-primary font-bold tracking-wider drop-shadow-md">FuzNex</div>
        </div>

        {/* Subsidiary seconds dial */}
        <div className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-12 h-12 rounded-full border-2 border-border/40 bg-muted/30 flex items-center justify-center">
            <div className="text-xs text-muted-foreground font-mono font-bold">{time.getSeconds().toString().padStart(2, '0')}</div>
          </div>
        </div>

        {/* Clock Hands - Properly sized */}
        <WatchHand 
          angle={hourAngle} 
          length={50} 
          width={5} 
          color="hsl(var(--foreground))" 
          className="z-30 shadow-lg"
        />
        <WatchHand 
          angle={minuteAngle} 
          length={75} 
          width={3} 
          color="hsl(var(--foreground))" 
          className="z-20 shadow-lg"
        />
        <WatchHand 
          angle={secondAngle} 
          length={85} 
          width={1} 
          color="hsl(var(--primary))" 
          className="z-10 shadow-md"
        />

        {/* Center assembly */}
        <div className="absolute w-5 h-5 bg-gradient-to-br from-primary to-secondary rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 border-2 border-background shadow-xl" />
        <div className="absolute w-2 h-2 bg-background rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" />
        
        {/* Decorative screws - Better positioned */}
        {[45, 135, 225, 315].map((angle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-muted rounded-full border border-border/60"
            style={{
              left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 110}px)`,
              top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 110}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnalogWatch;
