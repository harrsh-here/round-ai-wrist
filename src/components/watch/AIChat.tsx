import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, ArrowLeft, Send } from 'lucide-react';
import { watchChat, watchTranscribeAudio, WatchChatResponse } from '@/api/api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

type VoiceState = 'idle' | 'recording' | 'transcribing' | 'thinking' | 'speaking';

const AIChat = ({
  onNavigate,
  onBack,
  onNavigateWithAction,
}: {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
  onNavigateWithAction?: (screen: string, params?: any) => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! Tap the mic and speak, or type below.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [ttsEnabled, setTtsEnabled] = useState(() => localStorage.getItem('watch_tts') !== 'false');
  const [textInput, setTextInput] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [countdown, setCountdown] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const autoStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist TTS setting
  useEffect(() => {
    localStorage.setItem('watch_tts', ttsEnabled ? 'true' : 'false');
  }, [ttsEnabled]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, voiceState]);

  // ── Play ElevenLabs Base64 MP3 or browser TTS fallback ──
  const speakResponse = (text: string, audioBase64?: string | null) => {
    if (!ttsEnabled) return;

    if (audioBase64) {
      // Play ElevenLabs MP3
      try {
        const audioData = Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0));
        const blob = new Blob([audioData], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        setVoiceState('speaking');
        audio.onended = () => {
          setVoiceState('idle');
          URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
          setVoiceState('idle');
          URL.revokeObjectURL(url);
          // Fallback to browser TTS
          browserTTS(text);
        };
        audio.play().catch(() => browserTTS(text));
      } catch {
        browserTTS(text);
      }
    } else {
      browserTTS(text);
    }
  };

  // Pre-load browser voices (they load asynchronously in Chrome)
  const cachedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis?.getVoices() || [];
      const female =
        voices.find(v => v.name.toLowerCase().includes('zira')) || // Windows female
        voices.find(v => v.name.toLowerCase().includes('female') && v.lang.startsWith('en')) ||
        voices.find(v => v.name.toLowerCase().includes('samantha')) || // Mac female
        voices.find(v => v.name.includes('Google') && v.lang.startsWith('en-US')) ||
        voices.find(v => v.lang.startsWith('en-US'));
      if (female) cachedVoiceRef.current = female;
    };
    loadVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const browserTTS = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2;
    utterance.pitch = 1.1;
    utterance.lang = 'en-US';
    if (cachedVoiceRef.current) utterance.voice = cachedVoiceRef.current;
    setVoiceState('speaking');
    utterance.onend = () => setVoiceState('idle');
    utterance.onerror = () => setVoiceState('idle');
    window.speechSynthesis.speak(utterance);
  };

  // ── Execute AI Action ──
  const executeAction = (action: WatchChatResponse['action']) => {
    if (!action) return;

    if (action.type === 'navigate' && action.screen) {
      setTimeout(() => {
        if (onNavigateWithAction && action.params) {
          onNavigateWithAction(action.screen!, action.params);
        } else {
          onNavigate(action.screen!);
        }
      }, 1500);
    } else if (action.type === 'music') {
      const audio = (window as any).__fuznex_audio as HTMLAudioElement | undefined;
      if (audio) {
        switch (action.command) {
          case 'pause':
            audio.pause();
            break;
          case 'play':
            audio.play().catch(() => { });
            break;
          case 'next': {
            const currentIdx = JSON.parse(localStorage.getItem('watch_music_song') || '0');
            const nextIdx = (currentIdx + 1) % 5; // 5 songs in playlist
            localStorage.setItem('watch_music_song', JSON.stringify(nextIdx));
            // Trigger re-render by dispatching storage event
            window.dispatchEvent(new Event('storage'));
            // Force reload the audio source
            const playlist = [
              'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
              'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
              'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
              'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
              'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
            ];
            audio.src = playlist[nextIdx];
            audio.play().catch(() => { });
            break;
          }
          case 'previous': {
            const curIdx = JSON.parse(localStorage.getItem('watch_music_song') || '0');
            const prevIdx = curIdx <= 0 ? 4 : curIdx - 1;
            localStorage.setItem('watch_music_song', JSON.stringify(prevIdx));
            window.dispatchEvent(new Event('storage'));
            const pl = [
              'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
              'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
              'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
              'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
              'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
            ];
            audio.src = pl[prevIdx];
            audio.play().catch(() => { });
            break;
          }
          case 'toggle_shuffle':
            localStorage.setItem(
              'watch_music_shuffle',
              JSON.stringify(!JSON.parse(localStorage.getItem('watch_music_shuffle') || 'false'))
            );
            window.dispatchEvent(new Event('storage'));
            break;
          case 'toggle_repeat': {
            const modes = ['off', 'all', 'one'];
            const cur = localStorage.getItem('watch_music_repeat')?.replace(/"/g, '') || 'off';
            const nextMode = modes[(modes.indexOf(cur) + 1) % modes.length];
            localStorage.setItem('watch_music_repeat', JSON.stringify(nextMode));
            window.dispatchEvent(new Event('storage'));
            break;
          }
        }
      }
    } else if (action.type === 'offload') {
      // Complex query was sent to Gemini — the phone will show it
      // TODO: Sync with phone app
    }
  };

  // ── Send text message to AI ──
  const sendToAI = async (userText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setVoiceState('thinking');

    try {
      const history = [...messages, userMessage].slice(-10).map((m) => ({
        role: m.isUser ? 'user' : 'assistant',
        content: m.text,
      }));

      const response = await watchChat(userText, history);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Speak the response (ElevenLabs if available, else browser TTS)
      speakResponse(response.reply, response.audio);

      // Execute action
      executeAction(response.action);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, couldn't connect to the server.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setVoiceState('idle');
    }
  };

  // ── MediaRecorder: Start Recording ──
  const startRecording = async () => {
    try {
      window.speechSynthesis?.cancel();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];

        if (audioBlob.size < 1000) {
          // Too short, probably no speech
          setVoiceState('idle');
          setLiveTranscript('');
          return;
        }

        // Transcribe via Groq Whisper
        setVoiceState('transcribing');
        setLiveTranscript('Processing audio...');

        try {
          const { transcript } = await watchTranscribeAudio(audioBlob);
          setLiveTranscript('');

          if (!transcript?.trim()) {
            setVoiceState('idle');
            const noSpeechMsg: Message = {
              id: Date.now().toString(),
              text: "I didn't catch that. Try again?",
              isUser: false,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, noSpeechMsg]);
            return;
          }

          // Show what was heard, then send to AI
          await sendToAI(transcript);
        } catch {
          setVoiceState('idle');
          setLiveTranscript('');
          const errMsg: Message = {
            id: Date.now().toString(),
            text: 'Voice recognition failed. Try typing instead.',
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errMsg]);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      setVoiceState('recording');
      setLiveTranscript('');

      // Auto-stop after 10 seconds + countdown
      const MAX_SECONDS = 10;
      setCountdown(MAX_SECONDS);
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);

      autoStopTimerRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        setCountdown(0);
      }, MAX_SECONDS * 1000);
    } catch (err: any) {
      console.error('Mic access error:', err);
      setVoiceState('idle');
      const errMsg: Message = {
        id: Date.now().toString(),
        text: 'Microphone access denied. Please allow mic access and try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  const stopRecording = () => {
    // Clear auto-stop timers
    if (autoStopTimerRef.current) clearTimeout(autoStopTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setCountdown(0);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleTextSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = textInput.trim();
    if (!text || voiceState === 'thinking' || voiceState === 'transcribing') return;
    setTextInput('');
    sendToAI(text);
  };

  // Status label and color
  const statusConfig: Record<VoiceState, { text: string; color: string }> = {
    idle: { text: 'Tap mic or type', color: 'text-white/30' },
    recording: { text: `● Speak now — auto-stops in ${countdown}s (tap to stop early)`, color: 'text-red-400' },
    transcribing: { text: '● Processing your voice...', color: 'text-amber-400' },
    thinking: { text: '● Thinking...', color: 'text-cyan-400' },
    speaking: { text: '● Speaking...', color: 'text-green-400' },
  };

  const isProcessing = voiceState === 'transcribing' || voiceState === 'thinking';

  return (
    <div className="watch-content-safe flex flex-col h-full relative">
      {/* Header */}
      <div className="pt-3 pb-1 px-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (onBack ? onBack() : onNavigate('home'))}
          className="rounded-full w-7 h-7 p-0 bg-white/5 hover:bg-white/10"
        >
          <ArrowLeft size={14} className="text-white/70" />
        </Button>
        <div className="flex items-center space-x-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${voiceState === 'recording'
              ? 'bg-red-400'
              : voiceState === 'speaking'
                ? 'bg-green-400'
                : 'bg-cyan-400'
              } animate-pulse`}
          />
          <h2 className="text-sm font-light text-cyan-400 tracking-widest">FuzNex AI</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTtsEnabled(!ttsEnabled)}
          className="rounded-full w-7 h-7 p-0 bg-white/5 hover:bg-white/10"
          title={ttsEnabled ? 'Mute' : 'Unmute'}
        >
          {ttsEnabled ? (
            <Volume2 size={12} className="text-cyan-400" />
          ) : (
            <VolumeX size={12} className="text-white/40" />
          )}
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto watch-scroll px-3">
          <div className="space-y-2 min-h-full flex flex-col justify-end pb-2">
            {messages.slice(-5).map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-2.5 py-1.5 rounded-xl text-xs transition-all duration-300 ${message.isUser
                    ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 text-white border border-cyan-400/30 rounded-br-sm'
                    : 'bg-gradient-to-r from-white/10 to-gray-500/10 text-white border border-white/20 rounded-bl-sm'
                    }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* Live transcript while recording */}
            {liveTranscript && (
              <div className="flex justify-end">
                <div className="max-w-[85%] px-2.5 py-1.5 rounded-xl text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 rounded-br-sm italic">
                  {liveTranscript}
                </div>
              </div>
            )}

            {/* Thinking dots */}
            {voiceState === 'thinking' && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-white/10 to-gray-500/10 text-white border border-white/20 px-2.5 py-1.5 rounded-xl rounded-bl-sm text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-3 pb-3 space-y-2">
        {/* Text input for testing */}
        <form onSubmit={handleTextSubmit} className="flex gap-1.5">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type here..."
            disabled={isProcessing || voiceState === 'recording'}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white placeholder-white/40 outline-none focus:border-cyan-400/50 transition"
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={!textInput.trim() || isProcessing}
            className="rounded-lg w-8 h-8 p-0 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30"
          >
            <Send size={12} className="text-cyan-400" />
          </Button>
        </form>

        {/* Mic button */}
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={voiceState === 'recording' ? stopRecording : startRecording}
            disabled={isProcessing || voiceState === 'speaking'}
            className={`rounded-full w-11 h-11 p-0 border-2 transition-all duration-300 ${voiceState === 'recording'
              ? 'border-red-400 bg-red-500/20 hover:bg-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
              : 'border-cyan-400/50 bg-cyan-500/20 hover:bg-cyan-500/30'
              }`}
          >
            {voiceState === 'recording' ? (
              <MicOff size={18} className="text-red-400" />
            ) : (
              <Mic size={18} className="text-cyan-400" />
            )}
          </Button>
        </div>

        {/* Status */}
        <div className="text-center">
          <div className={`text-[10px] font-light ${statusConfig[voiceState].color} ${voiceState !== 'idle' ? 'animate-pulse' : ''}`}>
            {statusConfig[voiceState].text}
          </div>
        </div>
      </div>

      {/* Recording overlay */}
      {voiceState === 'recording' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 to-red-600/5 rounded-full animate-pulse" />
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 border-2 border-red-400/30 rounded-full animate-ping" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;