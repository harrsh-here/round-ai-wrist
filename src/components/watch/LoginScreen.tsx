
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, Lock, ChevronDown } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [code, setCode] = useState('');
  const [generatedCode] = useState(() => 
    Math.floor(100000 + Math.random() * 900000).toString()
  );

  return (
    <div className="relative w-full h-full rounded-full overflow-hidden">
      {/* Scrollable Content */}
      <div className="h-full overflow-y-auto watch-scroll rounded-full" style={{ clipPath: 'circle(50%)' }}>
        <div className="flex flex-col items-center justify-start p-2 pt-3 min-h-full">
          {/* Login Icon */}
          <div className="mb-3 text-center watch-slide-up">
            <div className="w-16 h-16 rounded-full dark-glass-bg border-2 border-primary/40 flex items-center justify-center mb-2 mx-auto">
              <LogIn size={28} className="text-primary" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">
              FuzNex
            </h1>
            <h2 className="text-sm text-white/70 mb-1">
              Verify authentication code
            </h2>
          </div>

          {/* Generated Code Display */}
          <div className="mb-5 text-center watch-slide-up dark-glass-bg rounded-2xl p-6 w-full max-w-[200px]" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Lock size={16} className="text-accent" />
              <span className="text-sm text-white/80">Auth Code</span>
            </div>
            <div className="text-2xl font-mono font-bold text-primary tracking-wider mb-3">
              {generatedCode}
            </div>
            <div className="text-xs text-white/60">
              Use this code to login
            </div>
          </div>

          {/* Scroll Indicator - Animated downward chevron */}
          <div className="flex flex-col items-center mb-4 watch-slide-up" style={{ animationDelay: '300ms' }}>
            <ChevronDown 
              size={24} 
              className="text-primary/70 animate-bounce" 
              style={{ 
                animation: 'bounce 2s infinite, pulse 2s ease-in-out infinite' 
              }} 
            />
          </div>

          {/* Login Button */}
          <div className="watch-slide-up mb-3" style={{ animationDelay: '400ms' }}>
            <Button
              onClick={onLogin}
              className="rounded-full px-10 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Login to Watch
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center pb-6">
            <div className="text-xs text-white/40 transform:scale-80">FuzNex AI SmartWatch v0.7</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
