const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  register,
  login,
  resetToken,
  VerifyResetToken,
} = require('../controllers/auth');

// Routes
router.post('/register', register);
router.post('/login', login);
router.put('/resets-password', resetToken);
router.delete('/verify-reset-token/:token', VerifyResetToken);

module.exports = router;



