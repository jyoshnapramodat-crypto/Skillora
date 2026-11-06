import mongoose from 'mongoose';

const portfolioSettingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    showBio: {
      type: Boolean,
      default: true
    },
    showEducation: {
      type: Boolean,
      default: true
    },
    showSocials: {
      type: Boolean,
      default: true
    },
    showGoals: {
      type: Boolean,
      default: true
    },
    showStreaks: {
      type: Boolean,
      default: true
    },
    selectedSkillIds: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('PortfolioSettings', portfolioSettingsSchema);

