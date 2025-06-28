import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const RECONNECT_INTERVAL_MS = 5000;

export const useWebSocket = (
  onStatusUpdate,
  onAnnouncement,
  onSerialRequest
) => {
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      const socket = io("http://localhost:4000", {
        withCredentials: true,
        reconnectionAttempts: 5,
        reconnectionDelay: RECONNECT_INTERVAL_MS,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Socket.IO connected");
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket.IO disconnected:", reason);
      });

      socket.on("statusUpdate", (payload) => {
        if (typeof onStatusUpdate === "function") {
          onStatusUpdate(payload);
        }
      });

      socket.on("announcement", (payload) => {
        if (typeof onAnnouncement === "function") {
          onAnnouncement(payload);
        }
      });

      socket.on("serialRequest", (payload) => {
        if (typeof onSerialRequest === "function") {
          onSerialRequest(payload);
        }
      });

      socket.on("connect_error", (error) => {
        console.error("Connection error:", error.message);
      });
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [onStatusUpdate, onAnnouncement, onSerialRequest]);
};
