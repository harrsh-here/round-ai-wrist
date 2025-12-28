import React, { useEffect, useState } from 'react';
import { LogIn, Lock, ChevronDown } from 'lucide-react';
import axios from 'axios';

interface LoginScreenProps {
 onLogin: (token: string) => void;
}

interface CodeResponse {
  code: string;
  expires_at: string;
}

interface StatusResponse {
  linked: boolean;
  token: string;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [code, setCode] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [linked, setLinked] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);

  const requestCode = async () => {
    try {
      //const res = await axios.post<CodeResponse>('http://localhost:3000/api/pairing/request');
      //ChangeLOCAL TO GLOBAl
      const response = await axios.post<CodeResponse>('https://fuznex.onrender.com/api/pairing/request');
      setCode(response.data.code);
      setExpiresAt(new Date(response.data.expires_at));
      setCountdown(Math.max(Math.floor((new Date(response.data.expires_at).getTime() - new Date().getTime()) / 1000), 0));
      setLinked(false);
      setRequested(true);
      setError(null);
    } catch (err) {
      setError('Failed to request code. Try again.');
    }
  };

  // Poll backend
  useEffect(() => {
    if (!code) return;
    const interval = setInterval(async () => {
      try {
        //const res = await axios.get<StatusResponse>(`http://localhost:3000/api/pairing/status/${code}`);
        //ChangeLOCAL TO GLOBAl
        const response = await axios.get<StatusResponse>(`https://fuznex.onrender.com/api/pairing/status/${code}`);
        if (response.data.linked) {
          setLinked(true);
          setLoading(true);
          localStorage.setItem('watchToken', response.data.token);

          setTimeout(() => {
            setLoading(false);
           // onLogin();
          }, 1500);

          clearInterval(interval);
        }
      } catch (err) {
        setError('Polling error. Retrying...');
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [code]);

  // Countdown / auto-request new code
  useEffect(() => {
    if (!expiresAt) return;
    const timer = setInterval(() => {
      const diff = Math.floor((expiresAt.getTime() - new Date().getTime()) / 1000);
      setCountdown(diff);
      if (diff <= 0) {
        clearInterval(timer);
        requestCode();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="relative w-full h-full rounded-full overflow-hidden">
      <div className="h-full overflow-y-auto watch-scroll rounded-full" style={{ clipPath: 'circle(50%)' }}>
        <div className="flex flex-col items-center justify-start p-2 pt-3 min-h-full">

          {/* Header */}
          <div className="mb-3 text-center watch-slide-up">
            <div className="w-16 h-16 rounded-full dark-glass-bg border-2 border-primary/40 flex items-center justify-center mb-2 mx-auto">
              <LogIn size={28} className="text-primary" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">FuzNex</h1>
            <h2 className="text-sm text-white/70 mb-1">Verify authentication code</h2>
          </div>

          {/* Auth Code Card */}
          <div
            onClick={() => !requested && requestCode()}
            className={`mb-5 text-center watch-slide-up dark-glass-bg rounded-2xl p-6 w-full max-w-[200px]
              flex flex-col items-center justify-center
              cursor-pointer
              transition-all duration-500
              ${linked ? 'scale-105 shadow-lg' : 'hover:scale-105 hover:shadow-md'}
            `}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Lock size={16} className="text-accent" />
              <span className="text-sm text-white/80">Auth Code</span>
            </div>
            <div className="text-1xl font-mono font-bold text-primary mb-3">
              {requested ? code : 'Click to request code'}
            </div>
            <div className="text-xs text-white/60">
              {linked
                ? 'Authenticated'
                : requested
                  ? countdown > 0
                    ? `Waiting for phone… (${formatCountdown(countdown)})`
                    : 'Expired'
                  : ''}
            </div>
          </div>

          {error && <div className="text-xs text-red-400 mb-2 animate-fade-in">{error}</div>}

          <div className="text-center pb-6">
            <div className="text-xs text-white/40">FuzNex AI SmartWatch v0.7</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
