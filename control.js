const User = require('./modal');
const bcrypt = require('bcryptjs');git add .
const jwt = require('jsonwebtoken');

const jwtKey = 'e-comm';

const newuser = async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    if (role === 'employer' && !company) {
      return res.status(400).json({ msg: 'Company name is required for employers' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role, company });
    const savedUser = await user.save();

    jwt.sign({ userId: savedUser._id }, jwtKey, { expiresIn: '2h' }, (err, token) => {
      if (err) return res.status(500).json({ msg: 'Token generation failed' });
      res.status(201).json({ user: savedUser, token });
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const checkLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    jwt.sign({ userId: user._id }, jwtKey, { expiresIn: '2h' }, (err, token) => {
      if (err) return res.status(500).json({ msg: 'Token generation failed' });
      res.status(200).json({ msg: 'Login successful', user, token });
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ msg: 'Token required' });

  const token = authHeader.split(' ')[1]; // Extract token after 'Bearer'

  if (!token) return res.status(403).json({ msg: 'Token malformed' });

  jwt.verify(token, jwtKey, (err, decoded) => {
    if (err) return res.status(401).json({ msg: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

const validUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { newuser, checkLogin, verifyToken, validUser };
