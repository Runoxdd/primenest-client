import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // 1. Create the socket with production settings
    const newSocket = io("https://primenest-socket.onrender.com", {
      withCredentials: true,
      // We prioritize websocket but allow polling for the initial handshake
      transports: ["polling", "websocket"], 
    });

    setSocket(newSocket);

    // 2. Cleanup: close the connection when the user leaves the site
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    // Only emit if the socket is connected and user exists
    if (currentUser && socket) {
      socket.emit("newUser", currentUser.id);
    }
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};