
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
      className="watch-content-safe flex items-center justify-center cursor-pointer"
      onClick={() => onNavigate('home')}
    >
      {/* Analog Clock Face - Full coverage with safe padding */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-card via-background to-muted border-2 border-primary/20 shadow-inner">
        {/* Outer decorative ring */}
        <div className="absolute inset-2 rounded-full border-2 border-gradient-to-br from-primary/30 to-secondary/30" />
        
        {/* Inner ring */}
        <div className="absolute inset-4 rounded-full border border-border/20" />
        
        {/* Hour Markers */}
        {[...Array(12)].map((_, i) => {
          const angle = i * 30;
          const outerRadius = 145;
          const innerRadius = 125;
          
          const x1 = Math.cos((angle - 90) * Math.PI / 180) * outerRadius;
          const y1 = Math.sin((angle - 90) * Math.PI / 180) * outerRadius;
          const x2 = Math.cos((angle - 90) * Math.PI / 180) * innerRadius;
          const y2 = Math.sin((angle - 90) * Math.PI / 180) * innerRadius;
          
          return (
            <svg key={i} className="absolute inset-0 w-full h-full">
              <line
                x1={x1 + 150}
                y1={y1 + 150}
                x2={x2 + 150}
                y2={y2 + 150}
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                className="drop-shadow-sm"
              />
            </svg>
          );
        })}

        {/* Minute Markers */}
        <svg className="absolute inset-0 w-full h-full">
          {minuteMarkers}
        </svg>

        {/* Hour Numbers */}
        {hourNumbers}

        {/* Brand Position - FuzNex */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
          <div className="text-sm text-primary font-bold tracking-wider drop-shadow-md">FuzNex</div>
        </div>

        {/* Subsidiary seconds dial */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-8 rounded-full border border-border/30 bg-muted/20 flex items-center justify-center">
            <div className="text-xs text-muted-foreground font-mono">{time.getSeconds()}</div>
          </div>
        </div>

        {/* Clock Hands */}
        <WatchHand 
          angle={hourAngle} 
          length={60} 
          width={6} 
          color="hsl(var(--foreground))" 
          className="z-30 shadow-lg"
        />
        <WatchHand 
          angle={minuteAngle} 
          length={85} 
          width={4} 
          color="hsl(var(--foreground))" 
          className="z-20 shadow-lg"
        />
        <WatchHand 
          angle={secondAngle} 
          length={95} 
          width={2} 
          color="hsl(var(--primary))" 
          className="z-10 shadow-md"
        />

        {/* Center assembly */}
        <div className="absolute w-5 h-5 bg-gradient-to-br from-primary to-secondary rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 border-2 border-background shadow-xl" />
        <div className="absolute w-2 h-2 bg-background rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" />
        
        {/* Decorative screws */}
        {[45, 135, 225, 315].map((angle, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-muted rounded-full border border-border/50"
            style={{
              left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 130}px)`,
              top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 130}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnalogWatch;
