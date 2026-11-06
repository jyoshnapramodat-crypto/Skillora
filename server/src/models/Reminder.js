import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    enabled: {
      type: Boolean,
      default: true
    },
    daysBeforeDeadline: {
      type: Number,
      default: 5
    },
    showDashboardBanner: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Reminder', reminderSchema);

