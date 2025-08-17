
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

  // Generate hour numbers positions with premium styling
  const hourNumbers = [];
  for (let i = 1; i <= 12; i++) {
    const angle = (i * 30) - 90;
    const radius = 125; // Increased radius for full coverage
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    
    hourNumbers.push(
      <div
        key={i}
        className="analog-number text-foreground font-bold text-xl drop-shadow-lg"
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
    if (i % 5 !== 0) {
      const angle = i * 6;
      const isQuarter = i % 15 === 0;
      minuteMarkers.push(
        <div
          key={i}
          className={`absolute ${isQuarter ? 'w-1 h-4 bg-primary/60' : 'w-0.5 h-3 bg-foreground/30'}`}
          style={{
            left: '50%',
            top: '8px',
            transformOrigin: '50% 154px', // Adjusted for larger radius
            transform: `translateX(-50%) rotate(${angle}deg)`,
          }}
        />
      );
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Analog Clock Face - Full coverage */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-card via-background to-muted border-2 border-primary/20 shadow-inner">
        {/* Outer decorative ring */}
        <div className="absolute inset-2 rounded-full border-2 border-gradient-to-br from-primary/30 to-secondary/30" />
        
        {/* Inner ring */}
        <div className="absolute inset-4 rounded-full border border-border/20" />
        
        {/* Hour Markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-10 bg-gradient-to-b from-primary via-secondary to-primary rounded-full shadow-md"
            style={{
              left: '50%',
              top: '4px',
              transformOrigin: '50% 158px', // Adjusted for full coverage
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
            }}
          />
        ))}

        {/* Minute Markers */}
        {minuteMarkers}

        {/* Hour Numbers */}
        {hourNumbers}

        {/* Brand/Logo Position */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
          <div className="text-xs text-primary font-bold tracking-wider drop-shadow-md">SMARTWATCH</div>
          <div className="text-xs text-secondary font-medium">AI EDITION</div>
        </div>

        {/* Subsidiary dials */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-8 rounded-full border border-border/30 bg-muted/20 flex items-center justify-center">
            <div className="text-xs text-muted-foreground font-mono">{time.getSeconds()}</div>
          </div>
        </div>

        {/* Clock Hands */}
        <WatchHand 
          angle={hourAngle} 
          length={70} 
          width={8} 
          color="hsl(var(--foreground))" 
          className="z-30 shadow-lg"
        />
        <WatchHand 
          angle={minuteAngle} 
          length={100} 
          width={5} 
          color="hsl(var(--foreground))" 
          className="z-20 shadow-lg"
        />
        <WatchHand 
          angle={secondAngle} 
          length={115} 
          width={2} 
          color="hsl(var(--primary))" 
          className="z-10 shadow-md"
        />

        {/* Center assembly */}
        <div className="absolute w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 border-2 border-background shadow-xl" />
        <div className="absolute w-3 h-3 bg-background rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" />
        
        {/* Decorative screws */}
        {[0, 90, 180, 270].map((angle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-muted rounded-full border border-border/50"
            style={{
              left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 140}px)`,
              top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 140}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      {/* Navigation - Positioned above numbers safely */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-8 h-8 p-0 bg-background/40 hover:bg-primary/30 border border-border/40 backdrop-blur-sm shadow-lg"
        >
          <Home size={12} />
        </Button>
      </div>
    </div>
  );
};

export default AnalogWatch;
