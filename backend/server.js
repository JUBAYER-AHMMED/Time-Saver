import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import announcementsRoutes from './routes/announcement.routes.js';
import initializePassport from './config/passport.config.js';
import adminRoutes from './routes/admin.routes.js';
import doctorsRoutes from './routes/doctors.routes.js';
import { initSocket } from './websocket/socket.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'queue-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax',
    secure: false // Set to true if using HTTPS
  }
}));

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.send('Backend is working!');
});
// GET all doctors
app.use('/api/doctors',doctorsRoutes)


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use('/api/announcements', announcementsRoutes);

// Server and Socket
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

initSocket(server);
