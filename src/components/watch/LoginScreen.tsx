
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, Lock } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [code, setCode] = useState('');
  const [generatedCode] = useState(() => 
    Math.floor(100000 + Math.random() * 900000).toString()
  );

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-card to-background">
      {/* Login Icon */}
      <div className="mb-6 watch-slide-up">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center mb-4">
          <User size={24} className="text-primary" />
        </div>
        <h2 className="text-lg font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          SmartWatch AI
        </h2>
      </div>

      {/* Generated Code Display */}
      <div className="mb-6 text-center watch-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Lock size={14} className="text-accent" />
          <span className="text-sm text-muted-foreground">Authentication Code</span>
        </div>
        <div className="text-2xl font-mono font-bold bg-gradient-to-r from-accent to-feature-fitness bg-clip-text text-transparent tracking-wider">
          {generatedCode}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Use this code to authenticate
        </div>
      </div>

      {/* Login Button */}
      <div className="watch-slide-up" style={{ animationDelay: '400ms' }}>
        <Button
          onClick={onLogin}
          className="rounded-full px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Login to Watch
        </Button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center">
        <div className="text-xs text-muted-foreground/60">SmartWatch AI v2.1</div>
      </div>
    </div>
  );
};

export default LoginScreen;
