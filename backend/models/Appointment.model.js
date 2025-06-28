import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: String,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      trim: true,
      default:'12:00pm',
    },
    status: {
      type: String,
      enum: ['pending', 'cancelled', 'completed'],
      default: 'pending',
    },
    serial: {
      type: Number,
      required: true,
    },
    contact: {
      type: String, // store as string to preserve leading 0s or international format
      required: true,
      trim: true,
    },
    patientPassword: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
