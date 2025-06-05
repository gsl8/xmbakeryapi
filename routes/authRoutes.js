const express = require('express');
const router = express.Router();

const users = [];

router.post('/register', async (req, res) => {
  const { email, password, role, name, bakeryId } = req.body;
  if (!email || !password || !role || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Email already registered' });
  }
  users.push({ email, password, role, name, bakeryId: bakeryId || null, id: users.length + 1 });
  res.status(201).json({ message: 'User registered successfully', userId: users.length });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.status(200).json({ message: 'Login successful', userId: user.id });
});

module.exports = router;
