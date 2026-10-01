import React, { useState } from 'react';
import { Product } from '../../types';
import { GeminiService } from '../../services/geminiClient';
import { Sparkles, Send, Bot, User, HelpCircle } from 'lucide-react';

interface AskAiWidgetProps {
  product: Product;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export const AskAiWidget: React.FC<AskAiWidgetProps> = ({ product }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: `Namaste! I'm your Ecomma craft assistant. Ask me anything about "${product.title}" — such as material care, origin, styling tips, or delivery terms.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    'Is COD available for this item?',
    'What are the washing/care instructions?',
    'How is this product made by artisans?',
    'What is the return and replacement policy?',
  ];

  const handleSend = async (questionText: string) => {
    const q = questionText.trim();
    if (!q || loading) return;

    const userMsg: Message = { sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const answer = await GeminiService.askProductQuestion(q, product, messages);
      setMessages((prev) => [...prev, { sender: 'bot', text: answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'This authentic handcrafted item ships safely with insurance and 7-day hassle-free replacement. Feel free to reach out to our team if you need more details!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/70 via-stone-50 to-white rounded-2xl border border-amber-900/10 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F1B2D] text-[#F59E0B] flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F1B2D]">Ask AI About This Product</h3>
            <p className="text-[11px] text-slate-500">Instant answers powered by Gemini 3.8</p>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          <span>Quick queries:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-left text-xs bg-white hover:bg-amber-100/60 border border-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Window */}
      <div className="max-h-56 overflow-y-auto space-y-3 pr-1 mb-3 text-xs">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === 'user' ? 'bg-[#0F1B2D] text-white' : 'bg-[#F59E0B] text-black'
              }`}
            >
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#0F1B2D] text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 italic text-xs pl-8">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Consulting artisan catalog with Gemini...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this product..."
          disabled={loading}
          className="flex-1 bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-3.5 py-2.5 bg-[#0F1B2D] hover:bg-[#1E293B] disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center transition-colors shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
