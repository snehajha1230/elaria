// src/pages/TestSocket.jsx
import { useEffect } from "react";
import { io } from "socket.io-client";

const TestSocket = () => {
  useEffect(() => {
    const socket = io("http://localhost:5050", {
      transports: ["websocket"],
      upgrade: false,
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to test server:", socket.id);
      socket.emit("pingTest");
    });

    socket.on("pongTest", (data) => {
      console.log("✅ Server response:", data);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Disconnected:", reason);
    });

    return () => socket.disconnect();
  }, []);

  return <div>Testing Socket Connection...</div>;
};

export default TestSocket;
