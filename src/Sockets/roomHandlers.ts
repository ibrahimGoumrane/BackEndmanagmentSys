// /sockets/roomHandlers.ts
import { Socket, Server } from 'socket.io';

export function setupRoomHandlers(socket: Socket, io: Server) {
  socket.on('join-team', (teamId: string) => {
    if (teamId) {
      socket.join(teamId);
    }
  });
}
