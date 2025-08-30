import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, PhoneCall, Home, User, Clock, PhoneOff, ArrowLeft } from 'lucide-react';

interface DialerScreenProps {
  onNavigate: (screen: string) => void;
}

const DialerScreen = ({ onNavigate }: DialerScreenProps) => {
  const [number, setNumber] = useState('');
  const [activeTab, setActiveTab] = useState<'dialer' | 'contacts' | 'recent'>('dialer');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [callDuration, setCallDuration] = useState('00:00');
  const [currentCallingContact, setCurrentCallingContact] = useState<{name: string, number: string} | null>(null);

  const contacts = [
    { name: 'Mom', number: '+91 234 567 8901', status: 'online', color: '#ff6b6b' },
    { name: 'Dad', number: '+91 234 567 8902', status: 'offline', color: '#4ecdc4' },
    { name: 'Sarah', number: '+91 234 567 8903', status: 'online', color: '#45b7d1' },
    { name: 'John', number: '+91 234 567 8904', status: 'busy', color: '#96ceb4' },
    { name: 'Emma', number: '+91 98765 43210', status: 'online', color: '#feca57' },
    { name: 'Alex', number: '+91 123 456 7890', status: 'offline', color: '#ff9ff3' },
  ];

  const recentCalls = [
    { name: 'Mom', number: '+91 234 567 8901', time: '2m ago', type: 'incoming' },
    { name: 'Sarah', number: '+91 234 567 8903', time: '1h ago', type: 'outgoing' },
    { name: 'Unknown', number: '+91 87654 32109', time: '3h ago', type: 'missed' },
  ];

  const dialpadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  // Find contact by number
  const findContactByNumber = (phoneNumber: string) => {
    // Clean number for matching (remove spaces, dashes, etc.)
    const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    return contacts.find(contact => {
      const cleanContactNumber = contact.number.replace(/[\s\-\(\)]/g, '');
      return cleanContactNumber.includes(cleanNumber) || cleanNumber.includes(cleanContactNumber);
    });
  };

  // Get display name for number
  const getDisplayName = (phoneNumber: string) => {
    const contact = findContactByNumber(phoneNumber);
    return contact ? contact.name : null;
  };

  // Format phone number with country code
  const formatPhoneNumber = (phoneNumber: string) => {
    if (phoneNumber.startsWith('+')) return phoneNumber;
    // Add default country code if not present
    if (phoneNumber.length === 10) {
      return `+91 ${phoneNumber}`;
    }
    return phoneNumber;
  };

  // Call duration timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive && callStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - callStartTime.getTime()) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        setCallDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive, callStartTime]);

  const handleNumberPress = (num: string) => {
    setNumber(prev => prev + num);
  };

  const handleCall = (phoneNumber?: string, contactName?: string) => {
    const numberToCall = phoneNumber || number;
    if (numberToCall) {
      const formattedNumber = formatPhoneNumber(numberToCall);
      const displayName = contactName || getDisplayName(formattedNumber) || 'Unknown';
      
      setCurrentCallingContact({
        name: displayName,
        number: formattedNumber
      });
      setIsCallActive(true);
      setCallStartTime(new Date());
      setCallDuration('00:00');
      if (!phoneNumber) setNumber(''); // Only clear if dialing from dialpad
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCallStartTime(null);
    setCallDuration('00:00');
    setCurrentCallingContact(null);
  };

  const handleClear = () => {
    setNumber(prev => prev.slice(0, -1));
  };

  // Call Screen
  if (isCallActive && currentCallingContact) {
    const contact = contacts.find(c => c.name === currentCallingContact.name);
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4 overflow-y-auto">
        {/* Animated call background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 via-blue-500/20 to-purple-500/30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        </div>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-2 border-white/20 rounded-full animate-ping" />
          <div className="absolute w-24 h-24 border-2 border-white/30 rounded-full animate-ping animation-delay-1000" />
        </div>
        
        {/* Caller info */}
        <div className="text-center mb-8 z-10">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mb-4 mx-auto shadow-2xl"
            style={{ 
              backgroundColor: contact?.color ? `${contact.color}40` : '#ffffff40',
              border: `2px solid ${contact?.color || '#ffffff60'}`
            }}
          >
            <User size={36} className="text-white drop-shadow-lg" />
          </div>
          <div className="text-xl font-bold text-white mb-2 drop-shadow-lg">
            {currentCallingContact.name}
          </div>
          <div className="text-sm text-white/80 mb-4 font-medium">
            {currentCallingContact.number}
          </div>
          <div className="text-2xl font-mono text-white drop-shadow-lg">
            {callDuration}
          </div>
        </div>

        {/* End call button */}
        <Button
          onClick={handleEndCall}
          className="w-18 h-18 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200"
        >
          <PhoneOff size={28} className="text-white" />
        </Button>

        {/* Back to home during call
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="absolute bottom-4 rounded-full w-10 h-10 p-0 bg-white/15 backdrop-blur-md border border-white/20 hover:bg-white/25 transition-all"
        >
          <Home size={16} className="text-white" />
        </Button> */}
      </div>
    );
  }

  // Get current dialed number display info
  const currentDisplayName = number ? getDisplayName(number) : null;
  const formattedCurrentNumber = number ? formatPhoneNumber(number) : '';

  return (
    <div className="  relative w-full h-full flex flex-col items-center justify-center p-3 overflow-hidden">
      {/* Colorful background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
      
      {/* Header */}
      <div className="w-full text-center mt-0 mb-2 relative z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('features')}
          className="absolute left-[90px] top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-white/20 hover:bg-white/20"
        >
          <ArrowLeft size={14} className="text-white" />
        </Button>
        <Phone size={18} className="text-blue-400 mx-auto mb-1" />
        <h2 className="text-sm font-bold text-white">Phone</h2>
      </div>

      {/* Colorful Tabs */}
      <div className="flex justify-center mb-1">
        <div className="bg-white/15 backdrop-blur-md rounded-full p-1 flex border border-white/20" style={{minWidth: '140px'}}>
          {(['dialer', 'contacts', 'recent'] as const).map((tab, index) => {
            const colors = ['bg-green-500/30', 'bg-blue-500/30', 'bg-purple-500/30'];
            return (
              <Button
                key={tab}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={`w-17 h-6 rounded-full transition-all flex items-center justify-center mx-1 ${
                  activeTab === tab 
                    ? `${colors[index]} text-white shadow-md border border-white/30` 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {activeTab === tab ? (
                  <div className="flex items-center text-[8px]">
                    {tab === 'dialer' && <Phone size={6} className="mr-0.5" />}
                    {tab === 'contacts' && <User size={6} className="mr-0.5" />}
                    {tab === 'recent' && <Clock size={6} className="mr-0.5" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </div>
                ) : (
                  <>
                    {tab === 'dialer' && <Phone size={10} />}
                    {tab === 'contacts' && <User size={10} />}
                    {tab === 'recent' && <Clock size={10} />}
                  </>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full max-w-[250px] relative z-10">
        {activeTab === 'dialer' && (
          <div className="flex flex-col h-full">
            {/* Enhanced Number Display */}
            <div className="bg-white/15 backdrop-blur-md rounded-lg p-1.5 mb-1 text-center border border-white/20">
              {currentDisplayName && (
                <div className="text-[10px] font-bold text-blue-400 mb-0.5">
                  {currentDisplayName}
                </div>
              )}
              <div className="text-[10px] font-mono text-white min-h-[12px] truncate">
                {formattedCurrentNumber || number || 'Enter number'}
              </div>
            </div>

            {/* Static Dialpad */}
            <div className="relative left-[0px] grid grid-cols-3 gap-1 mb-2 py-2">
              {dialpadNumbers.flat().map((num) => (
                <Button
                  key={num}
                  variant="ghost"
                  onClick={() => handleNumberPress(num)}
                  className="h-8 w-20 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-lg backdrop-blur-md border border-white/20 transition-all"
                >
                  {num}
                </Button>
              ))}
            </div>

            {/* Repositioned Action Buttons */}
            <div className="flex justify-between items-center px-1 mt-1">
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('home')}
                className=" relative left-[50px] top-[10px] w-8 h-8 bg-gray-500/20 hover:bg-gray-500/30 rounded-full backdrop-blur-md border border-white/20 transition-all -mt-3 p-2"
              >
                <Home size={12} className="text-white" />
              </Button>
              <Button
                onClick={() => handleCall()}
                disabled={!number}
                className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full shadow-lg disabled:opacity-50 transition-all -mt-3 p-2"
              >
                <PhoneCall size={14} className="text-white" />
              </Button>
              <Button
                variant="ghost"
                onClick={handleClear}
                className="relative right-[50px] top-[10px]  w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-full backdrop-blur-md border border-white/20 transition-all -mt-3 p-1"
                disabled={!number}
              >
                <span className="text-white text-sm">⌫</span>
              </Button>
              
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div 
            className="space-y-2 h-[250px] overflow-y-auto watch-scroll"
            ref={(el) => {
              if (el) {
                // Auto scroll animation on mount
                const startScroll = () => {
                  // Initial delay before starting animation
                  setTimeout(() => {
                    // Scroll down smoothly
                    el.scrollTo({
                      top: el.scrollHeight,
                      behavior: 'smooth'
                    });
                    
                    // Scroll back up after 500ms
                    setTimeout(() => {
                      el.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      });
                    }, 500);
                  }, 100);
                };
                startScroll();
              }
            }}
          >
            {contacts.map((contact, index) => (
              <div key={index} className="bg-white/15 backdrop-blur-md rounded-lg p-2 flex items-center mt-5 justify-between border border-white/20">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border border-white/30"
                    style={{ backgroundColor: `${contact.color}40` }}
                  >
                    <User size={10} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1 ">
                    <div className="text-xs font-bold text-white truncate">{contact.name}</div>
                    <div className="text-[9px] text-white/70 truncate">{contact.number}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mb-3 flex-shrink-0">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    contact.status === 'online' ? 'bg-green-400' :
                    contact.status === 'busy' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`} />
                  <Button
                    size="sm"
                    onClick={() => handleCall(contact.number, contact.name)}
                    className="w-6 h-6 bg-green-500 hover:bg-green-600 rounded-full p-0 shadow-md transition-all"
                  >
                    <PhoneCall size={10} className="text-white" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="space-y-1.5 h-[250px] overflow-y-auto watch-scroll ">
            {recentCalls.map((call, index) => (
              <div key={index} className="bg-white/15 backdrop-blur-md rounded-lg p-3 w-full flex items-center justify-between border border-white/20">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    call.type === 'incoming' ? 'bg-green-400' :
                    call.type === 'outgoing' ? 'bg-blue-400' : 
                    'bg-red-400 animate-pulse'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{call.name}</div>
                    <div className="text-[9px] text-white/70">{call.number}</div>
                    <div className="text-[9px] text-white/50">{call.time}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleCall(call.number, call.name)}
                  className="w-6 h-6 bg-green-500 hover:bg-green-600 rounded-full p-0 shadow-md transition-all flex-shrink-0"
                >
                  <PhoneCall size={10} className="text-white" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DialerScreen;