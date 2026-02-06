import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  
  // Initialize with your Render Socket URL
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // We only create the socket connection ONCE when the app mounts
    const newSocket = io("https://primenest-socket.onrender.com");
    setSocket(newSocket);

    // Clean up connection when app closes
    return () => newSocket.close();
  }, []);

  useEffect(() => {
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