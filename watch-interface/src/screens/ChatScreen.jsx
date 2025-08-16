import React from 'react';
import { MessageCircle, Send, MicOff, Mic } from 'lucide-react';
import MicIndicator from '../ui/MicIndicator';

const ChatScreen = ({ 
  isListening, 
  textInput, 
  setTextInput, 
  currentChat, 
  handleTextSubmit 
}) => {
  return (
    <div className="flex flex-col h-full p-3 space-y-2" style={{ margin: '20px' }}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-base font-bold text-white">AI Assistant</h2>
      </div>

      {/* Single Conversation View */}
      <div className="flex-1 flex flex-col justify-center space-y-2 overflow-y-auto" style={{ maxHeight: '180px', paddingBottom: '40px' }}>
        {!currentChat.userMessage && !currentChat.isProcessing && (
          <div className="text-center text-gray-400 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30">
              <MessageCircle size={16} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-1">How can I help?</p>
              <p className="text-xs text-gray-500">Hold mic button to speak</p>
            </div>
          </div>
        )}

        {currentChat.userMessage && (
          <div className="flex justify-end">
            <div className="max-w-[80%] p-2 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 text-white border border-cyan-500/50 backdrop-blur-sm">
              <p className="text-xs leading-relaxed">{currentChat.userMessage}</p>
            </div>
          </div>
        )}

        {currentChat.isProcessing && (
          <div className="flex justify-start">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 text-gray-100 border border-gray-600/50 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-xs text-gray-300">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {currentChat.aiResponse && !currentChat.isProcessing && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-2 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 text-gray-100 border border-gray-600/50 backdrop-blur-sm">
              <p className="text-xs leading-relaxed">{currentChat.aiResponse}</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area - compact for circular display */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
            placeholder="Type message..."
            className="flex-1 bg-gray-800/80 text-white text-xs rounded-xl px-3 py-2 border border-gray-600/60 focus:outline-none focus:border-cyan-400 placeholder-gray-400"
          />
          <button
            onClick={handleTextSubmit}
            disabled={currentChat.isProcessing}
            className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/40 to-purple-500/40 border border-cyan-500/50 text-cyan-400 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send size={10} />
          </button>
        </div>
      </div>

      {/* Mic Icon Indicator */}
      <div className="absolute top-4 right-4">
        <div className={`p-2 rounded-full transition-all duration-300 ${
          isListening 
            ? 'bg-red-500/30 border border-red-500/60 animate-pulse' 
            : 'bg-gray-800/50 border border-gray-600/30'
        }`}>
          {isListening ? (
            <MicOff size={12} className="text-red-400" />
          ) : (
            <Mic size={12} className="text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;