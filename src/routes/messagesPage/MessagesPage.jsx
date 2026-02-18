import { useContext, useEffect, useRef, useState } from "react";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  CheckCheck,
  Search,
  ArrowLeft,
  Plus,
  Users,
  Loader2,
  X
} from "lucide-react";
import "./messagesPage.scss";

function MessagesPage() {
  const [chat, setChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Safe context access with fallback for SSR
  const socketContext = useContext(SocketContext) || {};
  const socket = socketContext.socket;
  const messageEndRef = useRef();
  const chatMessagesRef = useRef();
  const data = useLoaderData();
  const decrease = useNotificationStore((state) => state.decrease);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);

  const handleOpenChat = async (id, receiver) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await apiRequest("/chats/" + id);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
      setIsMobileListOpen(false);
    } catch (err) {
      console.log("Error opening chat:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");
    if (!text || !text.trim()) return;
    
    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text: text.trim() });
      setChat((prev) => ({ 
        ...prev, 
        messages: [...prev.messages, res.data] 
      }));
      e.target.reset();
      
      if (socket) {
        socket.emit("sendMessage", {
          receiverId: chat.receiver.id,
          data: {
            ...res.data,
            chatId: chat.id,
          },
        });
      }
    } catch (err) {
      console.log("Error sending message:", err);
    }
  };

  // Socket message listener
  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log("Error marking chat as read:", err);
      }
    };

    if (chat && socket) {
      const handleMessage = (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({
            ...prev,
            messages: [...prev.messages, data],
          }));
          read();
        }
      };

      socket.off("getMessage");
      socket.on("getMessage", handleMessage);

      return () => {
        socket.off("getMessage", handleMessage);
      };
    }
  }, [socket, chat]);

  return (
    <div className="messages-page">
      <Await
        resolve={data.chatResponse}
        errorElement={<div className="error">Error loading chats</div>}
      >
        {(chatData) => {
          // Deduplicate chats by receiver ID
          const rawChats = chatData.data || [];
          const uniqueChats = rawChats.reduce((acc, chat) => {
            const receiverId = chat.receiver?.id;
            if (receiverId && !acc.find(c => c.receiver?.id === receiverId)) {
              acc.push(chat);
            }
            return acc;
          }, []);
          
          const filteredChats = uniqueChats.filter((c) =>
            c.receiver?.username?.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return (
            <div className="messages-container">
              {/* Conversations Sidebar */}
              <div className={`conversations-sidebar ${isMobileListOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                  <div className="header-title">
                    <h1>Messages</h1>
                    <span className="message-count">{uniqueChats.length}</span>
                  </div>
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
                  {searchQuery && (
                    <button 
                      className="clear-search"
                      onClick={() => setSearchQuery("")}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Conversations List */}
                <div className="conversations-list">
                  {filteredChats.length === 0 ? (
                    <div className="empty-state">
                      <MessageCircle size={48} strokeWidth={1.5} />
                      <h3>{searchQuery ? "No matches found" : "No conversations yet"}</h3>
                      <p>{searchQuery ? "Try a different search" : "Start chatting with property owners"}</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {filteredChats.map((c, index) => (
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
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <div className="conversation-avatar">
                            <img
                              src={c.receiver.avatar || "/noavatar.jpg"}
                              alt={c.receiver.username}
                              onError={(e) => {
                                e.target.src = "/noavatar.jpg";
                              }}
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
                            <p className="conversation-preview">
                              {c.lastMessage || "No messages yet"}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
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
                        aria-label="Back to conversations"
                      >
                        <ArrowLeft size={27} />
                      </button>
                      <div className="chat-user">
                        <img
                          src={chat.receiver.avatar || "/noavatar.jpg"}
                          alt={chat.receiver.username}
                          onError={(e) => {
                            e.target.src = "/noavatar.jpg";
                          }}
                        />
                        <div className="user-info">
                          <span className="user-name">{chat.receiver.username}</span>
                          <span className="user-status">
                            <span className="status-dot" />
                            Online
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Messages - Scrollable Container */}
                    <div className="chat-messages" ref={chatMessagesRef}>
                      {chat.messages && chat.messages.length > 0 ? (
                        <>
                          {chat.messages.map((message, index) => (
                            <motion.div
                              key={message.id || index}
                              className={`message ${
                                message.userId === currentUser.id ? "own" : ""
                              }`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: Math.min(index * 0.02, 0.5) }}
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
                        </>
                      ) : (
                        <div className="no-messages">
                          <MessageCircle size={32} strokeWidth={1.5} />
                          <p>No messages yet. Say hello!</p>
                        </div>
                      )}
                      <div ref={messageEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="chat-input">
                      <input
                        type="text"
                        name="text"
                        placeholder="Type a message..."
                        autoComplete="off"
                        disabled={isLoading}
                      />
                      <motion.button
                        type="submit"
                        className="send-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading}
                        aria-label="Send message"
                      >
                        <Send size={18} />
                      </motion.button>
                    </form>
                  </>
                ) : (
                  <div className="no-chat-selected">
                    <div className="no-chat-content">
                      <MessageCircle size={64} strokeWidth={1.5} />
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
