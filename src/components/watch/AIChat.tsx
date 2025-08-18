import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Home, Mic } from 'lucide-react';
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
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(userMessage.text),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userText: string): string => {
    const responses = [
      'I understand! Let me help you with that.',
      'That\'s a great question. Here\'s what I think...',
      'I can assist you with that right away.',
      'Based on your smartwatch data, I recommend...',
      'Sure! I\'ll take care of that for you.',
      'Let me check your health metrics for that information.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="watch-content-safe flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-center mb-3">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-semibold text-white">AI Assistant</h2>
          <div className="w-2 h-2 bg-ai-primary rounded-full animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3 px-1">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] p-2 rounded-xl text-xs shadow-lg ${
                message.isUser
                  ? 'glass-bg text-white ml-4'
                  : 'bg-gradient-to-r from-ai-primary/20 to-purple-500/20 text-white mr-4 border border-ai-primary/30'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-ai-primary/20 to-purple-500/20 text-white p-2 rounded-xl text-xs border border-ai-primary/30 mr-4">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center space-x-2 mb-3">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full w-8 h-8 p-0 glass-bg hover:bg-white/20"
        >
          <Mic size={12} className="text-white" />
        </Button>
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type message..."
          className="flex-1 h-8 text-xs glass-bg border-white/20 text-white placeholder:text-white/50"
        />
        <Button
          onClick={handleSendMessage}
          size="sm"
          className="rounded-full w-8 h-8 p-0 bg-gradient-to-r from-ai-primary to-purple-500 hover:from-ai-primary/80 hover:to-purple-500/80 shadow-lg"
        >
          <Send size={12} className="text-white" />
        </Button>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-10 h-10 p-0 glass-bg hover:bg-white/15"
        >
          <Home size={16} className="text-white" />
        </Button>
      </div>
    </div>
  );
};

export default AIChat;