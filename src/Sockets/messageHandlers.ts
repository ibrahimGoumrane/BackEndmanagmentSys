// /sockets/messageHandlers.ts
import { Socket, Server } from 'socket.io';
import { TChat } from '../models/chat'; // Adjust path as needed

export function setupMessageHandlers(socket: Socket, io: Server) {
  socket.on('send-team-message', (teamMessage: TChat, teamId: string) => {
    if (teamId) {
        io.to(teamId).emit('receive-team-message', teamMessage);
    }
  });
}
