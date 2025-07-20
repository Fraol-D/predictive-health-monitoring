
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const router = express.Router();

// Placeholders: fill in your real values below
const AFROMESSAGE_IDENTIFIER_ID = process.env.AFRO_MESSAGE_IDENTIFIER_ID || 'e80ad9d8-adf3-463f-80f4-7c4b39f7f164';
const AFROMESSAGE_SENDER_NAME = process.env.AFRO_MESSAGE_SENDER_NAME || '';
const AFROMESSAGE_CHALLENGE_URL = 'https://api.afromessage.com/api/challenge';
const AFROMESSAGE_VERIFY_URL = 'https://api.afromessage.com/api/verify';
const AFROMESSAGE_BEARER_TOKEN = process.env.AFRO_MESSAGE_BEARER_TOKEN || 'YOUR_BEARER_TOKEN';

// In-memory store for verification IDs
let verificationIdStore = {};

// Send OTP challenge (GET request as per docs)
router.post('/send', async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ error: 'Phone number required' });

  // Compose query params for challenge
  const params = {
    from: AFROMESSAGE_IDENTIFIER_ID,
    sender: AFROMESSAGE_SENDER_NAME,
    to: phoneNumber,
    len: 6, // 6 digit code
    t: 0,   // 0 = numeric only
    ttl: 300, // 5 minutes
    pr: '', // optional prefix
    ps: '', // optional postfix
  };
  const url = `${AFROMESSAGE_CHALLENGE_URL}?${querystring.stringify(params)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${AFROMESSAGE_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.data && response.data.acknowledge === 'success') {
      // Save verificationId for this phone number for later verification
      if (response.data.response && response.data.response.verificationId) {
        verificationIdStore[phoneNumber] = response.data.response.verificationId;
        console.log('[OTP SEND] phone:', phoneNumber, 'verificationId:', response.data.response.verificationId);
      }
      res.json({ success: true });
    } else {
      console.error('Afromessage challenge error:', response.data);
      res.status(500).json({ error: 'Failed to send OTP', details: response.data });
    }
  } catch (err) {
    console.error('Afromessage challenge error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Resend OTP challenge (same as /send, but can be called explicitly)
router.post('/resend', async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ error: 'Phone number required' });

  // Compose query params for challenge
  const params = {
    from: AFROMESSAGE_IDENTIFIER_ID,
    sender: AFROMESSAGE_SENDER_NAME,
    to: phoneNumber,
    len: 6, // 6 digit code
    t: 0,   // 0 = numeric only
    ttl: 300, // 5 minutes
    pr: '', // optional prefix
    ps: '', // optional postfix
  };
  const url = `${AFROMESSAGE_CHALLENGE_URL}?${querystring.stringify(params)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${AFROMESSAGE_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.data && response.data.acknowledge === 'success') {
      // Save verificationId for this phone number for later verification
      if (response.data.response && response.data.response.verificationId) {
        verificationIdStore[phoneNumber] = response.data.response.verificationId;
        console.log('[OTP RESEND] phone:', phoneNumber, 'verificationId:', response.data.response.verificationId);
      }
      res.json({ success: true });
    } else {
      console.error('Afromessage challenge error:', response.data);
      res.status(500).json({ error: 'Failed to resend OTP', details: response.data });
    }
  } catch (err) {
    console.error('Afromessage challenge error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
});

// Verify OTP code (GET request as per docs)
router.post('/verify', async (req, res) => {
  const { phoneNumber, code } = req.body;
  if (!phoneNumber || !code) return res.status(400).json({ error: 'Phone and code required' });

  // Use verificationId if available, else fallback to phone number
  const verificationId = verificationIdStore[phoneNumber];
  console.log('[OTP VERIFY] phone:', phoneNumber, 'verificationId:', verificationId, 'code:', code);
  const params = verificationId
    ? { vc: verificationId, code }
    : { to: phoneNumber, code };
  const url = `${AFROMESSAGE_VERIFY_URL}?${querystring.stringify(params)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${AFROMESSAGE_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.data && response.data.acknowledge === 'success') {
      // Optionally clear verificationId
      delete verificationIdStore[phoneNumber];
      res.json({ success: true });
    } else {
      console.error('Afromessage verify error:', response.data);
      res.status(400).json({ error: 'Invalid code', details: response.data });
    }
  } catch (err) {
    console.error('Afromessage verify error:', err.response?.data || err.message);
    res.status(400).json({ error: 'Invalid code' });
  }
});

module.exports = router;

// ...existing code...
