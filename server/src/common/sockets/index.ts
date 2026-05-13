import type { Server as HttpServer } from "node:http";
import { Server as IOServer } from "socket.io";

let io: IOServer | null = null;

export const initSocket = (httpServer: HttpServer): IOServer => {
  io = new IOServer(httpServer, {
    cors: {
      origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(","),
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("poll:join", (pollId: string) => {
      if (typeof pollId === "string" && pollId.length > 0) {
        socket.join(`poll:${pollId}`);
      }
    });

    socket.on("poll:leave", (pollId: string) => {
      if (typeof pollId === "string" && pollId.length > 0) {
        socket.leave(`poll:${pollId}`);
      }
    });
  });

  return io;
};

export const getIO = (): IOServer => {
  if (!io) throw new Error("Socket.io not initialised — call initSocket first");
  return io;
};

export interface PollResponseEvent {
  pollId: string;
  totalResponses: number;

  optionCounts: Record<string, number>;
}

export const emitPollResponse = (event: PollResponseEvent): void => {
  if (!io) return;
  io.to(`poll:${event.pollId}`).emit("poll:response", event);
};

export const emitPollPublished = (pollId: string): void => {
  if (!io) return;
  io.to(`poll:${pollId}`).emit("poll:published", { pollId });
};

export const emitPollClosed = (pollId: string): void => {
  if (!io) return;
  io.to(`poll:${pollId}`).emit("poll:closed", { pollId });
};
