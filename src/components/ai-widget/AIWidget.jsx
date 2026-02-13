import { useState, useEffect, useRef, useContext } from "react";
import "./aiWidget.scss";
import apiRequest from "../../lib/apiRequest";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// Icons
const SparkleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/>
    <path d="m6 6 12 12"/>
  </svg>
);

const MinimizeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"/>
    <path d="M22 2 11 13"/>
  </svg>
);

const NewChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14m-7-7h14"/>
  </svg>
);

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
    <div className={`aiWidget ${isOpen ? "open" : ""} ${isMinimized ? "minimized" : ""}`}>
      {/* Floating Trigger Button */}
      <button 
        className={`widgetTrigger ${isOpen ? "hidden" : ""}`} 
        onClick={toggleWidget}
        aria-label="Open AI Assistant"
      >
        <SparkleIcon />
        <span className="pulseRing"></span>
      </button>

      {/* Widget Panel */}
      {isOpen && (
        <div className="widgetPanel animate-scaleIn">
          {/* Header */}
          <div className="widgetHeader">
            <div className="headerLeft">
              <div className="aiAvatar">
                <SparkleIcon />
              </div>
              <div className="headerInfo">
                <h3>Runo AI</h3>
                <span className={`status ${loading ? "thinking" : "online"}`}>
                  {loading ? "Thinking..." : "Online"}
                </span>
              </div>
            </div>
            <div className="headerActions">
              <button onClick={handleNewChat} title="New Chat">
                <NewChatIcon />
              </button>
              <button onClick={minimizeWidget} title="Minimize">
                <MinimizeIcon />
              </button>
              <button onClick={closeWidget} title="Close">
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="widgetMessages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.isAi ? "ai" : "user"} animate-fadeInUp`}>
                {m.isAi && (
                  <div className="aiAvatar">
                    <SparkleIcon />
                  </div>
                )}
                <div className="messageBubble">
                  <p>{m.text}</p>
                  {m.link && (
                    <Link to={m.link} className="actionLink" onClick={closeWidget}>
                      View Listings →
                    </Link>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message ai">
                <div className="aiAvatar">
                  <SparkleIcon />
                </div>
                <div className="messageBubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          {/* Input */}
          <div className="widgetInput">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about properties..."
              disabled={loading}
            />
            <button 
              onClick={handleSend} 
              disabled={loading || !input.trim()}
              className="sendBtn"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIWidget;
