import express from 'express';
import passport from 'passport';
import User from '../models/User.js';

import Appointment from '../models/Appointment.model.js';
import jwt from 'jsonwebtoken';
// import PatientDashboard from '../../frontend/src/pages/PatientDashboard.jsx';
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'bismillah';

router.post('/login', async (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.json({ user: safeUser, token });
  })(req, res, next);
});

// Middleware to extract user from JWT token
router.post('/appointmentByPatient', async (req, res) => {
  const { patient, date, time, contact, doctor } = req.body;

  try {
    // Auto-generate and store password for dashboard
    const generatedPassword = Math.random().toString(36).slice(-8);

    // Normalize the date to ignore time for day-based filtering
    const appointDate = new Date(date);
    appointDate.setHours(0, 0, 0, 0);

    const dayStart = new Date(appointDate);
    const dayEnd = new Date(appointDate);
    dayEnd.setHours(23, 59, 59, 999);

    // Find the latest serial for the same doctor and same date
    const latest = await Appointment.find({
      doctor,
      date: {
        $gte: dayStart,
        $lte: dayEnd,
      },
    })
      .sort({ serial: -1 })
      .limit(1);

    const nextSerial = latest.length > 0 ? latest[0].serial + 1 : 1;

    // Create the appointment
    const appoint = new Appointment({
      patient,
      date,
      time,
      contact,
      doctor,
      patientPassword: generatedPassword,
      serial: nextSerial,
    });

    await appoint.save();

    res.status(201).json({
      message: 'Appointment booked',
      patientPassword: generatedPassword,
      serial: nextSerial,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Appointment booking failed' });
  }
});


router.post('/verify-patient-password', async (req, res) => {
  const { password } = req.body;

  const patient = await Appointment.findOne({ patientPassword: password});

  if (!patient) {
    return res.status(401).json({ error: 'Invalid password or user not a patient' });
  }

  res.json({ message: 'Access granted' });
});

// mbnb



router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.json({ message: 'Logged out' });
  });
});

export default router;
