import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Building2, 
  Sparkles,
  Phone,
  Paperclip
} from 'lucide-react';
import { Property, ChatMessage, SupportedLanguage } from '../types/property.ts';
import { translations } from '../i18n/translations';

interface DirectMessagingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  currentLang: SupportedLanguage;
  currentUser: any | null;
  onOpenAuth: () => void;
}

export const DirectMessagingDrawer: React.FC<DirectMessagingDrawerProps> = ({
  isOpen,
  onClose,
  property,
  currentLang,
  currentUser,
  onOpenAuth,
}) => {
  if (!isOpen || !property) return null;

  const t = translations[currentLang];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedViewingSlot, setSelectedViewingSlot] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation thread with greeting from agent
  useEffect(() => {
    const initialThread: ChatMessage[] = [
      {
        id: `init-${property.id}`,
        propertyId: property.id,
        propertyTitle: property.title,
        agentId: property.agent.id,
        sender: 'agent',
        text: `Hello! I am ${property.agent.name} with ${property.agent.agency}. Thank you for your interest in ${property.title}. How can I assist you with floor plans, indicative bank valuations, or viewing slots?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];

    // Fetch any saved messages from backend API
    fetch(`/api/messages?propertyId=${property.id}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((apiMsgs) => {
        if (apiMsgs && apiMsgs.length > 0) {
          setMessages([...initialThread, ...apiMsgs]);
        } else {
          setMessages(initialThread);
        }
      })
      .catch(() => {
        setMessages(initialThread);
      });
  }, [property]);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickQuestions = [
    'Is this unit still available for viewing?',
    'Can I schedule a viewing this Saturday 2pm?',
    'What is the negotiable price & bank valuation?',
    'Can you send the official floor plan?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const content = textToSend || inputText.trim();
    if (!content) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      agentId: property.agent.id,
      sender: 'user',
      text: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsSubmitting(true);

    try {
      // Send to Express Backend
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          agentId: property.agent.id,
          text: content,
          sender: 'user',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.agentReply) {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: data.agentReply.id,
                propertyId: property.id,
                propertyTitle: property.title,
                agentId: property.agent.id,
                sender: 'agent',
                text: data.agentReply.text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                suggestedViewingSlots: data.agentReply.suggestedViewingSlots,
              },
            ]);
            setIsSubmitting(false);
          }, 1000);
          return;
        }
      }
    } catch (err) {
      console.warn('API message send fallback:', err);
    }

    // Local fallback response if backend offline
    setTimeout(() => {
      const replies = [
        `Thanks for reaching out! Yes, ${property.title} is available. I can arrange an exclusive viewing for you. Would this weekend work?`,
        `Hi! I've received your request. Let me check with the owner and confirm the access key. What time slots are best for you?`,
        `Noted! I've sent you the detailed brochure and recent transacted prices for this stack. Please let me know if you need mortgage assistance!`,
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          propertyId: property.id,
          propertyTitle: property.title,
          agentId: property.agent.id,
          sender: 'agent',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedViewingSlots: ['Sat 2:00 PM', 'Sat 4:30 PM', 'Sun 11:00 AM'],
        },
      ]);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 flex justify-end backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Top Drawer Header */}
        <div className="p-4 bg-[#1E293B] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={property.agent.avatar}
                alt={property.agent.name}
                className="w-11 h-11 rounded-full border-2 border-red-500 object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="text-sm font-bold text-white">{property.agent.name}</h3>
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 ml-1.5" />
              </div>
              <p className="text-[11px] text-slate-300">
                {property.agent.agency} • CEA: {property.agent.ceaRegNo}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <a
              href={`https://wa.me/${property.agent.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-400 hover:text-emerald-300 rounded-lg hover:bg-slate-800"
              title="Open WhatsApp"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Compact Property Preview Card */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center space-x-3">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-14 h-14 rounded-lg object-cover border border-slate-200"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{property.title}</p>
            <p className="text-xs font-extrabold text-[#E00000]">{property.formattedPrice}</p>
            <p className="text-[10px] text-slate-500 truncate">
              {property.bedrooms} Beds • {property.bathrooms} Baths • {property.floorAreaSqft} sqft
            </p>
          </div>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-100/60">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#E00000] text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Suggested Viewing Slots */}
                  {msg.suggestedViewingSlots && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-[#E00000]" />
                        Select a Preferred Viewing Slot:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {msg.suggestedViewingSlots.map((slot, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedViewingSlot(slot);
                              handleSendMessage(`I'd like to book the viewing on ${slot}. Please confirm!`);
                            }}
                            className="bg-red-50 hover:bg-red-100 text-[#E00000] text-[11px] font-bold px-2.5 py-1 rounded-lg border border-red-200 transition-colors cursor-pointer"
                          >
                            📅 {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            );
          })}

          {isSubmitting && (
            <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white p-2 rounded-xl border border-slate-200 w-fit">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>{property.agent.name} is typing...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Question Prompts */}
        <div className="p-2.5 bg-white border-t border-slate-200">
          <div className="flex items-center space-x-1 mb-1.5">
            <Sparkles className="w-3 h-3 text-[#E00000]" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Quick Inquiries:
            </span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap bg-slate-100 hover:bg-red-50 hover:text-[#E00000] text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            id="chat-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Type your message to agent..."
            className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500"
          />
          <button
            id="chat-send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isSubmitting}
            className="p-2.5 bg-[#E00000] hover:bg-[#C00000] disabled:bg-slate-300 text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
