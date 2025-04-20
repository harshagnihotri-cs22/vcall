const { AccessToken } = require('livekit-server-sdk');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Add auth middleware

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;

// Apply auth middleware to protect this route
router.get('/', auth, async (req, res) => {
  try {
    const { room, username } = req.query;

    if (!room || !username) {
      return res.status(400).json({ error: 'Room and username are required' });
    }

    const at = new AccessToken(API_KEY, API_SECRET, {
      identity: username,
    });

    at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true });

    const token = await at.toJwt();
    console.log(token);
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error creating LiveKit token:', error);
    return res.status(500).json({ error: 'Failed to create token' });
  }
});

module.exports = router;