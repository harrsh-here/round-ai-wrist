import React from 'react';

const AnalogClock = ({ currentTime }) => {
  const hours = currentTime.getHours() % 12;
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  return (
    <div className="relative w-40 h-40 mx-auto">
      <div className="w-full h-full rounded-full border-4 border-gradient-to-br from-cyan-400 via-purple-500 to-cyan-400 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative shadow-2xl overflow-hidden">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 via-purple-500/10 to-cyan-400/20 blur-sm"></div>
        
        {/* Inner gradient overlay */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700/50"></div>

        {/* Hour Numbers */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
          const angle = (i * 30) - 90;
          const radius = 60;
          const x = Math.cos(angle * Math.PI / 180) * radius;
          const y = Math.sin(angle * Math.PI / 180) * radius;

          return (
            <div
              key={num}
              className="absolute text-white font-bold text-lg drop-shadow-lg z-10"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(${x - 8}px, ${y - 10}px)`
              }}
            >
              {num}
            </div>
          );
        })}

        {/* Hour Markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-6 bg-gradient-to-b from-cyan-400 to-white rounded-full shadow-lg"
            style={{
              top: '8px',
              left: '50%',
              transformOrigin: '50% 72px',
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
              zIndex: 5
            }}
          />
        ))}

        {/* Minute Markers */}
        {[...Array(60)].map((_, i) => {
          if (i % 5 !== 0) {
            return (
              <div
                key={i}
                className="absolute w-0.5 h-3 bg-gray-400 rounded-full"
                style={{
                  top: '8px',
                  left: '50%',
                  transformOrigin: '50% 72px',
                  transform: `translateX(-50%) rotate(${i * 6}deg)`,
                  zIndex: 4
                }}
              />
            );
          }
          return null;
        })}

        {/* Hour Hand */}
        <div
          className="absolute w-2 h-12 bg-gradient-to-t from-cyan-400 via-white to-cyan-300 rounded-full shadow-xl border border-white/30"
          style={{
            top: '50%',
            left: '50%',
            transformOrigin: '50% 100%',
            transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
            zIndex: 8
          }}
        />

        {/* Minute Hand */}
        <div
          className="absolute w-1 h-16 bg-gradient-to-t from-purple-400 via-white to-purple-300 rounded-full shadow-xl border border-white/20"
          style={{
            top: '50%',
            left: '50%',
            transformOrigin: '50% 100%',
            transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
            zIndex: 7
          }}
        />

        {/* Second Hand */}
        <div
          className="absolute w-0.5 h-16 bg-gradient-to-t from-red-500 to-red-300 rounded-full shadow-lg"
          style={{
            top: '50%',
            left: '50%',
            transformOrigin: '50% 100%',
            transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
            zIndex: 9
          }}
        />

        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-br from-cyan-400 via-white to-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-xl z-20"></div>
      </div>
    </div>
  );
};

export default AnalogClock;