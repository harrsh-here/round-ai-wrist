
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, Lock } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [code, setCode] = useState('');
  const [generatedCode] = useState(() => 
    Math.floor(100000 + Math.random() * 900000).toString()
  );

  return (
    <div className="watch-content-safe flex flex-col items-center justify-center">
      {/* Login Icon */}
      <div className="text-center watch-slide-up mb-6">
        <div className="w-16 h-16 rounded-full dark-glass-bg border-2 border-primary/40 flex items-center justify-center mb-4 mx-auto">
          <LogIn size={24} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">
          FuzNex
        </h1>
        <h2 className="text-sm text-white/70">
          Verify authentication code
        </h2>
      </div>

      {/* Generated Code Display */}
      <div className="text-center watch-slide-up dark-glass-bg rounded-2xl p-4 w-full max-w-[180px] mb-6" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Lock size={14} className="text-accent" />
          <span className="text-sm text-white/80">Auth Code</span>
        </div>
        <div className="text-2xl font-mono font-bold text-primary tracking-wider mb-2">
          {generatedCode}
        </div>
        <div className="text-xs text-white/60">
          Use this code to login
        </div>
      </div>

      {/* Login Button */}
      <div className="watch-slide-up" style={{ animationDelay: '400ms' }}>
        <Button
          onClick={onLogin}
          className="rounded-full px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 button-press active:scale-95"
        >
          Login to Watch
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center mt-6">
        <div className="text-xs text-white/40">FuzNex AI SmartWatch v2.1</div>
      </div>
    </div>
  );
};

export default LoginScreen;
