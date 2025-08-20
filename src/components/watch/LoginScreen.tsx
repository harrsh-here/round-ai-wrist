
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
    <div className="watch-content-safe flex flex-col items-center justify-center p-4">
      {/* Login Icon - Better positioned */}
      <div className="mb-6 text-center watch-slide-up">
        <div className="w-14 h-14 rounded-full glass-bg border-2 border-primary/30 flex items-center justify-center mb-4 mx-auto">
          <LogIn size={24} className="text-primary" />
        </div>
        <h1 className="text-lg font-bold text-white mb-2">
          Login to FuzNex
        </h1>
        <h2 className="text-sm text-white/70">
          Verify the authentication code
        </h2>
      </div>

      {/* Generated Code Display - Better spacing */}
      <div className="mb-6 text-center watch-slide-up glass-bg rounded-xl p-4 w-full max-w-[180px]" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Lock size={14} className="text-accent" />
          <span className="text-sm text-white/80">Auth Code</span>
        </div>
        <div className="text-2xl font-mono font-bold text-white tracking-wider mb-2">
          {generatedCode}
        </div>
        <div className="text-sm text-white/60">
          Use this code
        </div>
      </div>

      {/* Login Button - Better positioning */}
      <div className="watch-slide-up" style={{ animationDelay: '400ms' }}>
        <Button
          onClick={onLogin}
          className="rounded-full px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Login to Watch
        </Button>
      </div>

      {/* Footer - Better positioned */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-xs text-white/40">FuzNex AI SmartWatch v2.1</div>
      </div>
    </div>
  );
};

export default LoginScreen;
