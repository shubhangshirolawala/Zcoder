const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Rooms/Actions');

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const userSocketMap = {};
const socketRoomMap = {}; // Track which room each socket is in

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(socketId => ({
    socketId,
    username: userSocketMap[socketId],
  }));
}

function cleanupSocket(socketId) {
  const roomId = socketRoomMap[socketId];
  const username = userSocketMap[socketId]; // capture before delete
  
  if (roomId && username) {
    io.to(roomId).emit('user-left', { socketId, username });
    console.log(`[SERVER] Cleaned up ${username} (${socketId}) from room ${roomId}`);
  }

  delete userSocketMap[socketId];
  delete socketRoomMap[socketId];
}


io.on('connection', socket => {
  console.log('[SERVER] socket connected', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    console.log(`[SERVER][JOIN] ${username} (${socket.id}) -> room ${roomId}`);
    
    // Store mappings
    userSocketMap[socket.id] = username;
    socketRoomMap[socket.id] = roomId;
    
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);
    const otherUsers = clients.filter(c => c.socketId !== socket.id).map(c => c.socketId);

    console.log('[SERVER] clients in room after join:', clients.map(c => `${c.username}(${c.socketId})`));

    // Notify existing users that new user joined
    socket.to(roomId).emit('user-joined', { socketId: socket.id, username });

    // Send list of existing users to the new user
    io.to(socket.id).emit('all-users', { users: otherUsers });

    // Broadcast updated member list for UI
    io.in(roomId).emit(ACTIONS.JOINED, {
      clients,
      username,
      socketId: socket.id,
    });
  });

  socket.on('signal', ({ to, signal }) => {
    console.log(`[SERVER][SIGNAL] from ${socket.id} -> to ${to}`);
    io.to(to).emit('signal', { from: socket.id, signal });
  });

  socket.on('media-ready', ({ roomId }) => {
    console.log(`[SERVER] media-ready from ${socket.id} for room ${roomId}`);
    socket.to(roomId).emit('user-media-ready', { socketId: socket.id });
  });

  socket.on('media-stopped', ({ roomId }) => {
    console.log(`[SERVER] media-stopped from ${socket.id} for room ${roomId}`);
    socket.to(roomId).emit('user-media-stopped', { socketId: socket.id });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Explicit leave event (manual button press)
  socket.on('leave-room', ({ roomId }) => {
    console.log(`[SERVER][LEAVE-ROOM] ${socket.id} leaving room ${roomId}`);

    socket.leave(roomId);

    // // Cleanup user
    // cleanupSocket(socket.id);
    socket.disconnect(true);
  });

  // Handle refresh / unexpected disconnect
  socket.on('disconnect', (reason) => {
    console.log(`[SERVER] socket disconnected: ${socket.id}, reason: ${reason}`);
    cleanupSocket(socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
