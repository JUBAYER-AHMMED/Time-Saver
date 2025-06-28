import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String },
    availability: {
      type: String,
      enum: ['available', 'late', 'unavailable'],
      default: 'available',
    },
    isSitted: {
      type: Boolean,
      default: false, // whether the doctor is currently in the seat
    },
    announcement: {
      type: String,
      default: "", // doctor-related announcements by admin
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Doctor', doctorSchema);
