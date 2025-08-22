// messageServer.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});


const onlineUsers = new Map();
const socketToUser = new Map();

io.on("connection", (socket) => {
  console.log("[MESSAGE SERVER] Socket connected:", socket.id);

  // add-user: payload can be a string userId or { userId }
  socket.on("add-user", async (payload) => {
    try {
      const userId = typeof payload === "string" ? payload : (payload && payload.userId);
      if (!userId) {
        console.warn("[MESSAGE SERVER] add-user missing userId");
        return;
      }

      const set = onlineUsers.get(userId) || new Set();
      set.add(socket.id);
      onlineUsers.set(userId, set);
      socketToUser.set(socket.id, userId);

      console.log(`[MESSAGE SERVER] User added: ${userId} -> ${socket.id}`);

      // deliver pending messages if Message model exists
      if (Message) {
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
              // mark delivered — if you want stricter semantics, mark on client ack instead
              msg.delivered = true;
              await msg.save();
            }
            console.log(`[MESSAGE SERVER] Delivered ${pending.length} pending messages to ${userId}`);
          }
        } catch (err) {
          console.error("[MESSAGE SERVER] Error fetching or delivering pending messages:", err);
        }
      }
    } catch (err) {
      console.error("[MESSAGE SERVER] add-user handler error:", err);
    }
  });

  // send-msg: payload { from, to, msg, localId? }
  socket.on("send-msg", async (payload) => {
    try {
      const { from, to, msg } = payload || {};
      if (!from || !to || typeof msg === "undefined") {
        console.warn("[MESSAGE SERVER] send-msg invalid payload:", payload);
        return;
      }

      // optional check: ensure this socket is associated with `from`
      const mappedUser = socketToUser.get(socket.id);
      if (mappedUser && mappedUser !== from) {
        console.warn(`[MESSAGE SERVER] socket ${socket.id} mapped to ${mappedUser} but payload says from=${from}`);
        // not rejecting to keep simple style; consider enforcing auth in production
      }

      // persist message if Message model is available
      let savedDoc = null;
      if (Message) {
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
      }

      // emit to all sockets for recipient
      const recipientSet = onlineUsers.get(to);
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
        // mark delivered in DB if applicable
        if (savedDoc) {
          try {
            savedDoc.delivered = true;
            await savedDoc.save();
          } catch (err) {
            console.error("[MESSAGE SERVER] Error updating delivered flag:", err);
          }
        }
        console.log(`[MESSAGE SERVER] Delivered: ${from} -> ${to} : ${msg}`);
      } else {
        console.log(`[MESSAGE SERVER] User ${to} is offline. Message saved as pending.`);
      }

      // ack sender with message id and delivered flag
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
