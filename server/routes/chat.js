const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/chatController');
const authenticateUser = require('../middleware/authentication');

// POST /api/v1/chat
router.post('/',chatWithAI);

module.exports = router;
