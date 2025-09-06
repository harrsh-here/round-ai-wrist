import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Mic, MicOff } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChat = ({ onNavigate }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hi! Press and hold the mic button to speak.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMicPress = () => {
    if (isProcessing || isListening) return;
    
    const timer = setTimeout(() => {
      setIsListening(true);
      startVoiceInput();
    }, 100); // Short delay to distinguish from tap
    
    setPressTimer(timer);
  };

  const handleMicRelease = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    
    if (isListening) {
      setIsListening(false);
      processVoiceInput();
    }
  };

  const startVoiceInput = () => {
    // Simulate voice recognition delay
    setTimeout(() => {
      if (isListening) {
        setIsListening(false);
        processVoiceInput();
      }
    }, 3000); // Max 3 seconds of listening
  };

  const processVoiceInput = () => {
    if (isProcessing) return;
    
    const voiceInputs = [
      "What's my heart rate?",
      "Show weather forecast",
      "Set timer for 5 minutes",
      "Call Sarah Wilson",
      "Play workout music",
      "How many steps today?",
      "What's my battery level?",
      "What time is it in Tokyo?",
      "Show my calendar",
      "Turn on flashlight"
    ];
    
    const randomInput = voiceInputs[Math.floor(Math.random() * voiceInputs.length)];
    
    const userMessage = {
      id: Date.now().toString(),
      text: randomInput,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev.slice(-2), userMessage]); // Keep only last 2 + new message
    setIsProcessing(true);

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(userMessage.text),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev.slice(-2), aiResponse]); // Keep only last 2 + new response
      setIsProcessing(false);
    }, 1500);
  };

  const getAIResponse = (userText) => {
    const responses = {
      "heart": "Your heart rate: 72 BPM, normal range",
      "weather": "Today: 24°C sunny. Tomorrow: 21°C cloudy",
      "timer": "5-minute timer started ⏱️",
      "call": "Calling Sarah Wilson... 📞",
      "music": "Playing 'Workout Mix' 🎵",
      "steps": "You've walked 8,247 steps today! 👟",
      "battery": "Watch battery: 85%, Phone: 67%",
      "time": "Tokyo time: 2:30 PM JST",
      "calendar": "Next: Team meeting at 3:00 PM",
      "flashlight": "Flashlight turned on 🔦"
    };

    for (const [key, response] of Object.entries(responses)) {
      if (userText.toLowerCase().includes(key)) {
        return response;
      }
    }
    return "I'm processing your request...";
  };

  // Only show last message pair for minimal UI
  const displayMessages = messages.slice(-2);

  return (
    <div className="watch-content-safe flex flex-col h-full relative">
      
      {/* Minimal Header */}
      <div className="text-center pt-4 pb-2">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          <h2 className="text-sm font-light text-cyan-400 tracking-widest">AI ASSISTANT</h2>
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Messages - Minimal view */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto watch-scroll px-4">
          <div className="space-y-3 min-h-full flex flex-col justify-center pb-2">
            {displayMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-xs transition-all duration-300 ${
                    message.isUser
                      ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 text-white border border-cyan-400/30 rounded-br-sm'
                      : 'bg-gradient-to-r from-white/10 to-gray-500/10 text-white border border-white/20 rounded-bl-sm'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            
            {/* Processing indicator */}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-white/10 to-gray-500/10 text-white border border-white/20 px-3 py-2 rounded-xl rounded-bl-sm text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* "Read whole thread on phone" note */}
        <div className="text-center py-2">
          <div className="text-xs text-white/40">
            Read whole thread on phone
          </div>
        </div>
      </div>

      {/* Status & Controls */}
      <div className="text-center pb-6">
        {/* Mic Button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="lg"
            onMouseDown={handleMicPress}
            onMouseUp={handleMicRelease}
            onMouseLeave={handleMicRelease}
            onTouchStart={handleMicPress}
            onTouchEnd={handleMicRelease}
            disabled={isProcessing}
            className={`rounded-full w-16 h-16 p-0 border-2 transition-all duration-300 ${
              isListening 
                ? 'border-cyan-400 bg-cyan-400/20 animate-pulse' 
                : isProcessing
                ? 'border-white/20 bg-white/5'
                : 'border-white/30 bg-gradient-to-r from-white/5 to-gray-500/5 hover:from-cyan-400/10 hover:to-cyan-500/10 hover:border-cyan-400/50'
            }`}
          >
            {isListening ? (
              <MicOff size={24} className="text-cyan-400" />
            ) : (
              <Mic size={24} className={isProcessing ? "text-white/40" : "text-white/70"} />
            )}
          </Button>
        </div>

        {/* Status */}
        <div className="mb-4">
          {isListening ? (
            <div className="text-cyan-400 text-xs font-light animate-pulse">
              ● LISTENING - Release to send
            </div>
          ) : isProcessing ? (
            <div className="text-white/60 text-xs font-light">
              ● PROCESSING...
            </div>
          ) : (
            <div className="text-white/40 text-xs font-light">
              Hold mic button to speak
            </div>
          )}
        </div>

        {/* Home Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate && onNavigate('home')}
          className="rounded-full w-10 h-10 p-0 border border-white/20 bg-gradient-to-r from-white/5 to-gray-500/5 hover:from-white/10 hover:to-gray-500/10 transition-all duration-300"
        >
          <Home size={16} className="text-white/70" />
        </Button>
      </div>

      {/* Listening indicator overlay */}
      {isListening && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-cyan-600/5 rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 border-2 border-cyan-400/30 rounded-full animate-ping" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;