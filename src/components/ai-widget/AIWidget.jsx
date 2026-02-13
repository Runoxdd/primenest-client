import { useState, useEffect, useRef, useContext } from "react";
import "./aiWidget.scss";
import apiRequest from "../../lib/apiRequest";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  X, 
  Minus, 
  Send, 
  Plus,
  MessageCircle,
  ArrowRight
} from "lucide-react";

function AIWidget() {
  const { currentUser } = useContext(AuthContext);
  const chatKey = currentUser ? `primenest_widget_chat_${currentUser.id}` : "primenest_widget_chat";
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(() => {
    const savedChat = localStorage.getItem(chatKey);
    return savedChat ? JSON.parse(savedChat) : [
      { 
        text: "Hi! I'm Runo, your PrimeNest AI assistant. How can I help you find your dream property today?", 
        isAi: true 
      }
    ];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(chatKey, JSON.stringify(messages));
  }, [messages, chatKey]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleNewChat = () => {
    const initialMsg = [{ 
      text: "New session started. What are you looking for?", 
      isAi: true 
    }];
    setMessages(initialMsg);
    localStorage.removeItem(chatKey);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userQuery = input;
    setInput("");
    const userMsg = { text: userQuery, isAi: false };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await apiRequest.post("/assistant/chat", { message: userQuery });
      const aiMsg = { 
        text: res.data.reply, 
        isAi: true, 
        link: res.data.searchUrl,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev, 
        { text: "Connection issue. Please try again.", isAi: true }
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
                <motion.button
                  onClick={handleNewChat}
                  title="New Chat"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={16} />
                </motion.button>
                <motion.button
                  onClick={minimizeWidget}
                  title="Minimize"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus size={16} />
                </motion.button>
                <motion.button
                  onClick={closeWidget}
                  title="Close"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="widget-messages">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  className={`message ${m.isAi ? "ai" : "user"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
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
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="message ai">
                  <div className="message-avatar">
                    <Sparkles size={14} />
                  </div>
                  <div className="message-bubble typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messageEndRef} />
            </div>

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
                onClick={handleSend}
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
