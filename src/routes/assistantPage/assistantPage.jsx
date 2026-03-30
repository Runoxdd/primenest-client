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
  const sessionKey = currentUser ? `primenest_sid_${currentUser.id}` : "primenest_sid";

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(chatKey);
    return saved ? JSON.parse(saved) : [
      {
        text: "Hi! I'm Runo, PrimeNest's property assistant for Nigeria. Tell me what you're looking for — or just ask me anything.",
        isAi: true
      }
    ];
  });

  // ✅ FIX 1: persist sessionId across renders and page refreshes
  const [sessionId, setSessionId] = useState(() => localStorage.getItem(sessionKey) || null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(chatKey, JSON.stringify(messages));
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatKey]);

  // Save sessionId to localStorage whenever it changes
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem(sessionKey, sessionId);
    } else {
      localStorage.removeItem(sessionKey);
    }
  }, [sessionId, sessionKey]);

  // ✅ FIX 2: handleNewChat tells the backend to clear the session too
  const handleNewChat = async () => {
    try {
      if (sessionId) {
        await apiRequest.post("/assistant/clear", { sessionId });
      }
    } catch (err) {
      // Non-critical — clear locally regardless
      console.warn("Could not clear server session:", err);
    }

    setSessionId(null);
    setMessages([
      {
        text: "Hi! I'm Runo, PrimeNest's property assistant for Nigeria. Tell me what you're looking for — or just ask me anything.",
        isAi: true
      }
    ]);
    localStorage.removeItem(chatKey);
    localStorage.removeItem(sessionKey);
    inputRef.current?.focus();
  };

  // ✅ FIX 3: send sessionId with every request, save the one returned
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userQuery, isAi: false }]);
    setLoading(true);

    try {
      const res = await apiRequest.post("/assistant/chat", {
        message: userQuery,
        sessionId          // send existing session ID (null on first message is fine)
      });

      // Save the session ID the backend assigned/returned
      if (res.data.sessionId) {
        setSessionId(res.data.sessionId);
      }

      setMessages((prev) => [
        ...prev,
        {
          text: res.data.reply,
          isAi: true,
          link: res.data.searchUrl || null,
          suggestions: res.data.suggestions || [],
          explanation: res.data.explanation || null
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: "I'm having trouble connecting right now. Please try again in a moment.", isAi: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Clicking a suggestion chip sends it as a message
  const handleSuggestion = (text) => {
    if (loading) return;
    setInput(text);
    // Small delay so state updates before send fires
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <div className="assistant-page-revamped">
      {/* Sidebar */}
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
        <header className="chat-area-header">
          <div className="model-info">
            <span className="model-name">Runo AI</span>
            <span className="model-version">Nigeria Edition</span>
          </div>
          <div className="chat-actions">
            <button className="action-icon-btn" title="New Chat" onClick={handleNewChat}>
              <RotateCcw size={18} />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="messages-scroller">
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

                      {/* ✅ Suggestion chips rendered under AI messages */}
                      {message.isAi && message.suggestions?.length > 0 && (
                        <div className="suggestion-chips">
                          {message.suggestions.map((s, i) => (
                            <button
                              key={i}
                              className="chip"
                              onClick={() => handleSuggestion(s)}
                              disabled={loading}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
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
                  <div className="message-icon"><Bot size={20} /></div>
                  <div className="message-text-content">
                    <div className="typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messageEndRef} />
          </div>
        </div>

        {/* Input */}
        <footer className="chat-input-wrapper">
          <div className="input-box-container">
            <div className="input-pill">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask Runo anything — e.g. 2 bed flat in Lekki to rent..."
                disabled={loading}
              />
              <motion.button
                className="send-action-btn"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </motion.button>
            </div>
            <p className="disclaimer">
              Runo AI provides real estate insights — always verify key details with a licensed agent.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default AssistantPage;
