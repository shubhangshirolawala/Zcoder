// messageServer.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

// --- Connect MongoDB ---
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("[MESSAGE SERVER] Connected to MongoDB");
}).catch(err => {
  console.error("[MESSAGE SERVER] MongoDB connection error:", err);
});

// --- Import Message model ---
const Message = require("./server/models/Message");

// --- Express + Socket.IO setup ---
const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

// --- In-memory maps for online users ---
const onlineUsers = new Map();   // userId -> Set(socketIds)
const socketToUser = new Map();  // socketId -> userId

io.on("connection", (socket) => {
  console.log("[MESSAGE SERVER] Socket connected:", socket.id);

  // --- Add user ---
  socket.on("add-user", async (payload) => {
    try {
      const userId = typeof payload === "string" ? payload : (payload && payload.userId);
      if (!userId) {
        console.warn("[MESSAGE SERVER] add-user missing userId");
        return;
      }

      // track online users
      const set = onlineUsers.get(userId) || new Set();
      set.add(socket.id);
      onlineUsers.set(userId, set);
      socketToUser.set(socket.id, userId);

      console.log(`[MESSAGE SERVER] User added: ${userId} -> ${socket.id}`);

      // deliver pending messages
      try {
        const pending = await Message.find({ to: userId, delivered: false }).sort({ createdAt: 1 });
        if (pending.length) {
          for (const msg of pending) {
            socket.emit("msg-receive", {
              from: msg.from,
              message: msg.message,
              _id: msg._id,
              createdAt: msg.createdAt,
              localId: msg.localId || null,
            });
            msg.delivered = true;
            await msg.save();
          }
          console.log(`[MESSAGE SERVER] Delivered ${pending.length} pending messages to ${userId}`);
        }
      } catch (err) {
        console.error("[MESSAGE SERVER] Error fetching/delivering pending messages:", err);
      }
    } catch (err) {
      console.error("[MESSAGE SERVER] add-user handler error:", err);
    }
  });

  // --- Send message ---
  socket.on("send-msg", async (payload) => {
    try {
      const { from, to, msg, localId } = payload || {};
      if (!from || !to || typeof msg === "undefined") {
        console.warn("[MESSAGE SERVER] send-msg invalid payload:", payload);
        return;
      }

      // ensure socket matches user
      const mappedUser = socketToUser.get(socket.id);
      if (mappedUser && mappedUser !== from) {
        console.warn(`[MESSAGE SERVER] socket ${socket.id} mapped to ${mappedUser} but payload says from=${from}`);
      }

      // find recipient sockets
      const recipientSet = onlineUsers.get(to);

      // persist message
      let savedDoc = null;
      try {
        savedDoc = await Message.create({
          from,
          to,
          message: msg,
          delivered: recipientSet && recipientSet.size > 0,
          localId: localId || undefined,
          createdAt: new Date(),
        });
      } catch (err) {
        console.error("[MESSAGE SERVER] Error saving message to DB:", err);
      }

      // emit to recipient if online
      if (recipientSet && recipientSet.size > 0) {
        for (const sId of recipientSet) {
          io.to(sId).emit("msg-receive", {
            from,
            message: msg,
            _id: savedDoc ? savedDoc._id : null,
            createdAt: savedDoc ? savedDoc.createdAt : new Date(),
            localId: savedDoc ? savedDoc.localId || null : (localId || null),
          });
        }
        // mark delivered
        if (savedDoc) {
          savedDoc.delivered = true;
          await savedDoc.save();
        }
        console.log(`[MESSAGE SERVER] Delivered: ${from} -> ${to} : ${msg}`);
      } else {
        console.log(`[MESSAGE SERVER] User ${to} is offline. Message saved as pending.`);
      }

      // ack sender
      io.to(socket.id).emit("message-sent-ack", {
        localId: localId || null,
        _id: savedDoc ? savedDoc._id : null,
        delivered: savedDoc ? savedDoc.delivered : false,
        createdAt: savedDoc ? savedDoc.createdAt : new Date(),
      });
    } catch (err) {
      console.error("[MESSAGE SERVER] send-msg handler error:", err);
    }
  });

  // --- Disconnect ---
  socket.on("disconnect", () => {
    console.log("[MESSAGE SERVER] Socket disconnected:", socket.id);
    const userId = socketToUser.get(socket.id);
    if (userId) {
      const s = onlineUsers.get(userId);
      if (s) {
        s.delete(socket.id);
        if (s.size === 0) onlineUsers.delete(userId);
      }
      socketToUser.delete(socket.id);
      console.log(`[MESSAGE SERVER] User logged out: ${userId}`);
    }
  });

  socket.on("error", (err) => {
    console.error("[MESSAGE SERVER] Socket error:", err);
  });
});

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => console.log(`[MESSAGE SERVER] running on ${PORT}`));
