import { useMemo, useState } from 'react';
import { MessageCircle, Send, X, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

function scoreFaq(query: string, item: ChatbotFaqItem) {
  const normalized = query.toLowerCase().trim();
  return item.keywords.reduce((score, keyword) => {
    return score + (normalized.includes(keyword.toLowerCase()) ? 1 : 0);
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
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: 'Hi — I can help you explore Yonathan’s portfolio, projects, background, articles, and CV.',
    },
  ]);

  const suggestionPrompts = useMemo(() => starterPrompts, []);

  const respond = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const bestMatch = getBestMatch(trimmed);

    const botMessage: Message =
      bestMatch && bestMatch.score > 0
        ? {
            id: `bot-${Date.now()}`,
            role: 'bot',
            text: bestMatch.item.answer,
            route: bestMatch.item.route,
            routeLabel: bestMatch.item.routeLabel,
          }
        : {
            id: `bot-${Date.now()}`,
            role: 'bot',
            text: 'I can answer questions about Yonathan’s background, skills, projects, articles, CV, and contact direction. Try asking about geothermal work, machine learning projects, forecasting, or experience.',
          };

    setMessages((prev) => [...prev, userMessage, botMessage]);
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

  return (
    <div className="portfolio-chatbot">
      {isOpen && (
        <section
          className="portfolio-chatbot__panel"
          aria-label="Portfolio chatbot"
        >
          <header className="portfolio-chatbot__header">
            <div>
              <p className="portfolio-chatbot__eyebrow">Portfolio assistant</p>
              <h2 className="portfolio-chatbot__title">Ask Yonathan</h2>
              <p className="portfolio-chatbot__subtitle">
                Explore projects, background, articles, and CV.
              </p>
            </div>
            <button
              type="button"
              className="portfolio-chatbot__icon-button"
              aria-label="Close chatbot"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </header>

          <div className="portfolio-chatbot__messages">
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

          <div className="portfolio-chatbot__suggestions">
            {suggestionPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="portfolio-chatbot__chip"
                onClick={() => respond(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form className="portfolio-chatbot__form" onSubmit={handleSubmit}>
            <input
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
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="portfolio-chatbot__toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Toggle portfolio chatbot"
      >
        <MessageCircle size={20} />
        <span className="portfolio-chatbot__toggle-label">Ask</span>
      </button>
    </div>
  );
}