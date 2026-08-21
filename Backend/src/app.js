const express      = require('express');
const http         = require('http');
const { Server }   = require('socket.io');
const dotenv       = require('dotenv');

const helmet       = require('helmet');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');
const swaggerUi    = require('swagger-ui-express');
const swaggerSpec  = require('./config/swagger');
const connectDB    = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();


const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(s => s.trim())
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(helmet());

// Custom CORS middleware (Express 5 compatible — replaces cors package)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});
const isProduction = process.env.NODE_ENV === 'production';
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 1000 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
}));

app.use(morgan('dev'));
app.use(express.json());

const authRoutes        = require('./routes/auth.routes');
const userRoutes        = require('./routes/user.routes');
const restaurantRoutes  = require('./routes/restaurant.routes');
const menuRoutes        = require('./routes/menu.routes');
const orderRoutes       = require('./routes/order.routes');
const reviewRoutes      = require('./routes/review.routes');
const reservationRoutes = require('./routes/reservation.routes');
const notificationRoutes= require('./routes/notification.routes');
const adminRoutes       = require('./routes/admin.routes');
const tableRoutes       = require('./routes/table.routes');
const favoriteRoutes    = require('./routes/favorite.routes');
const offerRoutes       = require('./routes/offer.routes');

app.use('/api/v1/auth',         authRoutes);
app.use('/api/v1/users',        userRoutes);
app.use('/api/v1/restaurants',  restaurantRoutes);
app.use('/api/v1/menu',         menuRoutes);
app.use('/api/v1/orders',       orderRoutes);
app.use('/api/v1/reviews',      reviewRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/notifications',notificationRoutes);
app.use('/api/v1/admin',        adminRoutes);
app.use('/api/v1/tables',       tableRoutes);
app.use('/api/v1/favorites',    favoriteRoutes);
app.use('/api/v1/offers',       offerRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Swagger docs — only exposed in development; protected by admin auth in production
if (!isProduction) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.all('/{*splat}', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  if (!isProduction) console.log(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
  console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
});

server.on('error', (error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => process.exit(0));
});

module.exports = app;