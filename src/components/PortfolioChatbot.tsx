import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send, X, ArrowUpRight, Sparkles, RotateCcw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { askAssistant, warmAssistant } from '../lib/assistant';
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

/** Long enough to read as a reply rather than a lookup, short enough not to
 *  make the visitor wait for a search that already finished. */
const THINKING_MS = 260;

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Answers link out to repositories, LinkedIn, and email; those should not
// replace the page the visitor is reading.
const markdownComponents = {
  a: ({ node: _node, ...props }: { node?: unknown } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} target="_blank" rel="noreferrer" />
  ),
};

export default function PortfolioChatbot() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [isThinking, setIsThinking] = useState(false);

  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const replyTimerRef = useRef<number | null>(null);

  const suggestionPrompts = useMemo(() => starterPrompts, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      toggleButtonRef.current?.focus();
    }
  }, [isOpen]);

  // The input is disabled while the reply is composed, which drops focus.
  // Take it back so a visitor can keep typing without reaching for the mouse.
  useEffect(() => {
    if (isOpen && !isThinking) inputRef.current?.focus();
  }, [isOpen, isThinking]);

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isThinking]);

  // Build the search index as soon as the panel opens, so the first question
  // is answered from a warm index rather than paying to build one.
  useEffect(() => {
    if (isOpen) warmAssistant();
  }, [isOpen]);

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

  // Drop a pending reply when the component goes away.
  useEffect(() => () => {
    if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current);
  }, []);

  const appendMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const respond = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed || isThinking) return;

      appendMessage({ id: makeId('user'), role: 'user', text: trimmed });
      setInput('');
      setIsOpen(true);
      setIsThinking(true);

      // The answer is already in hand; the pause is only so the reply does not
      // land in the same frame as the question.
      const reply = askAssistant(trimmed);

      replyTimerRef.current = window.setTimeout(() => {
        setIsThinking(false);
        appendMessage({
          id: makeId('bot'),
          role: 'bot',
          text: reply.text,
          route: reply.route,
          routeLabel: reply.routeLabel,
        });
      }, THINKING_MS);
    },
    [appendMessage, isThinking],
  );

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
    if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current);
    setIsThinking(false);
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
            aria-busy={isThinking}
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
                {message.role === 'bot' ? (
                  <div className="portfolio-chatbot__markdown">
                    <ReactMarkdown components={markdownComponents}>{message.text}</ReactMarkdown>
                  </div>
                ) : (
                  <div>{message.text}</div>
                )}

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

            {isThinking && (
              <div className="portfolio-chatbot__message portfolio-chatbot__message--bot">
                <span className="portfolio-chatbot__typing" role="status" aria-label="Thinking">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            )}
          </div>

          <div className="portfolio-chatbot__suggestions" aria-label="Suggested prompts">
            {suggestionPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="portfolio-chatbot__chip"
                onClick={() => respond(prompt)}
                disabled={isThinking}
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
              disabled={isThinking}
            />
            <button
              type="submit"
              className="portfolio-chatbot__send"
              aria-label="Send message"
              disabled={!input.trim() || isThinking}
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
