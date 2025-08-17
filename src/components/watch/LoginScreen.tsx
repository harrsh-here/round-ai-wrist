
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
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900/90 via-blue-950/80 to-slate-900/90">
      {/* Login Icon */}
      <div className="mb-6 text-center watch-slide-up">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
          <LogIn size={28} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold text-white mb-1">
          Login to FuzNex
        </h1>
        <h2 className="text-sm text-white/70">
          Verify the authentication code
        </h2>
      </div>

      {/* Generated Code Display */}
      <div className="mb-8 text-center watch-slide-up backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Lock size={16} className="text-accent" />
          <span className="text-sm text-white/80">Authentication Code</span>
        </div>
        <div className="text-3xl font-mono font-bold text-white tracking-wider mb-2">
          {generatedCode}
        </div>
        <div className="text-xs text-white/60">
          Use this code to authenticate
        </div>
      </div>

      {/* Login Button */}
      <div className="watch-slide-up mb-8" style={{ animationDelay: '400ms' }}>
        <Button
          onClick={onLogin}
          className="rounded-full px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
        >
          Login to Watch
        </Button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center">
        <div className="text-xs text-white/40">FuzNex AI SmartWatch v2.1</div>
      </div>
    </div>
  );
};

export default LoginScreen;
