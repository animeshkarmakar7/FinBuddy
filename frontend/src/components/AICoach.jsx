import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Sparkles, X, TrendingUp, DollarSign, Target, Loader } from 'lucide-react';
import { useAIChat, useAICoach } from '../hooks/useAICoach';

const AICoach = ({ onClose }) => {
  const { messages, loading, sendMessage, clearChat } = useAIChat();
  const { insights, getInsights } = useAICoach();
  const [input, setInput] = useState('');
  const [showInsights, setShowInsights] = useState(true);

  useEffect(() => {
    // Load insights on mount
    getInsights();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    try {
      await sendMessage(userMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "How can I save more money?",
    "Where am I overspending?",
    "Tips to reach my goal faster?",
    "Analyze my spending patterns",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Financial Coach</h2>
                <p className="text-violet-100 text-sm">Powered by Groq & Llama 3</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Insights Section */}
        {showInsights && insights && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-violet-200 flex-shrink-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                Quick Insights
              </h3>
              <button
                onClick={() => setShowInsights(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-line">
              {insights.insights}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Start a Conversation</h3>
              <p className="text-gray-600 mb-6">Ask me anything about your finances!</p>
              
              {/* Quick Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {quickQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(question);
                      setTimeout(() => handleSend(), 100);
                    }}
                    className="p-3 bg-white border-2 border-violet-200 rounded-xl hover:border-violet-400 hover:shadow-md transition-all text-left text-sm text-gray-700"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.role === 'model' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-violet-600" />
                      <span className="text-xs font-semibold text-violet-600">AI Coach</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <Loader className="w-5 h-5 text-violet-600 animate-spin" />
                  <span className="text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your finances..."
              className="flex-1 px-4 py-3 border-2 border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Powered by Groq & Llama 3 • Your data is private and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
