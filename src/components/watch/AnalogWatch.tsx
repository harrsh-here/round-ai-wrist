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

  const WatchHand = ({ angle, length, width, color }: { angle: number; length: number; width: number; color: string }) => (
    <div
      className="absolute origin-bottom"
      style={{
        width: `${width}px`,
        height: `${length}px`,
        backgroundColor: color,
        left: '50%',
        top: '50%',
        transform: `translateX(-50%) translateY(-${length}px) rotate(${angle}deg)`,
        borderRadius: '2px',
      }}
    />
  );

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      {/* Analog Clock Face */}
      <div className="relative w-48 h-48 rounded-full border-2 border-primary/30 bg-gradient-to-br from-card to-muted">
        {/* Hour Markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-6 bg-foreground/60"
            style={{
              left: '50%',
              top: '10px',
              transformOrigin: '50% 86px',
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
            }}
          />
        ))}

        {/* Clock Hands */}
        <WatchHand angle={hourAngle} length={50} width={4} color="hsl(var(--foreground))" />
        <WatchHand angle={minuteAngle} length={70} width={3} color="hsl(var(--foreground))" />
        <WatchHand angle={secondAngle} length={80} width={1} color="hsl(var(--primary))" />

        {/* Center Dot */}
        <div className="absolute w-3 h-3 bg-primary rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Digital Time Display */}
      <div className="mt-4 text-center">
        <div className="text-lg font-mono text-primary">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-sm text-muted-foreground">
          {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-10 h-10 p-0 hover:bg-primary/20"
        >
          <Home size={16} />
        </Button>
      </div>
    </div>
  );
};

export default AnalogWatch;