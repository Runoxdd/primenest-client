import { useContext, useEffect, useRef, useState } from "react";
import { Await, useLoaderData } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Search,
  ArrowLeft,
  Plus,
  Users,
  Loader2
} from "lucide-react";
import "./messagesPage.scss";

function MessagesPage() {
  const [chat, setChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);
  const { currentUser } = useContext(AuthContext);
  // Safe context access with fallback for SSR
  const socketContext = useContext(SocketContext) || {};
  const socket = socketContext.socket;
  const messageEndRef = useRef();
  const data = useLoaderData();
  const decrease = useNotificationStore((state) => state.decrease);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
      setIsMobileListOpen(false);
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
      socket.off("getMessage");
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({
            ...prev,
            messages: [...prev.messages, data],
          }));
          read();
        }
      });
    }

    return () => {
      if (socket) socket.off("getMessage");
    };
  }, [socket, chat]);

  return (
    <div className="messages-page">
      <Await
        resolve={data.chatResponse}
        errorElement={<div className="error">Error loading chats</div>}
      >
        {(chatData) => {
          const chats = chatData.data || [];
          const filteredChats = chats.filter((c) =>
            c.receiver.username.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return (
            <div className="messages-container">
              {/* Conversations Sidebar */}
              <div className={`conversations-sidebar ${isMobileListOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                  <h1>Messages</h1>
                  <span className="message-count">{chats.length}</span>
                </div>

                {/* Search */}
                <div className="search-wrapper">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Conversations List */}
                <div className="conversations-list">
                  {filteredChats.length === 0 ? (
                    <div className="empty-state">
                      <MessageCircle size={48} />
                      <h3>No conversations yet</h3>
                      <p>Start chatting with property owners</p>
                    </div>
                  ) : (
                    filteredChats.map((c, index) => (
                      <motion.div
                        key={c.id}
                        className={`conversation-item ${
                          !c.seenBy.includes(currentUser.id) && chat?.id !== c.id
                            ? "unread"
                            : ""
                        } ${chat?.id === c.id ? "active" : ""}`}
                        onClick={() => handleOpenChat(c.id, c.receiver)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <div className="conversation-avatar">
                          <img
                            src={c.receiver.avatar || "/noavatar.jpg"}
                            alt={c.receiver.username}
                          />
                          {!c.seenBy.includes(currentUser.id) &&
                            chat?.id !== c.id && <span className="unread-dot" />}
                        </div>
                        <div className="conversation-content">
                          <div className="conversation-header">
                            <span className="conversation-name">
                              {c.receiver.username}
                            </span>
                            <span className="conversation-time">
                              {format(c.updatedAt)}
                            </span>
                          </div>
                          <p className="conversation-preview">{c.lastMessage}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Window */}
              <div className={`chat-window ${!isMobileListOpen ? "open" : ""}`}>
                {chat ? (
                  <>
                    {/* Chat Header */}
                    <div className="chat-header">
                      <button
                        className="back-btn"
                        onClick={() => setIsMobileListOpen(true)}
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <div className="chat-user">
                        <img
                          src={chat.receiver.avatar || "/noavatar.jpg"}
                          alt={chat.receiver.username}
                        />
                        <div className="user-info">
                          <span className="user-name">{chat.receiver.username}</span>
                          <span className="user-status">
                            <span className="status-dot" />
                            Online
                          </span>
                        </div>
                      </div>
                      <div className="chat-actions">
                        <button className="action-btn">
                          <Phone size={18} />
                        </button>
                        <button className="action-btn">
                          <Video size={18} />
                        </button>
                        <button className="action-btn">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="chat-messages">
                      {chat.messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          className={`message ${
                            message.userId === currentUser.id ? "own" : ""
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                        >
                          <div className="message-bubble">
                            <p>{message.text}</p>
                            <div className="message-meta">
                              <span className="message-time">
                                {format(message.createdAt)}
                              </span>
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
                  </>
                ) : (
                  <div className="no-chat-selected">
                    <div className="no-chat-content">
                      <MessageCircle size={64} />
                      <h2>Select a conversation</h2>
                      <p>Choose from your existing conversations or start a new one</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </Await>
    </div>
  );
}

export default MessagesPage;
