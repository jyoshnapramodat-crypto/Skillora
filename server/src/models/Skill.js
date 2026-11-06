import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: [true, 'Task title cannot be empty'],
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  },
  { _id: false }
);

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    startDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    tasks: {
      type: [taskSchema],
      default: []
    },
    totalTasks: {
      type: Number,
      default: 0
    },
    completedTasks: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started'
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook: Automatically calculate progress percentage and status on backend
skillSchema.pre('save', function (next) {
  const tasks = this.tasks || [];
  this.totalTasks = tasks.length;
  this.completedTasks = tasks.filter((t) => Boolean(t.completed)).length;

  if (this.totalTasks === 0) {
    this.percentage = 0;
    this.status = 'Not Started';
  } else {
    this.percentage = Math.round((this.completedTasks / this.totalTasks) * 100);
    if (this.completedTasks === 0) {
      this.status = 'Not Started';
    } else if (this.completedTasks === this.totalTasks) {
      this.status = 'Completed';
    } else {
      this.status = 'In Progress';
    }
  }

  next();
});

export default mongoose.model('Skill', skillSchema);

