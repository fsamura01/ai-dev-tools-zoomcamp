import { Server, Socket } from 'socket.io';
import { getSession, updateSession } from './store';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-session', (sessionId: string) => {
      const session = getSession(sessionId);
      if (session) {
        socket.join(sessionId);
        socket.emit('session-data', session);
        console.log(`Socket ${socket.id} joined session ${sessionId}`);
      } else {
        socket.emit('error', 'Session not found');
      }
    });

    socket.on('code-change', ({ sessionId, code }: { sessionId: string; code: string }) => {
      // Update session store
      updateSession(sessionId, { code });
      
      // Broadcast to others in the room
      socket.to(sessionId).emit('code-update', code);
    });

    socket.on('language-change', ({ sessionId, language }: { sessionId: string; language: 'javascript' | 'python' }) => {
        updateSession(sessionId, { language });
        socket.to(sessionId).emit('language-update', language);
    });
    
    socket.on('output-change', ({ sessionId, output }: { sessionId: string; output: string }) => {
        // We might want to persist output or just broadcast it. 
        // Persisting allows late joiners to see it.
        updateSession(sessionId, { output });
        socket.to(sessionId).emit('output-update', output);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
