const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Rooms/Actions');
const axios = require('axios');

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// --- ROOM LOGIC ---
const userSocketMap = {}; // socketId -> username
const socketRoomMap = {}; // socketId -> roomId

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(socketId => ({
    socketId,
    username: userSocketMap[socketId],
  }));
}

function cleanupRoomSocket(socketId) {
  const roomId = socketRoomMap[socketId];
  const username = userSocketMap[socketId];

  if (roomId && username) {
    io.to(roomId).emit('user-left', { socketId, username });
    console.log(`[ROOM] Cleaned up ${username} (${socketId}) from room ${roomId}`);
  }

  delete userSocketMap[socketId];
  delete socketRoomMap[socketId];
}

io.on('connection', socket => {
  console.log('[SERVER] socket connected', socket.id);

  // -------------------- ROOM EVENTS --------------------
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socketRoomMap[socket.id] = roomId;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);
    const otherUsers = clients.filter(c => c.socketId !== socket.id).map(c => c.socketId);

    socket.to(roomId).emit('user-joined', { socketId: socket.id, username });
    io.to(socket.id).emit('all-users', { users: otherUsers });
    io.in(roomId).emit(ACTIONS.JOINED, { clients, username, socketId: socket.id });

    console.log('[ROOM] Clients in room:', clients.map(c => `${c.username}(${c.socketId})`));
  });

  socket.on('signal', ({ to, signal }) => {
    io.to(to).emit('signal', { from: socket.id, signal });
  });

  socket.on('media-ready', ({ roomId }) => {
    socket.to(roomId).emit('user-media-ready', { socketId: socket.id });
  });

  socket.on('media-stopped', ({ roomId }) => {
    socket.to(roomId).emit('user-media-stopped', { socketId: socket.id });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on('leave-room', ({ roomId }) => {
    socket.leave(roomId);
    cleanupRoomSocket(socket.id);
    socket.disconnect(true);
  });

});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
