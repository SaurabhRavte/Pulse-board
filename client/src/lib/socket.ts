import { io, type Socket } from "socket.io-client";

const SOCKET_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "http://localhost:3000";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};

export interface PollResponseEvent {
  pollId: string;
  totalResponses: number;
  optionCounts: Record<string, number>;
}

export interface PollPublishedEvent {
  pollId: string;
}

export interface PollClosedEvent {
  pollId: string;
}

export const subscribeToPoll = (
  pollId: string,
  handlers: {
    onResponse?: (event: PollResponseEvent) => void;
    onPublished?: (event: PollPublishedEvent) => void;
    onClosed?: (event: PollClosedEvent) => void;
  },
): (() => void) => {
  const s = getSocket();
  s.emit("poll:join", pollId);
  if (handlers.onResponse) s.on("poll:response", handlers.onResponse);
  if (handlers.onPublished) s.on("poll:published", handlers.onPublished);
  if (handlers.onClosed) s.on("poll:closed", handlers.onClosed);

  return () => {
    s.emit("poll:leave", pollId);
    if (handlers.onResponse) s.off("poll:response", handlers.onResponse);
    if (handlers.onPublished) s.off("poll:published", handlers.onPublished);
    if (handlers.onClosed) s.off("poll:closed", handlers.onClosed);
  };
};
