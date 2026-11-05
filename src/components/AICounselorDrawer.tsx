import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, Trash2, ArrowRight, CornerDownLeft, Loader2 } from 'lucide-react';
import { College, CounselorChatMessage } from '../types';

interface AICounselorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comparedColleges: College[];
  allColleges: College[];
  onOpenDetails: (college: College) => void;
  initialPrompt?: string;
}

const PRESET_QUERIES = [
  'Compare BITS Pilani CS vs NIT Trichy CS vs IIT Roorkee Mechanical',
  'Which MBA college gives the highest ROI with tuition under ₹10 Lakhs?',
  'Should I prioritize Branch (CSE) at Tier 2 or Core Branch at Top 5 IIT?',
  'How do Home State quotas benefit me in JEE Main / NITs?',
  'What are the best colleges for non-engineers targeting an MBA later?'
];

export const AICounselorDrawer: React.FC<AICounselorDrawerProps> = ({
  isOpen,
  onClose,
  comparedColleges,
  allColleges,
  onOpenDetails,
  initialPrompt
}) => {
  const [messages, setMessages] = useState<CounselorChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Namaste! I am your AI Admissions Counselor for Indian higher education. 

I can help you:
• Analyze dilemmas between colleges, degrees, and branches (e.g. IIT Bombay Civil vs IIIT Hyderabad CS)
• Determine which institutes maximize your Return on Investment (ROI)
• Navigate JoSAA/CSAB counseling, Home State vs Other State quotas, and CAT percentiles
• Compare campus culture, placement statistics, and alumni networks

Feel free to ask any question or tap one of the suggested topics below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      setInputQuery(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMessage: CounselorChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      collegeContext: comparedColleges.map((c) => c.name)
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/counselor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          collegesContext: comparedColleges.length > 0 ? comparedColleges : allColleges.slice(0, 6)
        })
      });

      if (!response.ok) {
        throw new Error('Server returned error status');
      }

      const data = await response.json();
      const assistantMessage: CounselorChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here is our counseling analysis based on higher education standards.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      // Fallback rule counselor if server fails or key is missing
      const fallbackReply = generateClientCounselorAdvice(textToSend, comparedColleges);
      const assistantMessage: CounselorChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Chat history cleared. How can I help you choose your dream college today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>AI Admissions Counselor</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Gemini 3.8
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Personalized higher education and admissions strategy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selected Context Ribbon */}
        {comparedColleges.length > 0 && (
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-200/60 text-xs flex items-center justify-between">
            <div className="flex items-center gap-1 text-amber-900">
              <span className="font-bold">Active Context:</span>
              <span className="truncate max-w-xs">
                {comparedColleges.map((c) => c.shortName).join(' vs ')}
              </span>
            </div>
            <span className="text-[10px] text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded">
              Included in prompt
            </span>
          </div>
        )}

        {/* Messages List Area */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/80'
                  }`}
                >
                  <div>{msg.text}</div>
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      isUser ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-slate-500 text-xs">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
              </div>
              <div className="bg-slate-100 rounded-xl px-4 py-2.5 border border-slate-200 animate-pulse">
                Analyzing NIRF metrics, cutoff percentiles, and placement records...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries Chips */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div className="text-[11px] font-bold text-slate-600 mb-1.5">Suggested Questions:</div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {PRESET_QUERIES.map((query, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(query)}
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-100 text-[11px] whitespace-nowrap transition-colors shrink-0"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about colleges, branch vs college, JoSAA rounds..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="p-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4 text-amber-400" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

function generateClientCounselorAdvice(query: string, comparedColleges: College[]): string {
  const lower = query.toLowerCase();

  if (lower.includes('bits') || lower.includes('nit') || lower.includes('iit')) {
    return `### Strategic Comparison: IITs vs BITS Pilani vs Top NITs

1. **Brand & Alumni Network**:
   • Top 5 IITs (Bombay, Delhi, Madras, Kanpur, Kharagpur) carry the highest international clout for Silicon Valley, Wall Street, and top PhD programs.
   • BITS Pilani offers a peer group strictly on par with Top IITs due to its 100% merit-based BITSAT (zero reservations). Its startup founder network (Swiggy, Postman, BigBasket) is exceptional.
   • NIT Trichy & NIT Surathkal lead all NITs, offering elite tech recruitments (Avg CTC ₹16-18 LPA) at 1/4th the tuition fees of BITS.

2. **Branch vs College Dilemma**:
   • If you have a passion for Computer Science/AI, choosing CS at BITS Pilani or IIIT Hyderabad will give you faster tech placements than Mechanical/Civil at an IIT.
   • However, if you are unsure of your career path or want to enter Management/Consulting (McKinsey, BCG), a Top 5 IIT degree gives you superior non-tech flexibility.

3. **Financial Aspect**:
   • BITS 4-year fees are ~₹26 Lakhs, whereas IITs and NITs are ~₹7-10 Lakhs. If taking an educational loan, NIT Trichy or IIT Roorkee gives significantly faster ROI payback.`;
  }

  if (lower.includes('mba') || lower.includes('fms') || lower.includes('iim') || lower.includes('roi')) {
    return `### MBA Return on Investment (ROI) Breakdown

1. **The Ultimate ROI King: FMS Delhi**:
   • 2-year total tuition fees: ~₹2.1 Lakhs
   • Average Placement CTC: ₹34.1 LPA
   • Payback duration: Less than 1 month of working!

2. **The IIM Trinity (Ahmedabad, Bangalore, Calcutta)**:
   • Total fees: ~₹26 to 27 Lakhs
   • Average CTC: ₹34 to 35.3 LPA
   • Even with higher fees, 100% bank financing is provided without collateral, and you gain access to global Private Equity & Investment Banking roles that don't recruit anywhere else.

3. **Alternative High-ROI Options**:
   • JBIMS Mumbai (MHCET, fees ~₹6L, avg CTC ~₹28 LPA)
   • XLRI Jamshedpur (XAT, #1 in HR management across Asia)`;
  }

  return `### Admissions & Counseling Recommendation

Based on verified Indian counseling data (JoSAA, CSAB, MCC, and CAT committees):

1. **Check Domicile & Category Quotas First**:
   • In NITs, 50% of all seats are reserved for Home State candidates. In DTU and NSUT, 85% of seats are reserved for Delhi candidates. This drastically relaxes the required closing rank.
   • Category relaxations (OBC-NCL, EWS, SC, ST) shift cutoffs significantly. Always benchmark against category closing ranks rather than general All-India ranks.

2. **Evaluate Total Cost of Attendance**:
   • Factor in tuition plus hostel fees and living expenses. Premier government institutions offer 100% tuition waivers for families with income under ₹1 Lakh/year, and 66% fee remission for income under ₹5 Lakhs.

3. **Next Steps**:
   • Use the ShikshaSetu **Fit Predictor** to map your exact percentile to Dream, Target, and Safe institutions.`;
}
