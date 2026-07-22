import { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send, X, ArrowUpRight, Sparkles, RotateCcw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { chatbotFaq, type ChatbotFaqItem } from '../data/chatbotFaq';
import './PortfolioChatbot.css';

type Message = {
  id: string;
  role: 'user' | 'bot';
  text: string;
  route?: string;
  routeLabel?: string;
};

const starterPrompts = [
  'Tell me about Yonathan',
  'Show energy projects',
  'What machine learning projects are here?',
  'How can I view the CV?',
];

const welcomeMessage: Message = {
  id: 'welcome',
  role: 'bot',
  text: 'Hi — I can help you explore Yonathan’s background, projects, articles, skills, and CV.',
};

function normalizeText(text: string) {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function scoreFaq(query: string, item: ChatbotFaqItem) {
  const normalizedQuery = normalizeText(query);

  return item.keywords.reduce((score, keyword) => {
    const normalizedKeyword = normalizeText(keyword);

    if (normalizedQuery === normalizedKeyword) return score + 6;
    if (normalizedQuery.includes(normalizedKeyword)) return score + 3;

    const keywordWords = normalizedKeyword.split(' ');
    const matchedWords = keywordWords.filter((word) => normalizedQuery.includes(word)).length;

    return score + matchedWords;
  }, 0);
}

function getBestMatch(query: string) {
  const ranked = chatbotFaq
    .map((item) => ({ item, score: scoreFaq(query, item) }))
    .sort((a, b) => b.score - a.score);

  return ranked[0];
}

export default function PortfolioChatbot() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);

  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  const suggestionPrompts = useMemo(() => starterPrompts, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      toggleButtonRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const addBotMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const respond = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);

    const bestMatch = getBestMatch(trimmed);

    const botMessage: Message =
      bestMatch && bestMatch.score >= 2
        ? {
            id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            role: 'bot',
            text: bestMatch.item.answer,
            route: bestMatch.item.route,
            routeLabel: bestMatch.item.routeLabel,
          }
        : {
            id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            role: 'bot',
            text: 'I’m best at helping with Yonathan’s background, projects, articles, skills, and CV. Try asking about geothermal work, machine learning projects, forecasting, or experience.',
          };

    window.setTimeout(() => addBotMessage(botMessage), 180);
    setInput('');
    setIsOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    respond(input);
  };

  const handleNavigate = (route?: string) => {
    if (!route) return;
    navigate(route);
    setIsOpen(false);
  };

  const resetConversation = () => {
    setMessages([welcomeMessage]);
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <div className="portfolio-chatbot">
      {isOpen && (
        <section
          ref={panelRef}
          className="portfolio-chatbot__panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="portfolio-chatbot-title"
          aria-describedby="portfolio-chatbot-subtitle"
          aria-label="Portfolio chatbot"
        >
          <header className="portfolio-chatbot__header">
            <div>
              <p className="portfolio-chatbot__eyebrow">Portfolio assistant</p>
              <h2 id="portfolio-chatbot-title" className="portfolio-chatbot__title">
                Ask Yonathan
              </h2>
              <p id="portfolio-chatbot-subtitle" className="portfolio-chatbot__subtitle">
                Explore projects, background, articles, and CV.
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="portfolio-chatbot__icon-button"
                aria-label="Reset conversation"
                onClick={resetConversation}
              >
                <RotateCcw size={17} />
              </button>
              <button
                type="button"
                className="portfolio-chatbot__icon-button"
                aria-label="Close chatbot"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
          </header>

          <div
            ref={messagesRef}
            className="portfolio-chatbot__messages"
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`portfolio-chatbot__message ${
                  message.role === 'bot'
                    ? 'portfolio-chatbot__message--bot'
                    : 'portfolio-chatbot__message--user'
                }`}
              >
                <div>{message.text}</div>

                {message.role === 'bot' && message.route && message.routeLabel && (
                  <button
                    type="button"
                    className="portfolio-chatbot__link"
                    onClick={() => handleNavigate(message.route)}
                  >
                    {message.routeLabel}
                    <ArrowUpRight size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="portfolio-chatbot__suggestions" aria-label="Suggested prompts">
            {suggestionPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="portfolio-chatbot__chip"
                onClick={() => respond(prompt)}
              >
                <Sparkles size={14} />
                <span>{prompt}</span>
              </button>
            ))}
          </div>

          <form className="portfolio-chatbot__form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="portfolio-chatbot__input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects, skills, or experience..."
              aria-label="Ask about Yonathan's portfolio"
            />
            <button
              type="submit"
              className="portfolio-chatbot__send"
              aria-label="Send message"
              disabled={!input.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      )}

      <button
        ref={toggleButtonRef}
        type="button"
        className="portfolio-chatbot__toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="portfolio-chatbot-panel"
        aria-label="Toggle portfolio chatbot"
      >
        <MessageCircle size={20} />
        <span className="portfolio-chatbot__toggle-label">Ask</span>
      </button>
    </div>
  );
}
