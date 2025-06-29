import express from "express";
import Appointment from "../models/Appointment.model.js";
import Doctor from "../models/doctor.models.js";
import User from "../models/User.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Admin creates an appointment manually and creates the patient if needed
router.post("/appointments", isAuthenticated, isAdmin, async (req, res) => {
  const {
    patientName,
    patientContact,
    appointmentDate,
    appointmentTime,
    doctorId,
  } = req.body;
  try {
    if (
      !patientName ||
      !patientContact ||
      !appointmentDate ||
      !appointmentTime ||
      !doctorId
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Step 1: Create the patient
    const newPatient = new User({
      name: patientName,
      contact: patientContact,
      role: "patient",
      email: `${Date.now()}-${Math.random()}@example.com`, // dummy unique email
      password: "12345678", // default password (make sure to hash it in User model if needed)
    });

    await newPatient.save();

    // Step 2: Create appointment
    const time = new Date(`${appointmentDate}T${appointmentTime}`);

    // Find the last appointment to get the max serial for that doctor
    const lastAppointment = await Appointment.findOne({ doctor: doctorId })
      .sort({ serial: -1 })
      .select("serial");

    const nextSerial = lastAppointment ? lastAppointment.serial + 1 : 1;

    // Create appointment linked to patient and doctor
    const appointment = new Appointment({
      patient: patient._id,
      doctor: doctorId,
      time,
      serial: nextSerial,
    });

    await appointment.save();

    res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create appointment" });
  }
});

// Other routes remain unchanged...

router.get("/patients", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password");
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch patients" });
  }
});

router.get(
  "/patients/:id/appointments",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const appointments = await Appointment.find({
        patient: req.params.id,
      }).populate("doctor");
      res.json(appointments);
    } catch (err) {
      res.status(500).json({ message: "Error getting appointments" });
    }
  }
);

router.put(
  "/appointments/:id/status",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    const { status } = req.body;
    try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) return res.status(404).json({ message: "Not found" });
      appointment.status = status;
      await appointment.save();
      res.json(appointment);
    } catch (err) {
      res.status(500).json({ message: "Failed to update status" });
    }
  }
);
router.post("/doctors", isAdmin, async (req, res) => {
  const { name, specialization } = req.body;
  console.log(req.body);
  try {
    const doctor = new Doctor({ name, specialization });
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Failed to create doctor" });
  }
});

router.put(
  "/doctors/:id/availability",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    const { availability } = req.body;
    if (!["available", "late", "unavailable"].includes(availability)) {
      return res.status(400).json({ message: "Invalid availability status" });
    }
    try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });
      doctor.availability = availability;
      await doctor.save();
      res.json(doctor);
    } catch (err) {
      res.status(500).json({ message: "Failed to update availability" });
    }
  }
);

export default router;
