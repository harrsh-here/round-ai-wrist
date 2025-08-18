
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
      <div className="mb-4 text-center watch-slide-up">
        <div className="w-12 h-12 rounded-full glass-bg border-2 border-primary/30 flex items-center justify-center mb-3 mx-auto">
          <LogIn size={20} className="text-primary" />
        </div>
        <h1 className="text-base font-bold text-white mb-1">
          Login to FuzNex
        </h1>
        <h2 className="text-xs text-white/70">
          Verify the authentication code
        </h2>
      </div>

      {/* Generated Code Display */}
      <div className="mb-4 text-center watch-slide-up glass-bg rounded-xl p-3 w-full max-w-[160px]" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Lock size={12} className="text-accent" />
          <span className="text-xs text-white/80">Auth Code</span>
        </div>
        <div className="text-xl font-mono font-bold text-white tracking-wider mb-1">
          {generatedCode}
        </div>
        <div className="text-xs text-white/60">
          Use this code
        </div>
      </div>

      {/* Login Button */}
      <div className="watch-slide-up mb-4" style={{ animationDelay: '400ms' }}>
        <Button
          onClick={onLogin}
          className="rounded-full px-6 py-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Login to Watch
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center">
        <div className="text-xs text-white/40">FuzNex AI SmartWatch v2.1</div>
      </div>
    </div>
  );
};

export default LoginScreen;
