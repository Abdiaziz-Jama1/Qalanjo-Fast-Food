const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const connectDB = require('../server/config/db');

const app = express();

let isConnected = false;

const connectOnce = async () => {
  if (isConnected) return;
  await connectDB();
  isConnected = true;
};

app.use(async (req, res, next) => {
  await connectOnce();
  next();
});

app.use(helmet());
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(s => s.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(null, true);
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
app.use('/api', generalLimiter);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { message: 'Too many authentication attempts, please try again later' } });
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/categories', require('../server/routes/categories'));
app.use('/api/foods', require('../server/routes/foods'));
app.use('/api/orders', require('../server/routes/orders'));
app.use('/api/reviews', require('../server/routes/reviews'));
app.use('/api/users', require('../server/routes/users'));
app.use('/api/settings', require('../server/routes/settings'));
app.use('/api/upload', require('../server/routes/upload'));
app.use('/api/seed', require('../server/routes/seed'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

app.use(require('../server/middleware/errorHandler'));

module.exports = app;
