const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Register Page
router.get('/register', (req, res) => {
  res.render('register');
});

// Register Handle
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  let user = await User.findOne({ username });
  if (user) {
    return res.send('User already exists');
  }

  user = new User({ username, password });
  await user.save();
  res.redirect('/users/login');
});

// Login Page
router.get('/login', (req, res) => {
  res.render('login');
});

// Login Handle
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.send('Invalid username or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.send('Invalid username or password');

  req.session.user = user;
  res.redirect('/users/dashboard');
});

// Dashboard
router.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/users/login');
  res.render('dashboard', { username: req.session.user.username });
});

// Logout (using POST request)
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session: ', err);
      return res.redirect('/users/dashboard'); // Redirect back to dashboard if an error occurs
    }
    res.clearCookie('connect.sid'); // Optional: Clear the session cookie
    res.render('logout'); // Render the logout.ejs page
  });
});

module.exports = router;
