import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


export default mongoose.model("Announcement", announcementSchema);
