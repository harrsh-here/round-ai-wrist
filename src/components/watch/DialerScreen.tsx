import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, PhoneCall, Home, User, Clock, Plus } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface DialerScreenProps {
  onNavigate: (screen: WatchScreen) => void;
}

const DialerScreen = ({ onNavigate }: DialerScreenProps) => {
  const [number, setNumber] = useState('');
  const [activeTab, setActiveTab] = useState<'dialer' | 'contacts' | 'recent'>('dialer');

  const contacts = [
    { name: 'Mom', number: '+1 234 567 8901', status: 'online' },
    { name: 'Dad', number: '+1 234 567 8902', status: 'offline' },
    { name: 'Sarah', number: '+1 234 567 8903', status: 'online' },
    { name: 'John', number: '+1 234 567 8904', status: 'busy' },
  ];

  const recentCalls = [
    { name: 'Mom', time: '2m ago', type: 'incoming' },
    { name: 'Sarah', time: '1h ago', type: 'outgoing' },
    { name: 'Unknown', time: '3h ago', type: 'missed' },
  ];

  const dialpadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  const handleNumberPress = (num: string) => {
    setNumber(prev => prev + num);
  };

  const handleCall = () => {
    if (number) {
      // Simulate call
      alert(`Calling ${number}...`);
      setNumber('');
    }
  };

  const handleClear = () => {
    setNumber(prev => prev.slice(0, -1));
  };

  return (
    <div className="watch-content-safe flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-center mb-3">
        <h2 className="text-sm font-semibold text-white">Phone</h2>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-3">
        <div className="glass-bg rounded-lg p-1 flex">
          {(['dialer', 'contacts', 'recent'] as const).map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs rounded-md transition-all ${
                activeTab === tab 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {tab === 'dialer' && <Phone size={12} className="mr-1" />}
              {tab === 'contacts' && <User size={12} className="mr-1" />}
              {tab === 'recent' && <Clock size={12} className="mr-1" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'dialer' && (
          <div className="flex flex-col h-full">
            {/* Number Display */}
            <div className="glass-bg rounded-xl p-3 mb-3 text-center">
              <div className="text-lg font-mono text-white min-h-[24px]">
                {number || 'Enter number'}
              </div>
            </div>

            {/* Dialpad */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {dialpadNumbers.flat().map((num) => (
                <Button
                  key={num}
                  variant="ghost"
                  onClick={() => handleNumberPress(num)}
                  className="h-10 glass-bg hover:bg-white/20 text-white font-semibold rounded-xl"
                >
                  {num}
                </Button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-3">
              <Button
                variant="ghost"
                onClick={handleClear}
                className="w-12 h-12 glass-bg hover:bg-white/20 rounded-full"
                disabled={!number}
              >
                <span className="text-white font-bold">⌫</span>
              </Button>
              <Button
                onClick={handleCall}
                disabled={!number}
                className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full shadow-lg"
              >
                <PhoneCall size={18} className="text-white" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-2 h-full overflow-y-auto">
            {contacts.map((contact, index) => (
              <div key={index} className="glass-bg rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <User size={14} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{contact.name}</div>
                    <div className="text-xs text-white/60">{contact.number}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    contact.status === 'online' ? 'bg-green-400' :
                    contact.status === 'busy' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`} />
                  <Button
                    size="sm"
                    className="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full p-0"
                  >
                    <PhoneCall size={12} className="text-white" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="space-y-2 h-full overflow-y-auto">
            {recentCalls.map((call, index) => (
              <div key={index} className="glass-bg rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    call.type === 'incoming' ? 'bg-green-400' :
                    call.type === 'outgoing' ? 'bg-blue-400' : 'bg-red-400'
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-white">{call.name}</div>
                    <div className="text-xs text-white/60">{call.time}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full p-0"
                >
                  <PhoneCall size={12} className="text-white" />
                </Button>
              </div>
            ))}
          </div>
        )}
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

export default DialerScreen;