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
    <div className="relative w-full h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">AI Assistant</h2>
        <div className="w-2 h-2 bg-ai-primary rounded-full animate-pulse-glow" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3 max-h-40">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-2 rounded-lg text-xs ${
                message.isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-secondary text-secondary-foreground p-2 rounded-lg text-xs">
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
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full w-8 h-8 p-0 hover:bg-ai-primary/20"
        >
          <Mic size={12} />
        </Button>
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type message..."
          className="flex-1 h-8 text-xs bg-secondary/50 border-border/50"
        />
        <Button
          onClick={handleSendMessage}
          size="sm"
          className="rounded-full w-8 h-8 p-0 bg-ai-primary hover:bg-ai-primary/80"
        >
          <Send size={12} />
        </Button>
      </div>

      {/* Back Button */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-8 h-8 p-0 hover:bg-primary/20"
        >
          <Home size={12} />
        </Button>
      </div>
    </div>
  );
};

export default AIChat;