import { Server } from 'socket.io';

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true
    }
  });

  io.on('connection', socket => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
  });
}

export { io };
