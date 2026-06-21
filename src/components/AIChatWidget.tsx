import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Sparkles } from 'lucide-react';
import { Message } from '../types';

interface AIChatWidgetProps {
  playBeep: (freq: number, dur: number) => void;
}

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({ playBeep }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Chào bé yêu và bố mẹ! 🐯 Mình là **Hổ Trí Tuệ**, trợ lý AI thông thái của bạn. Bé có câu hỏi nào về toán học, tiếng Anh, tập viết hay thế giới tự nhiên cần mình giải đáp không nè? ⭐🌸',
      id: 'welcome_msg'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const historyEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const toggleChat = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      playBeep(580, 125);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || inputValue).trim();
    if (!queryText) return;

    if (!textToSend) {
      setInputValue('');
    }

    // Append user message
    const userMsg: Message = {
      sender: 'user',
      text: queryText,
      id: `user_${Date.now()}`
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    playBeep(650, 100);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText })
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      const answerText = data.text || 'Mình chưa hiểu lắm bé ơi. Bé đố lại đi nè! 🐯';

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: answerText,
        id: `ai_${Date.now()}`
      }]);
      playBeep(700, 150);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Chân sóng của chú Hổ đang chập chờn một chút bé ơi! Bé thử hỏi lại tớ sau ít giây nữa nha 🐯✨🌸',
        id: `ai_err_${Date.now()}`
      }]);
      playBeep(250, 250);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper method to properly render marked text down into React elements safely
  const formatText = (text: string) => {
    // Escape HTML first
    let safeText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Markdown bold **
    safeText = safeText.replace(/\*\*(.*?)\*\*/g, '<strong class="text-orange-600 font-extrabold">$1</strong>');
    
    // Split by newlines
    const lines = safeText.split('\n');
    return lines.map((line, idx) => {
      // Check for lists
      if (line.trim().startsWith('-') || line.trim().startsWith('*') || line.trim().startsWith('•')) {
        const cleanLine = line.replace(/^[-*•]\s+/, '');
        return (
          <li key={idx} className="ml-4 list-disc font-semibold text-slate-700 mt-1" dangerouslySetInnerHTML={{ __html: cleanLine }} />
        );
      }
      return (
        <p key={idx} className="leading-relaxed mt-1" dangerouslySetInnerHTML={{ __html: line }} />
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Chat Panel */}
      {isOpen && (
        <div className="w-92 sm:w-96 h-[500px] bg-white rounded-[2rem] shadow-2xl border-2 border-orange-100 flex flex-col overflow-hidden transition-all duration-300 mb-4 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white rounded-full p-1 shadow-md flex items-center justify-center font-bold text-lg">
                🐯
              </div>
              <div>
                <h4 className="font-brand font-bold text-sm text-white leading-tight">Bạn Hổ Trí Tuệ AI</h4>
                <p className="text-[10px] text-orange-100 font-extrabold tracking-wider">Gia sư thông thái của Bé & Mẹ</p>
              </div>
            </div>
            <button 
              onClick={toggleChat} 
              className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-orange-50/10 no-scrollbar">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : ''}`}
              >
                {msg.sender !== 'user' && (
                  <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white shrink-0 shadow-sm font-bold">
                    🐯
                  </div>
                )}
                <div 
                  className={`p-3 rounded-2xl shadow-sm text-sm max-w-[80%] ${
                    msg.sender === 'user' 
                      ? 'bg-orange-500 text-white rounded-tr-none font-bold' 
                      : 'bg-white border border-orange-100 text-slate-800'
                  }`}
                >
                  {formatText(msg.text)}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-xs text-slate-800 shrink-0 shadow-sm font-bold">
                    👧
                  </div>
                )}
              </div>
            ))}

            {/* AI Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white shrink-0 shadow-sm font-bold animate-pulse">
                  🐯
                </div>
                <div className="bg-white border border-orange-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Bạn Hổ đang suy nghĩ...</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={historyEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 shrink-0 flex gap-1.5 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => handleSend('3 cộng 5 bằng mấy? Giải thích cho bé bằng ví dụ trái cây dễ thương nhé.')}
              className="bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-xs text-slate-600 font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all"
            >
              Toán 3 + 5 = ? 🍎
            </button>
            <button 
              onClick={() => handleSend('Kể một câu chuyện siêu ngắn khoảng 3 câu cho bé nghe về chú thỏ dũng cảm.')}
              className="bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-xs text-slate-600 font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all"
            >
              Kể chuyện 📖
            </button>
            <button 
              onClick={() => handleSend('Lập bảng thời gian biểu học & chơi lý tưởng cho bé 5 tuổi chuẩn bị lên lớp 1 tại nhà.')}
              className="bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-xs text-slate-600 font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all"
            >
              Bố mẹ hỏi 💡
            </button>
          </div>

          {/* Input Panel */}
          <div className="p-3 border-t border-slate-100 flex gap-2 items-center bg-white shrink-0">
            <input 
              id="aiChatInput" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              type="text" 
              placeholder="Hỏi Bạn Hổ bất cứ điều gì..." 
              className="flex-grow bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition-all"
            />
            <button 
              onClick={() => handleSend()}
              className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-all shadow-md shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={toggleChat} 
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-400 via-amber-400 to-orange-500 text-white flex flex-col items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative border-4 border-white animate-bounce-soft"
      >
        <span className="text-2xl leading-none">🐯</span>
        <span className="text-[8px] font-extrabold uppercase tracking-tight -mt-0.5">Trợ Lý AI</span>
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
        </span>
      </button>
    </div>
  );
};
