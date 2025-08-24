import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, Home, Heart, Shuffle, Repeat } from 'lucide-react';

interface MusicScreenProps {
  onNavigate: (screen: string) => void;
}

const MusicScreen = ({ onNavigate }: MusicScreenProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'
  const [likedSongs, setLikedSongs] = useState(new Set([1, 3]));
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef(null);
  const progressUpdateRef = useRef(null);

  // Playlist with MP3 files from public folder
  const playlist = [
    { 
      title: 'Shreya Ghoshal Performance', 
      artist: 'Shreya Ghoshal', 
      src: '/music/shreya_ghoshal_performance.mp3', // Put your MP3 files in public/music/
      fallbackDuration: 225
    },
    { 
      title: 'Atif Aslam Performing At 2004 New Year Celebrations _ Lamhe _ RK Music _ JAL Band', 
      artist: 'Atif Aslam', 
      src: '/music/atif1.mp3',
      fallbackDuration: 252
    },
    { 
      title: 'Atif aslam best performance _ Gima awards 2015 _ tu jaane na _ main rang sharbaton ka.mp3', 
      artist: 'Atif Aslam', 
      src: '/music/atif2.mp3',
      fallbackDuration: 208
    },
    { 
      title: 'Ankhon Mein Teri - Om Shanti Om (with Eng translations)', 
      artist: 'KK', 
      src: '/music/kk.mp3',
      fallbackDuration: 273
    },

    { 
      title: 'Breathless', 
      artist: 'Shankar Mahadevan', 
      src: '/music/breathless.mp3',
      fallbackDuration: 273
    },
  ];

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize audio element
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      // Set initial volume
      audio.volume = volume;
      
      // Load metadata
      const handleLoadedMetadata = () => {
        setDuration(audio.duration || playlist[currentSong].fallbackDuration);
        setIsLoading(false);
      };
      
      // Update progress
      const handleTimeUpdate = () => {
        if (audio.duration) {
          setCurrentTime(audio.currentTime);
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };
      
      // Handle song end
      const handleEnded = () => {
        if (repeatMode === 'one') {
          audio.currentTime = 0;
          audio.play();
        } else if (repeatMode === 'all' || currentSong < playlist.length - 1) {
          handleNext();
        } else {
          setIsPlaying(false);
          setProgress(0);
          setCurrentTime(0);
        }
      };
      
      // Handle loading states
      const handleLoadStart = () => setIsLoading(true);
      const handleCanPlay = () => setIsLoading(false);
      const handleError = () => {
        setIsLoading(false);
        console.log(`Could not load: ${playlist[currentSong].src}`);
        // Use fallback duration if file doesn't exist
        setDuration(playlist[currentSong].fallbackDuration);
      };
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [currentSong, repeatMode]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = async () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        await audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Playback error:', error);
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    let nextIndex;
    if (isShuffled) {
      do {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } while (nextIndex === currentSong && playlist.length > 1);
    } else {
      nextIndex = (currentSong + 1) % playlist.length;
    }
    
    setCurrentSong(nextIndex);
    setCurrentTime(0);
    setProgress(0);
  };

  const handlePrevious = () => {
    if (currentTime > 3) {
      // If more than 3 seconds played, restart current song
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        setProgress(0);
      }
      return;
    }
    
    let prevIndex;
    if (isShuffled) {
      do {
        prevIndex = Math.floor(Math.random() * playlist.length);
      } while (prevIndex === currentSong && playlist.length > 1);
    } else {
      prevIndex = (currentSong - 1 + playlist.length) % playlist.length;
    }
    
    setCurrentSong(prevIndex);
    setCurrentTime(0);
    setProgress(0);
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    const newTime = (newProgress / 100) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(newProgress);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const toggleLike = () => {
    const newLikedSongs = new Set(likedSongs);
    if (newLikedSongs.has(currentSong)) {
      newLikedSongs.delete(currentSong);
    } else {
      newLikedSongs.add(currentSong);
    }
    setLikedSongs(newLikedSongs);
  };

  const selectSong = (index) => {
    if (index !== currentSong) {
      setCurrentSong(index);
      setCurrentTime(0);
      setProgress(0);
      if (isPlaying) {
        // Will auto-play new song due to isPlaying state
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(console.log);
          }
        }, 100);
      }
    }
  };

  const currentSongData = playlist[currentSong];

  return (
    <div className="watch-content-safe flex flex-col h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20 watch-scroll overflow-y-auto">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentSongData.src}
        preload="metadata"
      />
      
      {/* Header */}
      <div className="py-4 flex items-center justify-center mb-3 sticky top-0 z-10 backdrop-blur-xs bg-black/200">
        <h2 className="text-lg font-semibold text-white py-2">Music</h2>
      </div>
      {/* Current Song */}
      <div className="glass-bg rounded-lg p-2.5 mb-2 text-center w-3/4 mx-auto">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg flex items-center justify-center mx-auto mb-1 relative overflow-hidden">
          <Volume2 size={20} className="text-purple-400" />
          {isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse rounded-lg" />
          )}
          {isLoading && (
            <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
              <div 
                className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"
                role="status"
                aria-label="Loading..."
              />
            </div>
          )}
        </div>
        <div className="relative w-full overflow-hidden px-1">
          <div className="mx-auto relative" style={{ width: '150px', overflow: 'hidden' }}>
            {isPlaying && (
              <div className="absolute inset-0 flex justify-center items-center space-x-1 opacity-20">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-purple-400"
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      animation: `visualizer ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            )}
            <div 
              className={`text-sm font-semibold text-white mb-1 whitespace-nowrap relative z-10 ${
                currentSongData.title.length > 25 ? 'animate-marquee' : ''
              }`}
              style={{
                display: 'inline-block'
              }}
            >
              {currentSongData.title}
            </div>
          </div>
        </div>
        <div className="text-xs text-white/70 truncate px-1">
          {currentSongData.artist}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(50px);
          }
          100% {
            transform: translateX(-${currentSongData.title.length * 3}px);
          }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
        @keyframes visualizer {
          0% {
            transform: scaleY(0.3);
          }
          100% {
            transform: scaleY(1);
          }
        }
      `}</style>

      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-white/70 mb-1 w-3/4 mx-auto">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div 
          className="w-3/4 mx-auto h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer relative"
          onClick={handleProgressClick}
          onMouseDown={(e) => {
            const progressBar = e.currentTarget;
            const updateProgressFromMouse = (moveEvent) => {
              const rect = progressBar.getBoundingClientRect();
              const clickX = Math.min(Math.max(0, moveEvent.clientX - rect.left), rect.width);
              const newProgress = (clickX / rect.width) * 100;
              const newTime = (newProgress / 100) * duration;
              
              // Update UI immediately for smooth feedback
              setProgress(newProgress);
              setCurrentTime(newTime);
              
              // Update audio position
              if (audioRef.current) {
                audioRef.current.currentTime = newTime;
              }
            };

            // Handle initial click
            updateProgressFromMouse(e);

            const handleMouseMove = (moveEvent) => {
              moveEvent.preventDefault(); // Prevent text selection
              updateProgressFromMouse(moveEvent);
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        >
          <div 
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
          />
          <div 
            className="absolute top-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-lg transform -translate-y-1/2"
            style={{ 
              left: `calc(${progress}% - 5px)`,
              transition: 'left 0.1s linear',
              filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))'
            }}
          />
        </div>
      </div>
{/* Volume Control */}
<div className="flex items-center justify-center space-x-2 mb-1 w-3/4 mx-auto">
  <Volume2 size={14} className="text-white/70" />
  <div 
    className="relative w-24 h-6 flex items-center cursor-pointer"
    onMouseDown={(e) => {
      const volumeBar = e.currentTarget;
      
      const updateVolumeFromMouse = (moveEvent) => {
        const rect = volumeBar.getBoundingClientRect();
        const clickX = Math.min(Math.max(0, moveEvent.clientX - rect.left), rect.width);
        const newVolume = Math.min(Math.max(0, clickX / rect.width), 1);
        setVolume(newVolume);
      };

      updateVolumeFromMouse(e);

      const handleMouseMove = (moveEvent) => {
        moveEvent.preventDefault();
        updateVolumeFromMouse(moveEvent);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }}
  >
    <div className="absolute w-full h-1.5 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm">
      <div 
        className="h-full rounded-full"
        style={{ 
          width: `${volume * 100}%`, 
          transition: 'width 0.1s',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(220,220,220,1) 50%, rgba(192,192,192,0.9) 100%)'
        }}
      />
    </div>
    <div 
      className="absolute w-3 h-3 rounded-full border-2 border-white shadow-lg"
      style={{ 
        left: `${volume * 100}%`,
        transform: 'translateX(-50%)',
        transition: 'left 0.1s',
        background: 'linear-gradient(135deg, #e0e0e0, #ffffff, #a0a0a0)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.9)'
      }}
    />
  </div>
  <span className="text-xs text-white/60 min-w-[24px] text-right">
    {Math.round(volume * 100)}
  </span>
</div>

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={isLoading}
          className="w-10 h-10 glass-bg hover:bg-white/20 rounded-full p-0 transition-all"
        >
          <SkipBack size={16} className="text-white" />
        </Button>
        
        <Button
          onClick={handlePlayPause}
          disabled={isLoading}
          className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={18} className="text-white" />
          ) : (
            <Play size={18} className="text-white ml-1" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={isLoading}
          className="w-10 h-10 glass-bg hover:bg-white/20 rounded-full p-0 transition-all"
        >
          <SkipForward size={16} className="text-white" />
        </Button>
      </div>

      {/* Additional Controls */}
      <div className="flex items-center justify-center space-x-6 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleShuffle}
          className={`w-8 h-8 glass-bg hover:bg-white/20 rounded-full p-0 transition-all ${
            isShuffled ? 'bg-purple-500/30' : ''
          }`}
        >
          <Shuffle size={14} className={`${isShuffled ? 'text-purple-400' : 'text-white/70'}`} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLike}
          className="w-8 h-8 glass-bg hover:bg-white/20 rounded-full p-0 transition-all transform hover:scale-110"
        >
          <Heart 
            size={14} 
            className={`transition-all ${likedSongs.has(currentSong) ? 'text-red-400 fill-current scale-110' : 'text-white/70'}`} 
          />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleRepeat}
          className={`w-8 h-8 glass-bg hover:bg-white/20 rounded-full p-0 transition-all ${
            repeatMode !== 'off' ? 'bg-purple-500/30' : ''
          }`}
        >
          <div className="relative">
            <Repeat size={14} className={`${repeatMode !== 'off' ? 'text-purple-400' : 'text-white/70'}`} />
            {repeatMode === 'one' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">1</span>
              </div>
            )}
          </div>
        </Button>
      </div>

     
      {/* Playlist */}
      <div className="flex-1 overflow-hidden">
        <div className="text-xs text-white/70 mb-2 text-center">Playlist</div>
        <div className="space-y-2 h-full overflow-y-auto">
          {playlist.map((song, index) => (
            <div 
              key={index}
              onClick={() => selectSong(index)}
              className={`glass-bg rounded-lg p-3 cursor-pointer transition-all hover:scale-[1.02] ${
                index === currentSong ? 'bg-purple-500/20 border border-purple-400/30 shadow-lg' : 'hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white truncate flex items-center space-x-2">
                      <span>{song.title}</span>
                      {likedSongs.has(index) && (
                        <Heart size={10} className="text-red-400 fill-current" />
                      )}
                      {index === currentSong && (
                        <div className="flex items-center space-x-1">
                          {isPlaying ? (
                            <div className="flex space-x-1">
                              <div className="w-1 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0ms'}} />
                              <div className="w-1 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '150ms'}} />
                              <div className="w-1 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '300ms'}} />
                            </div>
                          ) : (
                            <div className="w-2 h-2 bg-purple-400 rounded-full" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-white/60 truncate">
                      {song.artist}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-white/50 ml-2">
                  {formatTime(index === currentSong ? duration : song.fallbackDuration)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-1 pb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('features')}
          className="rounded-full w-10 h-10 p-0 glass-bg hover:bg-white/15 transition-all hover:scale-105"
        >
          <Home size={16} className="text-white" />
        </Button>
      </div>

      <style>{`
        .volume-slider::-webkit-slider-track {
          height: 8px;
          background: linear-gradient(to right, 
            #a855f7 0%, 
            #ec4899 ${volume * 100}%, 
            rgba(255,255,255,0.2) ${volume * 100}%, 
            rgba(255,255,255,0.2) 100%
          );
          border-radius: 4px;
        }
        
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #a855f7, #ec4899);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          margin-top: -4px;
        }
        
        .volume-slider::-moz-range-track {
          height: 8px;
          background: linear-gradient(to right, 
            #a855f7 0%, 
            #ec4899 ${volume * 100}%, 
            rgba(255,255,255,0.2) ${volume * 100}%, 
            rgba(255,255,255,0.2) 100%
          );
          border-radius: 4px;
          border: none;
        }
        
        .volume-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #a855f7, #ec4899);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default MusicScreen;