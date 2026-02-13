import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  User,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck
} from "lucide-react";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const decrease = useNotificationStore((state) => state.decrease);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");
    if (!text) return;
    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: {
          ...res.data,
          chatId: chat.id,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      // FIX: Kill old listeners before starting a new one to prevent double messages
      socket.off("getMessage");

      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ 
            ...prev, 
            messages: [...prev.messages, data] 
          }));
          read();
        }
      });
    }
    
    // Cleanup on unmount or chat switch
    return () => {
      if (socket) socket.off("getMessage");
    };
  }, [socket, chat]);

  return (
    <div className="chat-container">
      {/* Conversations List */}
      <div className="conversations-list">
        <div className="list-header">
          <h2>Messages</h2>
          <span className="message-count">{chats?.length || 0}</span>
        </div>

        <div className="conversations">
          {chats?.map((c, index) => (
            <motion.div
              key={c.id}
              className={`conversation ${(!c.seenBy.includes(currentUser.id) && chat?.id !== c.id) ? "unread" : ""} ${chat?.id === c.id ? "active" : ""}`}
              onClick={() => handleOpenChat(c.id, c.receiver)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="conversation-avatar">
                <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
                {(!c.seenBy.includes(currentUser.id) && chat?.id !== c.id) && (
                  <span className="unread-dot" />
                )}
              </div>
              <div className="conversation-info">
                <span className="conversation-name">{c.receiver.username}</span>
                <p className="conversation-preview">{c.lastMessage}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Box */}
      <AnimatePresence>
        {chat && (
          <motion.div
            className="chat-box"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-user">
                <img src={chat.receiver.avatar || "/noavatar.jpg"} alt="" />
                <div className="user-info">
                  <span className="user-name">{chat.receiver.username}</span>
                  <span className="user-status">Online</span>
                </div>
              </div>
              <div className="chat-actions">
                <button className="action-btn">
                  <Phone size={18} />
                </button>
                <button className="action-btn">
                  <Video size={18} />
                </button>
                <button className="action-btn" onClick={() => setChat(null)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {chat.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={`message ${message.userId === currentUser.id ? "own" : ""}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <div className="message-bubble">
                    <p>{message.text}</p>
                    <div className="message-meta">
                      <span className="message-time">{format(message.createdAt)}</span>
                      {message.userId === currentUser.id && (
                        <span className="message-status">
                          <CheckCheck size={14} />
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messageEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="chat-input">
              <input
                type="text"
                name="text"
                placeholder="Type a message..."
                autoComplete="off"
              />
              <motion.button
                type="submit"
                className="send-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={18} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Chat;
