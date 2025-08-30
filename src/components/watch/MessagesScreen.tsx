import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, MessageSquare, Send, Phone, Video, ArrowLeft, Circle } from 'lucide-react';

interface MessagesScreenProps {
  onNavigate: (screen: string) => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  avatar: string;
  messages: Message[];
}

const MessagesScreen = ({ onNavigate }: MessagesScreenProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Sarah Wilson',
      lastMessage: 'Hey! Are we still on for lunch?',
      timestamp: new Date(Date.now() - 5 * 60000),
      unreadCount: 2,
      isOnline: true,
      avatar: 'SW',
      messages: [
        { id: '1', text: 'Hey! How are you?', isUser: false, timestamp: new Date(Date.now() - 30 * 60000) },
        { id: '2', text: 'I\'m good! How about you?', isUser: true, timestamp: new Date(Date.now() - 25 * 60000) },
        { id: '3', text: 'Great! Are we still on for lunch?', isUser: false, timestamp: new Date(Date.now() - 5 * 60000) }
      ]
    },
    {
      id: '2',
      name: 'Mom',
      lastMessage: 'Don\'t forget to call me tonight',
      timestamp: new Date(Date.now() - 15 * 60000),
      unreadCount: 1,
      isOnline: false,
      avatar: 'M',
      messages: [
        { id: '1', text: 'Hi honey! How was your day?', isUser: false, timestamp: new Date(Date.now() - 60 * 60000) },
        { id: '2', text: 'It was great mom! Very busy though', isUser: true, timestamp: new Date(Date.now() - 45 * 60000) },
        { id: '3', text: 'Don\'t forget to call me tonight', isUser: false, timestamp: new Date(Date.now() - 15 * 60000) }
      ]
    },
    {
      id: '3',
      name: 'Alex Chen',
      lastMessage: 'Thanks for the help today!',
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      unreadCount: 0,
      isOnline: true,
      avatar: 'AC',
      messages: [
        { id: '1', text: 'Can you help me with the project?', isUser: false, timestamp: new Date(Date.now() - 3 * 60 * 60000) },
        { id: '2', text: 'Sure! What do you need?', isUser: true, timestamp: new Date(Date.now() - 2.5 * 60 * 60000) },
        { id: '3', text: 'Thanks for the help today!', isUser: false, timestamp: new Date(Date.now() - 2 * 60 * 60000) }
      ]
    },
    {
      id: '4',
      name: 'Work Group',
      lastMessage: 'Meeting moved to 3 PM',
      timestamp: new Date(Date.now() - 4 * 60 * 60000),
      unreadCount: 3,
      isOnline: false,
      avatar: 'WG',
      messages: [
        { id: '1', text: 'Team meeting at 2 PM today', isUser: false, timestamp: new Date(Date.now() - 5 * 60 * 60000) },
        { id: '2', text: 'I\'ll be there', isUser: true, timestamp: new Date(Date.now() - 4.5 * 60 * 60000) },
        { id: '3', text: 'Meeting moved to 3 PM', isUser: false, timestamp: new Date(Date.now() - 4 * 60 * 60000) }
      ]
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Simulate new messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 20 seconds
        const randomMessages = [
          'How are you doing?',
          'Can we meet later?',
          'Check this out!',
          'Running late, be there soon',
          'Great job on the presentation!',
          'What time works for you?'
        ];
        
        const randomConvIndex = Math.floor(Math.random() * conversations.length);
        const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        
        setConversations(prev => prev.map((conv, index) => {
          if (index === randomConvIndex) {
            const newMsg: Message = {
              id: Date.now().toString(),
              text: randomMessage,
              isUser: false,
              timestamp: new Date()
            };
            
            return {
              ...conv,
              lastMessage: randomMessage,
              timestamp: new Date(),
              unreadCount: selectedConversation?.id === conv.id ? conv.unreadCount : conv.unreadCount + 1,
              messages: [...conv.messages, newMsg]
            };
          }
          return conv;
        }));
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [conversations, selectedConversation]);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return timestamp.toLocaleDateString();
  };

  const openConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Mark as read
    setConversations(prev => prev.map(conv => 
      conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      isUser: true,
      timestamp: new Date()
    };

    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? {
            ...conv,
            lastMessage: newMessage,
            timestamp: new Date(),
            messages: [...conv.messages, message]
          }
        : conv
    ));

    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message]
    } : null);

    setNewMessage('');
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  // Chat View
  if (selectedConversation) {
    return (
      <div className="watch-content-safe flex flex-col h-full">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedConversation(null)}
              className="rounded-full w-8 h-8 p-0 bg-white/10 hover:bg-white/20"
            >
              <ArrowLeft size={14} className="text-white" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{selectedConversation.avatar}</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">{selectedConversation.name}</div>
                <div className="flex items-center space-x-1">
                  <Circle size={6} className={selectedConversation.isOnline ? 'text-green-400 fill-current' : 'text-gray-400 fill-current'} />
                  <span className="text-xs text-white/60">
                    {selectedConversation.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 bg-green-500/20 hover:bg-green-500/30 rounded-full"
            >
              <Phone size={12} className="text-green-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 bg-blue-500/20 hover:bg-blue-500/30 rounded-full"
            >
              <Video size={12} className="text-blue-400" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto watch-scroll p-4 space-y-3">
          {selectedConversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-xl text-xs ${
                  message.isUser
                    ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm'
                    : 'bg-white/10 text-white border border-white/20 rounded-bl-sm'
                }`}
              >
                <div>{message.text}</div>
                <div className={`text-xs mt-1 ${
                  message.isUser ? 'text-white/70' : 'text-white/50'
                }`}>
                  {message.timestamp.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-3 py-2 text-white text-xs placeholder-white/50"
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="w-8 h-8 p-0 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 rounded-full"
            >
              <Send size={12} className="text-white" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Conversations List
  return (
    <div className="watch-content-safe flex flex-col h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('features')}
            className="rounded-full w-8 h-8 p-0 bg-white/10 hover:bg-white/20"
          >
            <ArrowLeft size={14} className="text-white" />
          </Button>
          <h2 className="text-lg font-bold text-white">Messages</h2>
          {totalUnread > 0 && (
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">{totalUnread}</span>
            </div>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto watch-scroll space-y-2">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => openConversation(conversation)}
            className="glass-bg rounded-lg p-3 cursor-pointer hover:bg-white/15 transition-all border border-white/20"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{conversation.avatar}</span>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${
                  conversation.isOnline ? 'bg-green-400' : 'bg-gray-400'
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-white truncate">
                    {conversation.name}
                  </div>
                  <div className="text-xs text-white/50">
                    {formatTimestamp(conversation.timestamp)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className={`text-xs truncate ${
                    conversation.unreadCount > 0 ? 'text-white font-medium' : 'text-white/60'
                  }`}>
                    {conversation.lastMessage}
                  </div>
                  
                  {conversation.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center ml-2">
                      <span className="text-xs text-white font-bold">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="flex justify-center space-x-6 py-3 border-t border-white/10 mt-2">
        <div className="text-center">
          <div className="text-sm font-bold text-primary">
            {totalUnread}
          </div>
          <div className="text-xs text-white/60">Unread</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-green-400">
            {conversations.filter(c => c.isOnline).length}
          </div>
          <div className="text-xs text-white/60">Online</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-white">
            {conversations.length}
          </div>
          <div className="text-xs text-white/60">Total</div>
        </div>
      </div>

      {/* Home Button */}
      <div className="flex justify-center pt-2">
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

export default MessagesScreen;