import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { setupMessageHandlers } from "./messageHandlers";
import { setupRoomHandlers } from "./roomHandlers";

export function setupSocketServer(
  httpServer: HttpServer,
  corsOptions: {
    origin: string;
    methods: string[];
    credentials: boolean;
  }
) {
  const io = new Server(httpServer, {
    cors: {
      origin: corsOptions?.origin,
      methods: corsOptions?.methods,
      credentials: corsOptions?.credentials,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Setup handlers
    setupMessageHandlers(socket, io);
    setupRoomHandlers(socket, io);

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  return io;
}
