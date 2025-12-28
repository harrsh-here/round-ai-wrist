import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, MessageSquare, Send, ArrowLeft, User, Phone, Video, MoreVertical } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface MessagesScreenProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isRead: boolean;
  isFromMe: boolean;
  avatar: string;
  color: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  avatar: string;
  color: string;
  isOnline: boolean;
  messages: Message[];
}

const MessagesScreen = ({ onNavigate }: MessagesScreenProps) => {
  const [activeView, setActiveView] = useState<'list' | 'chat'>('list');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Mom',
      lastMessage: 'Don\'t forget to take your vitamins!',
      time: '2m ago',
      unreadCount: 2,
      avatar: 'M',
      color: '#ff6b6b',
      isOnline: true,
      messages: [
        {
          id: '1',
          sender: 'Mom',
          content: 'How was your workout today?',
          time: '10:30 AM',
          isRead: true,
          isFromMe: false,
          avatar: 'M',
          color: '#ff6b6b'
        },
        {
          id: '2',
          sender: 'You',
          content: 'It was great! Did 30 minutes on the treadmill.',
          time: '10:32 AM',
          isRead: true,
          isFromMe: true,
          avatar: 'Y',
          color: '#4ecdc4'
        },
        {
          id: '3',
          sender: 'Mom',
          content: 'Don\'t forget to take your vitamins!',
          time: '10:35 AM',
          isRead: false,
          isFromMe: false,
          avatar: 'M',
          color: '#ff6b6b'
        }
      ]
    },
    {
      id: '2',
      name: 'Sarah',
      lastMessage: 'See you at the coffee shop!',
      time: '1h ago',
      unreadCount: 0,
      avatar: 'S',
      color: '#45b7d1',
      isOnline: true,
      messages: [
        {
          id: '1',
          sender: 'Sarah',
          content: 'Hey! Are we still on for coffee later?',
          time: '2:15 PM',
          isRead: true,
          isFromMe: false,
          avatar: 'S',
          color: '#45b7d1'
        },
        {
          id: '2',
          sender: 'You',
          content: 'Yes! 4 PM at the usual place?',
          time: '2:20 PM',
          isRead: true,
          isFromMe: true,
          avatar: 'Y',
          color: '#4ecdc4'
        },
        {
          id: '3',
          sender: 'Sarah',
          content: 'See you at the coffee shop!',
          time: '2:22 PM',
          isRead: true,
          isFromMe: false,
          avatar: 'S',
          color: '#45b7d1'
        }
      ]
    },
    {
      id: '3',
      name: 'Dad',
      lastMessage: 'How\'s work going?',
      time: '3h ago',
      unreadCount: 1,
      avatar: 'D',
      color: '#96ceb4',
      isOnline: false,
      messages: [
        {
          id: '1',
          sender: 'Dad',
          content: 'How\'s work going?',
          time: '12:45 PM',
          isRead: false,
          isFromMe: false,
          avatar: 'D',
          color: '#96ceb4'
        }
      ]
    },
    {
      id: '4',
      name: 'John',
      lastMessage: 'Thanks for the help!',
      time: '1d ago',
      unreadCount: 0,
      avatar: 'J',
      color: '#feca57',
      isOnline: false,
      messages: [
        {
          id: '1',
          sender: 'You',
          content: 'Here are the files you requested.',
          time: 'Yesterday',
          isRead: true,
          isFromMe: true,
          avatar: 'Y',
          color: '#4ecdc4'
        },
        {
          id: '2',
          sender: 'John',
          content: 'Thanks for the help!',
          time: 'Yesterday',
          isRead: true,
          isFromMe: false,
          avatar: 'J',
          color: '#feca57'
        }
      ]
    }
  ]);

  // Simulate new messages
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        'Hey there!',
        'How are you doing?',
        'Did you see the news?',
        'Let\'s catch up soon!',
        'Hope you\'re having a great day!'
      ];

      const randomSenders = ['Emma', 'Alex', 'Mike', 'Lisa'];
      const randomSender = randomSenders[Math.floor(Math.random() * randomSenders.length)];
      const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];

      // Check if conversation exists, if not create new one
      setConversations(prev => {
        const existingConv = prev.find(c => c.name === randomSender);
        if (existingConv) {
          return prev.map(conv => 
            conv.name === randomSender 
              ? {
                  ...conv,
                  lastMessage: randomMessage,
                  time: 'now',
                  unreadCount: conv.unreadCount + 1,
                  messages: [...conv.messages, {
                    id: Date.now().toString(),
                    sender: randomSender,
                    content: randomMessage,
                    time: 'now',
                    isRead: false,
                    isFromMe: false,
                    avatar: randomSender[0],
                    color: '#a55eea'
                  }]
                }
              : conv
          );
        } else {
          const newConv: Conversation = {
            id: Date.now().toString(),
            name: randomSender,
            lastMessage: randomMessage,
            time: 'now',
            unreadCount: 1,
            avatar: randomSender[0],
            color: '#a55eea',
            isOnline: Math.random() > 0.5,
            messages: [{
              id: Date.now().toString(),
              sender: randomSender,
              content: randomMessage,
              time: 'now',
              isRead: false,
              isFromMe: false,
              avatar: randomSender[0],
              color: '#a55eea'
            }]
          };
          return [newConv, ...prev];
        }
      });
    }, 20000); // New message every 20 seconds

    return () => clearInterval(interval);
  }, []);

  const openConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setActiveView('chat');
    
    // Mark messages as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { 
              ...conv, 
              unreadCount: 0,
              messages: conv.messages.map(msg => ({ ...msg, isRead: true }))
            }
          : conv
      )
    );
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      isRead: true,
      isFromMe: true,
      avatar: 'Y',
      color: '#4ecdc4'
    };

    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? {
              ...conv,
              lastMessage: newMessage,
              time: 'now',
              messages: [...conv.messages, message]
            }
          : conv
      )
    );

    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message]
    } : null);

    setNewMessage('');
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  if (activeView === 'chat' && selectedConversation) {
    return (
      <div className="relative w-full h-full flex bg-gradient-to-br from-blue-950 to-black gradient-flow">
        {/* Chat Header */}
        <div className="absolute left-0 right-0 top-0 z-10 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveView('list')}
              className="relative left-[80px] rounded-full w-8 h-8 p-0 hover:bg-white/20"
            >
              <ArrowLeft size={14} className="text-white" />
            </Button>
           
            <div className="flex items-center justify-center w-full" style={{ marginLeft: "-40px" }}>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center border border-white/30"
                style={{ backgroundColor: `${selectedConversation.color}40` }}
              >
                <span className="text-xs font-bold text-white">{selectedConversation.avatar}</span>
              </div>
              <div className="ml-3">
                <div className="text-sm font-semibold text-white">{selectedConversation.name}</div>
                <div className="text-xs text-white/60">
                  {selectedConversation.isOnline ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
            {/* <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 rounded-full p-0 hover:bg-white/20"
              >
                <Phone size={12} className="text-white" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 rounded-full p-0 hover:bg-white/20"
              >
                <Video size={12} className="text-white" />
              </Button>
            </div> */}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto watch-scroll pt-20 pb-16 px-4">
          <div className="space-y-3">
            {selectedConversation.messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.isFromMe ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-3 py-2 rounded-lg text-xs ${
                      message.isFromMe
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-white/15 text-white rounded-bl-sm backdrop-blur-sm'
                    }`}
                  >
                    {message.content}
                  </div>
                  <div className={`text-xs text-white/50 mt-1 ${
                    message.isFromMe ? 'text-right' : 'text-left'
                  }`}>
                    {message.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="absolute bottom-0 w-[210px] left-[70px] right-0 p-4 bg-transparent">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-white/15 rounded-full px-3 py-2 backdrop-blur-sm">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                    // Auto scroll to latest message
                    const messagesContainer = document.querySelector('.watch-scroll');
                    if (messagesContainer) {
                      setTimeout(() => {
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                      }, 100);
                    }
                  }
                }}
                placeholder="Type a message..."
                className="w-full bg-transparent text-white text-xs placeholder-white/60 outline-none"
              />
            </div>
            <Button
              onClick={() => {
                sendMessage();
                // Auto scroll to latest message
                const messagesContainer = document.querySelector('.watch-scroll');
                if (messagesContainer) {
                  setTimeout(() => {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                  }, 100);
                }
              }}
              disabled={!newMessage.trim()}
              className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full p-0 disabled:opacity-50"
            >
              <Send size={12} className="text-white" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-transparent backdrop-blur-sm">
        <div className="text-center py-4 watch-slide-up">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('features')}
            className="absolute left-[120px] top-[315px] -translate-y-1/2 rounded-full w-8 h-8 p-0 glass-bg hover:bg-white/15 z-20"
          >
            <ArrowLeft size={14} className="text-white" />
          </Button>
          <div className="flex items-center justify-center space-x-2">
            <MessageSquare size={16} className="text-blue-400" />
            <h2 className="text-lg font-bold text-white">Messages</h2>
            {totalUnread > 0 && (
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{totalUnread}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto watch-scroll pt-20 pb-16 px-4">
        <div className="space-y-2">
          {conversations.map((conversation, index) => (
            <div
              key={conversation.id}
              onClick={() => openConversation(conversation)}
              className="glass-bg rounded-lg p-3 cursor-pointer transition-all hover:bg-white/20 watch-glow"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-white/30"
                    style={{ backgroundColor: `${conversation.color}40` }}
                  >
                    <span className="text-sm font-bold text-white">{conversation.avatar}</span>
                  </div>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-semibold text-white truncate">
                      {conversation.name}
                    </div>
                    <div className="text-xs text-white/50 flex-shrink-0 ml-2">
                      {conversation.time}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/70 truncate flex-1">
                      {conversation.lastMessage}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
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
      </div>

      {/* Back Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
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