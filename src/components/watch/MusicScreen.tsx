import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, Home, Heart, Shuffle, Repeat } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface MusicScreenProps {
  onNavigate: (screen: WatchScreen) => void;
}

const MusicScreen = ({ onNavigate }: MusicScreenProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [progress, setProgress] = useState(45);

  const playlist = [
    { title: 'Workout Vibes', artist: 'FitBeats', duration: '3:45' },
    { title: 'Morning Energy', artist: 'Rise & Shine', duration: '4:12' },
    { title: 'Focus Flow', artist: 'Concentration', duration: '3:28' },
    { title: 'Chill Mode', artist: 'Relaxation', duration: '4:33' },
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentSong((prev) => (prev + 1) % playlist.length);
  };

  const handlePrevious = () => {
    setCurrentSong((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  return (
    <div className="watch-content-safe flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-center mb-3">
        <h2 className="text-sm font-semibold text-white">Music</h2>
      </div>

      {/* Current Song */}
      <div className="glass-bg rounded-xl p-4 mb-3 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Volume2 size={24} className="text-purple-400" />
        </div>
        <div className="text-sm font-semibold text-white mb-1">
          {playlist[currentSong].title}
        </div>
        <div className="text-xs text-white/70">
          {playlist[currentSong].artist}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-white/70 mb-1">
          <span>1:{String(Math.floor(progress * 0.8)).padStart(2, '0')}</span>
          <span>{playlist[currentSong].duration}</span>
        </div>
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          className="w-10 h-10 glass-bg hover:bg-white/20 rounded-full p-0"
        >
          <SkipBack size={16} className="text-white" />
        </Button>
        
        <Button
          onClick={handlePlayPause}
          className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full shadow-lg"
        >
          {isPlaying ? (
            <Pause size={18} className="text-white" />
          ) : (
            <Play size={18} className="text-white ml-1" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          className="w-10 h-10 glass-bg hover:bg-white/20 rounded-full p-0"
        >
          <SkipForward size={16} className="text-white" />
        </Button>
      </div>

      {/* Additional Controls */}
      <div className="flex items-center justify-center space-x-6 mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 glass-bg hover:bg-white/20 rounded-full p-0"
        >
          <Shuffle size={14} className="text-white/70" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 glass-bg hover:bg-white/20 rounded-full p-0"
        >
          <Heart size={14} className="text-red-400" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 glass-bg hover:bg-white/20 rounded-full p-0"
        >
          <Repeat size={14} className="text-white/70" />
        </Button>
      </div>

      {/* Playlist */}
      <div className="flex-1 overflow-hidden">
        <div className="text-xs text-white/70 mb-2 text-center">Up Next</div>
        <div className="space-y-2 h-full overflow-y-auto">
          {playlist.map((song, index) => (
            <div 
              key={index}
              onClick={() => setCurrentSong(index)}
              className={`glass-bg rounded-lg p-2 cursor-pointer transition-all ${
                index === currentSong ? 'bg-purple-500/20 border border-purple-400/30' : 'hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">
                    {song.title}
                  </div>
                  <div className="text-xs text-white/60 truncate">
                    {song.artist}
                  </div>
                </div>
                <div className="text-xs text-white/50 ml-2">
                  {song.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('features')}
          className="rounded-full w-10 h-10 p-0 glass-bg hover:bg-white/15"
        >
          <Home size={16} className="text-white" />
        </Button>
      </div>
    </div>
  );
};

export default MusicScreen;