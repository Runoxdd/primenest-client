import { useState, useEffect, useRef, useContext } from "react";
import "./aiWidget.scss";
import apiRequest from "../../lib/apiRequest";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  X, 
  Minus, 
  Send, 
  Plus,
  MessageCircle,
  ArrowRight,
  Home,
  Building2,
  MapPin
} from "lucide-react";

// Quick action suggestions for users
const QUICK_ACTIONS = [
  { icon: Home, text: "Houses under ₦5M" },
  { icon: MapPin, text: "2 bedroom flats for rent" },
];

function AIWidget() {
  const { currentUser } = useContext(AuthContext);
  const chatKey = currentUser ? `primenest_widget_chat_${currentUser.id}` : "primenest_widget_chat";
  const sessionKey = currentUser ? `primenest_widget_session_${currentUser.id}` : "primenest_widget_session";
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(() => {
    const savedChat = localStorage.getItem(chatKey);
    return savedChat ? JSON.parse(savedChat) : [
      { 
        text: "Hi! I'm Runo, your PrimeNest AI assistant. I can help you find your perfect property, answer questions about real estate, or provide market insights. What are you looking for today?", 
        isAi: true,
        suggestions: [ "Find houses under ₦5M", "Real estate investment tips"]
      }
    ];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem(sessionKey) || null;
  });
  
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const navigate = useNavigate();

  // Save chat to localStorage
  useEffect(() => {
    localStorage.setItem(chatKey, JSON.stringify(messages));
  }, [messages, chatKey]);

  // Save session ID
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem(sessionKey, sessionId);
    }
  }, [sessionId, sessionKey]);

  // Smooth scroll to bottom
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleNewChat = () => {
    const initialMsg = [{ 
      text: "New conversation started! I'm ready to help you find your perfect property. What are you looking for?", 
      isAi: true,
      suggestions: ["Apartments in Japan", "Houses for rent", "Properties under ₦10M"]
    }];
    setMessages(initialMsg);
    setSessionId(null);
    localStorage.removeItem(chatKey);
    localStorage.removeItem(sessionKey);
  };

  const handleQuickAction = (actionText) => {
    setInput(actionText);
    handleSend(actionText);
  };

  const handleSend = async (overrideText = null) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || loading) return;

    const userQuery = textToSend;
    setInput("");
    const userMsg = { text: userQuery, isAi: false };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await apiRequest.post("/assistant/chat", { 
        message: userQuery,
        sessionId: sessionId 
      });
      
      // Store session ID for conversation continuity
      if (res.data.sessionId) {
        setSessionId(res.data.sessionId);
      }
      
      const aiMsg = { 
        text: res.data.reply, 
        isAi: true, 
        link: res.data.searchUrl,
        suggestions: res.data.suggestions || null
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev, 
        { 
          text: "I'm having trouble connecting right now. Please try again in a moment.", 
          isAi: true,
          suggestions: ["Try again", "Browse properties instead"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleWidget = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const minimizeWidget = () => {
    setIsMinimized(true);
  };

  const closeWidget = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <div className={`ai-widget ${isOpen ? "open" : ""} ${isMinimized ? "minimized" : ""}`}>
      {/* Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="widget-trigger"
            onClick={toggleWidget}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open AI Assistant"
          >
            <Sparkles size={24} />
            <span className="trigger-pulse" />
            <span className="trigger-label">AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Minimized State */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.button
            className="widget-minimized"
            onClick={() => setIsMinimized(false)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles size={18} />
            <span>Runo AI</span>
            <span className="minimized-badge">1</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Widget Panel */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            className="widget-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="widget-header">
              <div className="header-left">
                <div className="ai-avatar">
                  <Sparkles size={18} />
                </div>
                <div className="header-info">
                  <h3>Runo AI</h3>
                  <span className={`status ${loading ? "thinking" : "online"}`}>
                    <span className="status-dot" />
                    {loading ? "Thinking..." : "Online"}
                  </span>
                </div>
              </div>
             <div className="header-actions">
  <motion.button onClick={handleNewChat} title="New Chat" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
    <Plus size={20} /> {/* Increased from 16 */}
  </motion.button>
  <motion.button onClick={minimizeWidget} title="Minimize" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
    <Minus size={20} /> {/* Increased from 16 */}
  </motion.button>
  <motion.button onClick={closeWidget} title="Close" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}> 
    <X size={20} /> {/* Increased from 16 */}
  </motion.button>
</div>
            </div>

            {/* Messages Container - Independently Scrollable */}
            <div className="widget-messages" ref={messagesContainerRef}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  className={`message ${m.isAi ? "ai" : "user"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  {m.isAi && (
                    <div className="message-avatar">
                      <Sparkles size={14} />
                    </div>
                  )}
                  <div className="message-bubble">
                    <p>{m.text}</p>
                    {m.link && (
                      <Link to={m.link} className="action-link" onClick={closeWidget}>
                        View Listings
                        <ArrowRight size={14} />
                      </Link>
                    )}
                    {m.suggestions && m.suggestions.length > 0 && (
                      <div className="message-suggestions">
                        {m.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            className="suggestion-chip"
                            onClick={() => handleQuickAction(suggestion)}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {loading && (
                <motion.div
                  className="message ai"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="message-avatar">
                    <Sparkles size={14} />
                  </div>
                  <div className="message-bubble typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </motion.div>
              )}
              
              <div ref={messageEndRef} />
            </div>

            {/* Quick Actions */}
            {!loading && messages.length <= 2 && (
              <div className="quick-actions">
                {QUICK_ACTIONS.map((action, idx) => (
                  <button
                    key={idx}
                    className="quick-action-btn"
                    onClick={() => handleQuickAction(action.text)}
                  >
                    <action.icon size={14} />
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="widget-input">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about properties..."
                disabled={loading}
              />
              <motion.button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="send-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AIWidget;
