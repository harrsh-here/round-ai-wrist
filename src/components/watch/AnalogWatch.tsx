import React, { useState, useEffect } from 'react';
import { Battery, Wifi, Bluetooth, Phone } from 'lucide-react';

const AnalogWatch = ({ onNavigate }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate rotation angles for watch hands
  const secondAngle = time.getSeconds() * 6;
  const minuteAngle = time.getMinutes() * 6 + time.getSeconds() * 0.1;
  const hourAngle = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;

  // Watch hand component
  const WatchHand = ({ angle, length, width, color, className = "" }) => (
    <div
      className={`absolute origin-bottom ${className}`}
      style={{
        width: `${width}px`,
        height: `${length}px`,
        backgroundColor: color,
        left: "50%",
        top: "50%",
        transform: `translateX(-50%) translateY(-${length}px) rotate(${angle}deg)`,
        borderRadius: width > 2 ? "3px" : "1px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        transition: "transform 0.1s ease-out",
      }}
    />
  );

  // Use inner watch-content-safe size 350x350 for calculations
  const size = 350;
  const center = size / 2;
  const outerRadius = 140;
  const innerRadius = 120;

  return (
    <div
      className=" flex items-center justify-center cursor-pointer"

      onClick={() => onNavigate && onNavigate("home")}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === "Enter") onNavigate && onNavigate("home"); }}
      style={{ width: `${size}px`, height: `${size}px`, margin: "0 auto" }}
    >
      {/* Status Bar
      <div className="watch-status-bar absolute top-8 left-4 right-4 z-50 flex justify-between">
        <div className="status-icon battery flex items-center space-x-1 text-green-400 select-none">
          <Battery size={14} />
          <span className="font-medium">85%</span>
        </div>
        <div className="flex items-center space-x-3 text-xs text-white/90 select-none">
          <Wifi size={14} />
          <Bluetooth size={14} />
          <Phone size={14} />
        </div>
      </div> */}

      {/* Background Text */}
      <div className=" mix-blend-screen absolute inset-0 flex flex-col top-[-110px] items-center justify-center pointer-events-none z-10 select-none">
        <div className=" text-3xl md:text-sm font-Bold text-grey tracking-9 transform -rotate-0">
          Harrsh's
        </div>
        <div className="text-4xl md:text-2xl font-bold text-cyan-400 tracking-4 transform rotate-0 -mt-2 ">
          FuzNex
        </div>
      </div>

      {/* Analog Clock Face */}
      <div
        className="relative rounded-full bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-white/10 shadow-2xl  backdrop-blur-sm "
        style={{ width: size, height: size }}
      >
        {/* Outer border ring */}
        <div className="absolute inset-2 rounded-full border border-white/5" />

        {/* Hour markers */}
        <svg className="absolute inset-0 w-full h-full opacity-2%" width={size} height={size}>
          {[...Array(12)].map((_, i) => {
            const angle = i * 30;
            const x1 = center + Math.cos(((angle - 90) * Math.PI) / 180) * outerRadius;
            const y1 = center + Math.sin(((angle - 90) * Math.PI) / 180) * outerRadius;
            const x2 = center + Math.cos(((angle - 90) * Math.PI) / 180) * innerRadius;
            const y2 = center + Math.sin(((angle - 90) * Math.PI) / 180) * innerRadius;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="hsl(var(--foreground))"
                strokeWidth={i % 3 === 0 ? 4 : 3}
                className="drop-shadow-sm"
                opacity={i % 3 === 0 ? 0.9 : 0.7}
              />
            );
          })}
        </svg>

        {/* Minute markers */}
        <svg className="absolute inset-0 w-full h-full" width={size} height={size}>
          {[...Array(60)].map((_, i) => {
            if (i % 5 !== 0) {
              const angle = i * 6;
              const outer = 142;
              const inner = 135;
              const x1 = center + Math.cos(((angle - 90) * Math.PI) / 180) * outer;
              const y1 = center + Math.sin(((angle - 90) * Math.PI) / 180) * outer;
              const x2 = center + Math.cos(((angle - 90) * Math.PI) / 180) * inner;
              const y2 = center + Math.sin(((angle - 90) * Math.PI) / 180) * inner;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(var(--foreground))"
                  strokeWidth={1}
                  opacity={0.3}
                />
              );
            }
            return null;
          })}
        </svg>

        {/* Hour numbers */}
        {[12, 3, 6, 9].map((hour, i) => {
          const angle = i * 90 - 90;
          const radius = 100;
          const x = center + Math.cos((angle * Math.PI) / 180) * radius;
          const y = center + Math.sin((angle * Math.PI) / 180) * radius;
          return (
            <div
              key={hour}
              className="absolute text-white font-light text-2xl select-none"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
                textShadow: "0 0 10px rgba(255,255,255,0.5)",
              }}
            >
              {hour}
            </div>
          );
        })}

        {/* Clock hands */}
        <WatchHand
          angle={hourAngle}
          length={70}
          width={6}
          color="hsl(var(--foreground))"
          className="z-30"
        />
        <WatchHand
          angle={minuteAngle}
          length={95}
          width={4}
          color="hsl(var(--foreground))"
          className="z-20"
        />
        <WatchHand
          angle={secondAngle}
          length={110}
          width={2}
          color="hsl(var(--destructive))"
          className="z-10"
        />

        {/* Center assemblies */}
        <div className="absolute w-6 h-6 bg-gradient-to-br from-white to-gray-300 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 shadow-lg border border-white/20" />
        <div className="absolute w-3 h-3 bg-gray-800 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" />
        <div className="absolute w-4 h-4 bg-red-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-45 opacity-80" />
      </div>
    </div>
  );
};

export default AnalogWatch;
