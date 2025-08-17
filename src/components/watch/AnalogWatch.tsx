
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
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

  // Generate hour numbers positions
  const hourNumbers = [];
  for (let i = 1; i <= 12; i++) {
    const angle = (i * 30) - 90; // Convert to radians starting from 12 o'clock
    const radius = 110; // Distance from center
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    
    hourNumbers.push(
      <div
        key={i}
        className="analog-number text-foreground font-bold text-xl"
        style={{
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
        }}
      >
        {i}
      </div>
    );
  }

  // Generate minute markers
  const minuteMarkers = [];
  for (let i = 0; i < 60; i++) {
    if (i % 5 !== 0) { // Skip hour positions
      const angle = i * 6;
      minuteMarkers.push(
        <div
          key={i}
          className="absolute w-0.5 h-3 bg-foreground/40"
          style={{
            left: '50%',
            top: '12px',
            transformOrigin: '50% 138px',
            transform: `translateX(-50%) rotate(${angle}deg)`,
          }}
        />
      );
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Analog Clock Face */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-card via-background to-muted border-2 border-primary/20">
        {/* Outer Ring */}
        <div className="absolute inset-2 rounded-full border border-border/30" />
        
        {/* Hour Markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"
            style={{
              left: '50%',
              top: '8px',
              transformOrigin: '50% 142px',
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
            }}
          />
        ))}

        {/* Minute Markers */}
        {minuteMarkers}

        {/* Hour Numbers */}
        {hourNumbers}

        {/* Brand/Logo Position */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          <div className="text-xs text-primary font-semibold">SMARTWATCH</div>
        </div>

        {/* Clock Hands */}
        <WatchHand 
          angle={hourAngle} 
          length={60} 
          width={6} 
          color="hsl(var(--foreground))" 
          className="z-30"
        />
        <WatchHand 
          angle={minuteAngle} 
          length={85} 
          width={4} 
          color="hsl(var(--foreground))" 
          className="z-20"
        />
        <WatchHand 
          angle={secondAngle} 
          length={100} 
          width={2} 
          color="hsl(var(--primary))" 
          className="z-10"
        />

        {/* Center Dot */}
        <div className="absolute w-4 h-4 bg-gradient-to-br from-primary to-secondary rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 border-2 border-background shadow-lg" />
        
        {/* Inner center dot */}
        <div className="absolute w-2 h-2 bg-background rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" />
      </div>

      {/* Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-10 h-10 p-0 bg-background/20 hover:bg-primary/20 border border-border/30 backdrop-blur-sm"
        >
          <Home size={16} />
        </Button>
      </div>
    </div>
  );
};

export default AnalogWatch;
