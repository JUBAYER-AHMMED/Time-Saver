import express from 'express';
import {isAdmin, isAuthenticated } from '../middleware/authMiddleware.js';
import Doctor from '../models/doctor.models.js';
const router = express.Router();

// GET all doctors
router.get('/', async (req, res) => {
  console.log("i am called!");
  try {
    const doctors = await Doctor.find().select('_id name');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch doctors' });
  }
});

router.get('/doctorlist', async (req, res) => {
  // console.log("i am called!");
  try {
    const doctorlist = await Doctor.find();
    res.json(doctorlist);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch doctors' });
  }
});
export default router;