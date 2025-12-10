import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { setupSocket } from './socket';
import { createSession, getSession } from './store';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // For development simplicity
    methods: ['GET', 'POST']
  }
});

setupSocket(io);

// API Endpoints
app.post('/api/session', (req, res) => {
  const sessionId = uuidv4();
  const session = createSession(sessionId);
  res.json(session);
});

app.get('/api/session/:id', (req, res) => {
  const session = getSession(req.params.id);
  if (session) {
    res.json(session);
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

app.get('/health', (req, res) => {
  res.send('OK');
});

// Serve static files in production
const clientBuild = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuild));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
