import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

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
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((c) => (
          <div
            className={`message ${(!c.seenBy.includes(currentUser.id) && chat?.id !== c.id) ? "unread" : ""}`}
            key={c.id}
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <div className="avatarWrapper">
              <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
              {(!c.seenBy.includes(currentUser.id) && chat?.id !== c.id) && <div className="onlineDot" />}
            </div>
            <div className="messageInfo">
              <span>{c.receiver.username}</span>
              <p>{c.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "/noavatar.jpg"} alt="" />
              <b>{chat.receiver.username}</b>
            </div>
            <span className="close" onClick={() => setChat(null)}>✕</span>
          </div>
          <div className="center">
            {chat.messages.map((message) => (
              <div
                className={`chatMessage ${message.userId === currentUser.id ? "own" : ""}`}
                key={message.id}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text" placeholder="Send a secure message..."></textarea>
            <button>
               <img src="/send.png" alt="Send" style={{width: '20px', filter: 'brightness(0) invert(1)'}} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;