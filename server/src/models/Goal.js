import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    skillId: {
      type: String,
      default: null
    },
    skillName: {
      type: String,
      default: ''
    },
    targetDate: {
      type: String,
      required: [true, 'Target deadline is required']
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed'],
      default: 'In Progress'
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Goal', goalSchema);

