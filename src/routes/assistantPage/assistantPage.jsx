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
  MessageSquare
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
    <div className="assistant-page">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>AI-Powered</span>
          </div>
          <h1>
            Meet <span>Runo</span>, Your AI Real Estate Advisor
          </h1>
          <p>
            Powered by advanced AI, Runo helps you navigate the global property market 
            with intelligent recommendations and instant insights.
          </p>
        </div>
        <div className="hero-visual">
          <div className="visual-glow" />
          <Bot size={120} strokeWidth={1} />
        </div>
      </motion.section>

      {/* Features */}
      <section className="features-section">
        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="feature-icon">
                  <Icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Chat Section */}
      <section className="chat-section">
        <div className="chat-container">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-status">
              <div className={`status-dot ${loading ? "processing" : "online"}`} />
              <span>{loading ? "Thinking..." : "Runo Online"}</span>
            </div>
            <button className="new-chat-btn" onClick={handleNewChat}>
              <RotateCcw size={16} />
              <span>New Chat</span>
            </button>
          </div>

          {/* Messages */}
          <div className="messages-container">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`message ${message.isAi ? "ai" : "user"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="message-avatar">
                    {message.isAi ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  <div className="message-content">
                    <p>{message.text}</p>
                    {message.link && (
                      <Link to={message.link} className="message-link">
                        <ExternalLink size={14} />
                        <span>View Matching Listings</span>
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                className="message ai"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="message-avatar">
                  <Bot size={20} />
                </div>
                <div className="message-content loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messageEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <div className="input-container">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about properties, markets, or neighborhoods..."
                disabled={loading}
              />
              <motion.button
                className="send-btn"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </motion.button>
            </div>
            <p className="input-hint">
              Try: "Find apartments in Lagos under ₦50M" or "What's the market trend in Abuja?"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AssistantPage;
