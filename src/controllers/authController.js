const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../config/db');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: name, email, and password are required'
    });
  }

  const users = readData('users');
  const userExists = users.find((u) => u.email === email);

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeData('users', users);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email },
    process.env.JWT_SECRET || 'super_secret_jwt_key_12345',
    { expiresIn: '1d' }
  );

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { id: newUser.id, name: newUser.name, email: newUser.email },
    token
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: email and password are required'
    });
  }

  const users = readData('users');
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'super_secret_jwt_key_12345',
    { expiresIn: '1d' }
  );

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { id: user.id, name: user.name, email: user.email },
    token
  });
};

module.exports = { register, login };
