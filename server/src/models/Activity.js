import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['TASK_COMPLETED', 'TASK_UNCHECKED', 'GOAL_COMPLETED', 'SKILL_CREATED', 'DATA_MIGRATED'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    taskTitle: {
      type: String,
      default: ''
    },
    skillId: {
      type: String,
      default: null
    },
    skillName: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      required: true,
      index: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Activity', activitySchema);

