// dashboardRoutes.js
import express from 'express';
import Appointment from '../models/Appointment.model.js';
import Doctor from '../models/doctor.models.js';
import User from '../models/User.js';
const router = express.Router();

router.get('/', async (req, res) => {
  // console.log("bachao!");
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ error: 'doctorId and date are required' });
    }

    // Parse date and create date range for the whole day
    const selectedDate = new Date(date);
    const dayStart = new Date(selectedDate.setHours(0, 0, 0, 0));
    const dayEnd = new Date(selectedDate.setHours(23, 59, 59, 999));

    const appointments = await Appointment.find({
      doctor: doctorId,
      date: {
        $gte: dayStart,
        $lte: dayEnd,
      },
    }).sort({ serial: 1 }); // Optional: sort by serial number

    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/appointments/:id
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await appointment.deleteOne(); // or appointment.remove()
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ error: 'Server error while deleting appointment' });
  }
});

// 1. Get today's appointment by patient contact
router.get('/today', async (req, res) => {
  // console.log("calling");
  const { contact } = req.query;
  // console.log("Received contact:", contact);

  if (!contact) {
    // console.log("no contact");
    return res.status(400).json({ error: 'Contact is required' });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

const appt = await Appointment.findOne({ contact });
// console.log("Appointment with contact found:", appt);

if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    res.json(appt);
  } catch (err) {
    console.error('Error fetching today appointment:', err);
    res.status(500).json({ error: err.message });
  }
});
// 2. Get doctor status
router.get('/doctor-status/:doctorId', async (req, res) => {
 
    // console.log(req.params.doctorId);
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
     
    // console.log(doctor);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    res.json({doctorName:doctor.name, status: doctor.availability, announcement: doctor.announcement });
  } catch (err) {
    console.error('Error fetching doctor status:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Get current serial and remaining patients
router.get('/current-serial/:doctorId', async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    console.log(req.params.doctorId);

    const appointments = await Appointment.find({
      doctor: req.params.doctorId,
      date: { $gte: todayStart, $lte: todayEnd },
      status:'pending',
    }).sort('time');

    console.log(appointments);

 let currentSerial = 0;
let remainingPatients = [];

if (appointments.length > 0) {
  currentSerial = appointments[0].serial; // ✅ Get the first patient's serial
  remainingPatients = appointments.slice(1); // ✅ All others are remaining
}


    res.json({ currentSerial, remainingPatients });
  } catch (err) {
    console.error('Error fetching serial info:', err);
    res.status(500).json({ error: err.message });
  }
});


// 4. Get user by email
router.get('/user-by-contact', async (req, res) => {
  
  const { contact } = req.query;
console.log("I am calling",contact);
  if (!contact) return res.status(400).json({ error: 'contact is required' });

  try {
    const user = await User.findOne({ contact });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Error fetching user by email:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
