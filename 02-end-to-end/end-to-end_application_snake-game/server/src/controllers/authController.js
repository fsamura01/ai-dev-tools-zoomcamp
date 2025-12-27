const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key_123';

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user exists
    const users = db.findAll('users');
    const existingUser = users.find(u => u.username === username || u.email === email);
    
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now(), // Simple ID generation
      username,
      email,
      password: hashedPassword
    };

    db.insert('users', newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Generate token (optional for signup but good for auto-login)
    // Spec only says returns User, but usually we might want to return token too or require login.
    // Spec says 201 returns User.
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Spec says "One of email or username is required alongside password"
    if ((!username && !email) || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    }

    const users = db.findAll('users');
    const user = users.find(u => 
      (username && u.username === username) || 
      (email && u.email === email)
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    
    // Returning token along with user data so client can use it
    res.json({ ...userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
