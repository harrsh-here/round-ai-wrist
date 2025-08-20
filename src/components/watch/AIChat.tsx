
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Square } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface AIChatProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChat = ({ onNavigate }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. Hold the mic to speak.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMicPress = () => {
    setIsListening(true);
    
    // Simulate voice input after 2 seconds
    setTimeout(() => {
      const voiceInputs = [
        "What's my heart rate today?",
        "Show me the weather",
        "Set a timer for 5 minutes",
        "Call my mom",
        "Play my workout playlist"
      ];
      
      const randomInput = voiceInputs[Math.floor(Math.random() * voiceInputs.length)];
      
      const userMessage: Message = {
        id: Date.now().toString(),
        text: randomInput,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setIsListening(false);

      // AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getAIResponse(userMessage.text),
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }, 2000);
  };

  const getAIResponse = (userText: string): string => {
    const responses = [
      'I understand! Let me help you with that.',
      'That\'s a great question. Here\'s what I found...',
      'I can assist you with that right away.',
      'Based on your smartwatch data, I recommend...',
      'Sure! I\'ll take care of that for you.',
      'Let me check your health metrics for that information.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Digital Voice Recorder Icon Component
  const VoiceRecorderIcon = ({ size = 24, className = "" }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
    >
      <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
      <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="8" r="1" fill="currentColor"/>
      <circle cx="12" cy="6" r="0.5" fill="currentColor"/>
      <circle cx="12" cy="10" r="0.5" fill="currentColor"/>
    </svg>
  );

  return (
    <div className="watch-content-safe watch-safe-area">
      {/* Header */}
      <div className="flex items-center justify-center mb-3">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-semibold text-primary">AI Assistant</h2>
          <div className="w-2 h-2 bg-ai-primary rounded-full animate-pulse" />
        </div>
      </div>

      {/* Messages - Scrollable area */}
      <div className="flex-1 overflow-y-auto watch-scroll space-y-3 mb-4 max-h-[120px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-2xl text-xs shadow-lg ${
                message.isUser
                  ? 'dark-glass-bg text-white bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30'
                  : 'dark-glass-bg text-white bg-gradient-to-r from-ai-primary/20 to-purple-500/20 border border-ai-primary/30'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Input - Centered digital recorder with glow */}
      <div className="flex flex-col items-center space-y-4 mb-4">
        {/* Digital Voice Recorder Button */}
        <Button
          onMouseDown={handleMicPress}
          onTouchStart={handleMicPress}
          className={`rounded-full w-16 h-16 p-0 transition-all duration-300 shadow-lg ${
            isListening 
              ? 'bg-gradient-to-r from-accent to-accent/80 animate-voice-pulse' 
              : 'bg-gradient-to-r from-ai-primary to-purple-500 hover:from-ai-primary/80 hover:to-purple-500/80 pulse-ring'
          }`}
        >
          <VoiceRecorderIcon size={24} className="text-white" />
        </Button>
        
        {/* Instructions */}
        <div className="text-center">
          <div className="text-xs text-white/70">
            {isListening ? 'Recording...' : 'Hold to record'}
          </div>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-10 h-10 p-0 dark-glass-bg hover:bg-white/15"
        >
          <Home size={16} className="text-white" />
        </Button>
      </div>
    </div>
  );
};

export default AIChat;
