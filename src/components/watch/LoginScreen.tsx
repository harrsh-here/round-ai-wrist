
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, Lock, ChevronDown, RefreshCw, Loader2 } from 'lucide-react';
import { requestPairingCode, checkPairingStatus, saveWatchToken } from '@/api/api';

interface LoginScreenProps {
  onLogin: () => void;
}

type LoginState = 'loading' | 'showing-code' | 'error';

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [loginState, setLoginState] = useState<LoginState>('loading');
  const [code, setCode] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Request a new pairing code from backend
  const fetchCode = useCallback(async () => {
    setLoginState('loading');
    setErrorMsg('');

    // Clear any existing intervals
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    try {
      const data = await requestPairingCode();
      const expiry = new Date(data.expires_at);

      setCode(data.code);
      setExpiresAt(expiry);
      setLoginState('showing-code');

      // Start countdown timer
      countdownRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.floor((expiry.getTime() - Date.now()) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          if (pollingRef.current) clearInterval(pollingRef.current);
          setLoginState('error');
          setErrorMsg('Code expired');
        }
      }, 1000);

      // Start polling for status every 3 seconds
      pollingRef.current = setInterval(async () => {
        try {
          const status = await checkPairingStatus(data.code);
          if (status.linked && status.token) {
            // Success! Save token and log in
            saveWatchToken(status.token);
            if (pollingRef.current) clearInterval(pollingRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
            onLogin();
          }
        } catch {
          // Silently continue polling — transient network errors are fine
        }
      }, 3000);
    } catch {
      setLoginState('error');
      setErrorMsg('Could not connect to server');
    }
  }, [onLogin]);

  // Fetch code on mount
  useEffect(() => {
    fetchCode();
  }, [fetchCode]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

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

          {/* Code Display Area */}
          <div className="mb-5 text-center watch-slide-up dark-glass-bg rounded-2xl p-6 w-full max-w-[200px]" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Lock size={16} className="text-accent" />
              <span className="text-sm text-white/80">Auth Code</span>
            </div>

            {loginState === 'loading' && (
              <>
                <div className="flex items-center justify-center mb-3">
                  <Loader2 size={24} className="text-primary animate-spin" />
                </div>
                <div className="text-xs text-white/60">
                  Generating code...
                </div>
              </>
            )}

            {loginState === 'showing-code' && (
              <>
                <div className="text-2xl font-mono font-bold text-primary tracking-wider mb-3">
                  {code}
                </div>
                <div className="text-xs text-white/60">
                  Enter this code on your phone
                </div>
                <div className="text-xs text-accent mt-2 font-mono">
                  Expires in {formatTime(timeLeft)}
                </div>
              </>
            )}

            {loginState === 'error' && (
              <>
                <div className="text-sm text-red-400 mb-3">
                  {errorMsg}
                </div>
                <Button
                  onClick={fetchCode}
                  variant="ghost"
                  className="rounded-full px-4 py-2 text-xs text-primary hover:bg-primary/10"
                >
                  <RefreshCw size={14} className="mr-1" />
                  Get New Code
                </Button>
              </>
            )}
          </div>

          {/* Scroll Indicator - Animated downward chevron */}
          {loginState === 'showing-code' && (
            <div className="flex flex-col items-center mb-4 watch-slide-up" style={{ animationDelay: '300ms' }}>
              <ChevronDown
                size={24}
                className="text-primary/70 animate-bounce"
                style={{
                  animation: 'bounce 2s infinite, pulse 2s ease-in-out infinite'
                }}
              />
            </div>
          )}

          {/* Login Button — manual fallback */}
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
