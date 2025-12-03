import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, Sparkles } from 'lucide-react';
import { Product, ChatMessage } from '../types';
import { getFoodRecommendation } from '../services/geminiService';

interface AIChatProps {
  products: Product[];
}

export const AIChat: React.FC<AIChatProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '你好！我是 TasteLab 的 AI 选味师。不知道选什么好？告诉我你的口味偏好（比如“喜欢吃辣”、“想找下午茶”），我来为你推荐！' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsLoading(true);

    const recommendation = await getFoodRecommendation(userMsg, products);

    setMessages(prev => [...prev, { role: 'model', text: recommendation }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-gray-900 text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group
          ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <div className="absolute -top-1 -right-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
            </span>
        </div>
        <Bot size={28} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-full max-w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right border border-gray-100 overflow-hidden
        ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="bg-brand-500 p-1.5 rounded-lg">
                <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">AI 选味师</h3>
              <p className="text-[10px] text-gray-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                Powered by Gemini 2.5
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-brand-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="我想找点辣的零食..."
            className="flex-grow bg-gray-100 text-gray-700 text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="bg-brand-600 text-white p-2 rounded-full hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
};