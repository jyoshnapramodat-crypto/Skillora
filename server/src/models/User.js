import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Exclude from query results by default
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    avatarInitials: {
      type: String,
      default: 'ST'
    },
    bio: {
      type: String,
      default: ''
    },
    education: {
      type: String,
      default: ''
    },
    institution: {
      type: String,
      default: ''
    },
    interests: {
      type: [String],
      default: []
    },
    linkedin: {
      type: String,
      default: ''
    },
    github: {
      type: String,
      default: ''
    },
    portfolioUrl: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    subscriptionAmount: {
      type: Number,
      default: 0
    },
    lastLoginAt: {
      type: Date,
      default: Date.now
    },
    isDemo: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Auto-generate publicId if missing
  if (!this.publicId) {
    const slugBase = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    this.publicId = `${slugBase || 'student'}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  // Auto-generate avatar initials if missing
  if (!this.avatarInitials) {
    this.avatarInitials = this.name
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'ST';
  }

  next();
});

// Instance method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);

