import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Mic, MicOff, Volume2, VolumeX, AlertTriangle, ArrowLeft } from 'lucide-react';
import { watchChat } from '@/api/api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChat = ({ onNavigate, onBack, onNavigateWithAction }: {
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
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(() => {
    return localStorage.getItem('watch_tts') !== 'false';
  });
  const [textInput, setTextInput] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [liveTranscript, setLiveTranscript] = useState('');
  const transcriptRef = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check Speech API support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  // Persist TTS setting
  useEffect(() => {
    localStorage.setItem('watch_tts', ttsEnabled ? 'true' : 'false');
  }, [ttsEnabled]);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => { scrollToBottom(); }, [messages]);

  // TTS: speak text aloud
  const speak = (text: string) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1;
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  // Send message to AI backend
  const sendToAI = async (userText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const history = [...messages, userMessage].slice(-10).map(m => ({
        role: m.isUser ? 'user' : 'assistant',
        content: m.text,
      }));

      const { reply, action } = await watchChat(userText, history);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: reply,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

      // TTS
      speak(reply);

      // Execute action if present
      if (action?.type === 'navigate' && action.screen) {
        setTimeout(() => {
          if (onNavigateWithAction && action.params) {
            onNavigateWithAction(action.screen!, action.params);
          } else {
            onNavigate(action.screen!);
          }
        }, 1500);
      } else if (action?.type === 'music_control') {
        const audio = (window as any).__fuznex_audio;
        if (audio) {
          if (action.params?.command === 'pause') {
            audio.pause();
          } else if (action.params?.command === 'play') {
            audio.play().catch(() => { });
          }
        }
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, couldn\'t connect to the server.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Start voice recognition
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    window.speechSynthesis?.cancel();

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setLiveTranscript('');
      transcriptRef.current = '';
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setLiveTranscript(transcript);
      transcriptRef.current = transcript;
    };

    recognition.onend = () => {
      setIsListening(false);
      const finalText = transcriptRef.current.trim();
      setLiveTranscript('');
      transcriptRef.current = '';
      if (finalText) {
        sendToAI(finalText);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      setLiveTranscript('');
      if (event.error === 'not-allowed') setSpeechSupported(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  const handleTextSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = textInput.trim();
    if (!text || isProcessing) return;
    setTextInput('');
    sendToAI(text);
  };

  return (
    <div className="watch-content-safe flex flex-col h-full relative">

      {/* Header */}
      <div className="pt-3 pb-1 px-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onBack ? onBack() : onNavigate('home')}
          className="rounded-full w-7 h-7 p-0 bg-white/5 hover:bg-white/10"
        >
          <ArrowLeft size={14} className="text-white/70" />
        </Button>
        <div className="flex items-center space-x-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-400' : 'bg-cyan-400'} animate-pulse`} />
          <h2 className="text-sm font-light text-cyan-400 tracking-widest">FuzNex AI</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTtsEnabled(!ttsEnabled)}
          className="rounded-full w-7 h-7 p-0 bg-white/5 hover:bg-white/10"
          title={ttsEnabled ? 'Mute' : 'Unmute'}
        >
          {ttsEnabled ? <Volume2 size={12} className="text-cyan-400" /> : <VolumeX size={12} className="text-white/40" />}
        </Button>
      </div>

      {/* Browser support warning */}
      {!speechSupported && (
        <div className="mx-3 mb-1 px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center gap-1.5">
          <AlertTriangle size={12} className="text-amber-400 flex-shrink-0" />
          <span className="text-[9px] text-amber-300">Voice needs Chrome/Edge. Use text input below.</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto watch-scroll px-3">
          <div className="space-y-2 min-h-full flex flex-col justify-end pb-2">
            {messages.slice(-5).map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-2.5 py-1.5 rounded-xl text-xs transition-all duration-300 ${message.isUser
                  ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 text-white border border-cyan-400/30 rounded-br-sm'
                  : 'bg-gradient-to-r from-white/10 to-gray-500/10 text-white border border-white/20 rounded-bl-sm'
                  }`}>
                  {message.text}
                </div>
              </div>
            ))}

            {isListening && liveTranscript && (
              <div className="flex justify-end">
                <div className="max-w-[85%] px-2.5 py-1.5 rounded-xl text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 rounded-br-sm italic">
                  {liveTranscript}...
                </div>
              </div>
            )}

            {isProcessing && (
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
            disabled={isProcessing || isListening}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white placeholder-white/40 outline-none focus:border-cyan-400/50 transition"
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={!textInput.trim() || isProcessing}
            className="rounded-lg w-8 h-8 p-0 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30"
          >
            <span className="text-xs text-cyan-400">→</span>
          </Button>
        </form>

        {/* Mic button */}
        <div className="flex items-center justify-center">
          {speechSupported && (
            <Button
              variant="ghost"
              size="sm"
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`rounded-full w-11 h-11 p-0 border-2 transition-all duration-300 ${isListening
                ? 'border-red-400 bg-red-500/20 hover:bg-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                : 'border-cyan-400/50 bg-cyan-500/20 hover:bg-cyan-500/30'
                }`}
            >
              {isListening ? <MicOff size={18} className="text-red-400" /> : <Mic size={18} className="text-cyan-400" />}
            </Button>
          )}
        </div>

        {/* Status text */}
        <div className="text-center">
          {isListening ? (
            <div className="text-red-400 text-[10px] font-light animate-pulse">● LISTENING — tap to stop</div>
          ) : isProcessing ? (
            <div className="text-white/60 text-[10px] font-light">● THINKING...</div>
          ) : (
            <div className="text-white/30 text-[10px] font-light">
              {speechSupported ? 'Tap mic or type' : 'Type your message'}
            </div>
          )}
        </div>
      </div>

      {/* Listening overlay */}
      {isListening && (
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