import { useState, useEffect, useRef, useContext } from "react";
import apiRequest from "../../lib/apiRequest";
import "./assistantPage.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  RotateCcw,
  User,
  Sparkles,
  MapPin,
  TrendingUp,
  Shield,
  ExternalLink,
  Loader2,
  MessageSquare,
  Plus,
  Info
} from "lucide-react";

function AssistantPage() {
  const { currentUser } = useContext(AuthContext);
  const chatKey = currentUser ? `primenest_chat_${currentUser.id}` : "primenest_chat_history";

  const [messages, setMessages] = useState(() => {
    const savedChat = localStorage.getItem(chatKey);
    return savedChat ? JSON.parse(savedChat) : [
      {
        text: "Hi there! I'm Runo, your PrimeNest AI advisor. I can help you find properties, analyze markets, and answer questions about real estate. How can I assist you today?",
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
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatKey]);

  const handleNewChat = () => {
    const initialMsg = [{
      text: "New conversation started. How can I help you find your perfect property?",
      isAi: true
    }];
    setMessages(initialMsg);
    localStorage.removeItem(chatKey);
    inputRef.current?.focus();
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
        explanation: res.data.explanation
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: "I'm having trouble connecting right now. Please try again in a moment.", isAi: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: "Smart Search",
      description: "Natural language property search across 50+ countries"
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Real-time analysis of property trends and prices"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your conversations are encrypted and protected"
    }
  ];

  return (
    <div className="assistant-page-revamped">
      {/* Sidebar - History & Tools */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Sparkles size={20} />
            <span>PrimeNest AI</span>
          </div>
          <motion.button
            className="new-chat-sidebar-btn"
            onClick={handleNewChat}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} />
            <span>New Chat</span>
          </motion.button>
        </div>

        <div className="sidebar-content">
          <div className="history-group">
            <span className="group-label">Recent Conversations</span>
            <div className="history-item active">
              <MessageSquare size={16} />
              <span className="history-title">Current Conversation</span>
            </div>
            {/* Future history items will be mapped here */}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">
              <img src={currentUser?.avatar || "/noavatar.jpg"} alt="" />
            </div>
            <div className="details">
              <span className="name">{currentUser?.username || "Guest"}</span>
              <span className="plan">Pro Member</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="main-chat-container">
        {/* Chat Header */}
        <header className="chat-area-header">
          <div className="model-info">
            <span className="model-name">Runo AI</span>
            <span className="model-version">v2.1 (Nigeria Edition)</span>
          </div>
          <div className="chat-actions">
            <button className="action-icon-btn" title="Share">
              <ExternalLink size={18} />
            </button>
            <button className="action-icon-btn mobile-only" onClick={handleNewChat} title="New Chat">
              <RotateCcw size={18} />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="messages-scroller" ref={messageEndRef}>
          <div className="messages-list">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`message-wrapper ${message.isAi ? "ai" : "user"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="message-bubble-container">
                    <div className="message-icon">
                      {message.isAi ? <Bot size={20} /> : <User size={20} />}
                    </div>
                    <div className="message-text-content">
                      <div className="author-name">{message.isAi ? "Runo" : "You"}</div>
                      <div className="text">{message.text}</div>
                      {message.explanation && (
                        <div className="explanation-box">
                          <Info size={14} />
                          <p>{message.explanation}</p>
                        </div>
                      )}
                      {message.link && (
                        <Link to={message.link} className="result-link">
                          <ExternalLink size={14} />
                          <span>View Property Listings</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                className="message-wrapper ai"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="message-bubble-container">
                  <div className="message-icon">
                    <Bot size={20} />
                  </div>
                  <div className="message-text-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messageEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <footer className="chat-input-wrapper">
          <div className="input-box-container">
            <div className="input-pill">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Message Runo AI..."
                disabled={loading}
              />
              <motion.button
                className="send-action-btn"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </motion.button>
            </div>
            <p className="disclaimer">
              Runo AI can provide real estate insights but always verify key details with agents.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default AssistantPage;
