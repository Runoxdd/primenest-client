import { useState, useEffect, useRef, useContext } from "react";
import apiRequest from "../../lib/apiRequest";
import "./assistantPage.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function AssistantPage() {
  const { currentUser } = useContext(AuthContext);
  const chatKey = currentUser ? `primenest_chat_${currentUser.id}` : "primenest_chat_history";

  const [messages, setMessages] = useState(() => {
    const savedChat = localStorage.getItem(chatKey);
    return savedChat ? JSON.parse(savedChat) : [
      { 
        text: "Hi there! I'm Runo, your global PrimeNest advisor. How can I assist your property search today?", 
        isAi: true 
      }
    ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(chatKey, JSON.stringify(messages));
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatKey]);

  const handleNewChat = () => {
    const initialMsg = [{ 
      text: "New session initialized. How can I help?", 
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
        // We keep explanation in the object for data integrity, 
        // but we simply won't render it below.
        explanation: res.data.explanation 
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev, 
        { text: "Connection interrupted. Please re-establish uplink.", isAi: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assistantPage">
      <div className="gradient-bg"></div>
      
      <div className="contentWrapper">
        <section className="heroSection">
          <div className="textContainer">
            <h1>Global <span>Intelligence</span></h1>
            <p>
              Your worldwide real estate companion. Runo leverages hybrid AI to navigate 
              international property markets instantly.
            </p>
          </div>
          <div className="imageContainer">
            <img src="/ai-visual.png" alt="AI Visual" />
          </div>
        </section>

        <section className="featuresGrid">
          <div className="card">
            <img src="/nlp.png" alt="" />
            <h3>Intent Detection</h3>
            <p>Advanced context handling for global queries.</p>
          </div>
          <div className="card">
            <img src="/secure.png" alt="" />
            <h3>Secure Session</h3>
            <p>End-to-end encryption for your property search.</p>
          </div>
          <div className="card">
            <img src="/logic.png" alt="" />
            <h3>Market Analysis</h3>
            <p>Real-time data processing across 50+ countries.</p>
          </div>
        </section>

        <section className="chatSection">
          <div className="chatHeader">
            <div className="status">
              <div className="dot"></div>
              <span>{loading ? "PROCESSING..." : "RUNO ONLINE"}</span>
            </div>
            <div className="headerActions">
              <button className="newChatBtn" onClick={handleNewChat}>
                <span className="plus">+</span> NEW SESSION
              </button>
            </div>
          </div>
          
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`messageRow ${m.isAi ? "ai" : "user"}`}>
                <div className="messageBubble">
                  <p>{m.text}</p>
                  {/* EXPLANATION REMOVED FROM HERE */}
                  {m.link && (
                    <Link to={m.link} className="actionBtn">
                      View Matching Listings
                    </Link>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="messageRow ai">
                <div className="messageBubble loading-bubble">
                  Analyzing Global Data Stream...
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
        </section>
      </div>

      <div className="stickyInputArea">
        <div className="inputContainer">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Search London apartments, Tokyo lofts..." 
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssistantPage;