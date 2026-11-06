import User from '../models/User.js';
import Reminder from '../models/Reminder.js';
import PortfolioSettings from '../models/PortfolioSettings.js';
import { generateToken } from '../utils/jwt.js';
import { seedDemoUser, DEMO_USER_DATA } from '../utils/seedDemo.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please log in.'
      });
    }

    // Generate safe publicId slug from name
    const slugBase = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const publicId = `${slugBase || 'student'}-${Math.floor(1000 + Math.random() * 9000)}`;

    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'ST';

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      publicId,
      avatarInitials: initials,
      isDemo: false
    });

    // Initialize Default Reminder and Portfolio settings for new user
    await Reminder.create({
      user: user._id,
      enabled: true,
      daysBeforeDeadline: 5,
      showDashboardBanner: true
    });

    await PortfolioSettings.create({
      user: user._id,
      publicId: user.publicId,
      isPublic: true,
      showBio: true,
      showEducation: true,
      showSocials: true,
      showGoals: true,
      showStreaks: true,
      selectedSkillIds: []
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        education: user.education,
        institution: user.institution,
        interests: user.interests,
        linkedin: user.linkedin,
        github: user.github,
        portfolioUrl: user.portfolioUrl,
        avatarUrl: user.avatarUrl,
        avatarInitials: user.avatarInitials,
        publicId: user.publicId,
        isDemo: user.isDemo
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // Find user including password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        education: user.education,
        institution: user.institution,
        interests: user.interests,
        linkedin: user.linkedin,
        github: user.github,
        portfolioUrl: user.portfolioUrl,
        avatarUrl: user.avatarUrl,
        avatarInitials: user.avatarInitials,
        publicId: user.publicId,
        isDemo: user.isDemo
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    1-Click Demo Workspace login
 * @route   POST /api/auth/demo
 * @access  Public
 */
export async function demoLogin(req, res, next) {
  try {
    let demoUser = await User.findOne({ email: DEMO_USER_DATA.email.toLowerCase() });

    if (!demoUser) {
      demoUser = await seedDemoUser();
    }

    const token = generateToken(demoUser._id);

    return res.json({
      success: true,
      message: 'Demo workspace accessed successfully.',
      token,
      user: {
        id: demoUser._id,
        name: demoUser.name,
        email: demoUser.email,
        bio: demoUser.bio,
        education: demoUser.education,
        institution: demoUser.institution,
        interests: demoUser.interests,
        linkedin: demoUser.linkedin,
        github: demoUser.github,
        portfolioUrl: demoUser.portfolioUrl,
        avatarUrl: demoUser.avatarUrl,
        avatarInitials: demoUser.avatarInitials,
        publicId: demoUser.publicId,
        isDemo: true
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        education: user.education,
        institution: user.institution,
        interests: user.interests,
        linkedin: user.linkedin,
        github: user.github,
        portfolioUrl: user.portfolioUrl,
        avatarUrl: user.avatarUrl,
        avatarInitials: user.avatarInitials,
        publicId: user.publicId,
        isDemo: user.isDemo
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Update current user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    const allowedFields = [
      'name',
      'bio',
      'education',
      'institution',
      'interests',
      'linkedin',
      'github',
      'portfolioUrl',
      'avatarUrl',
      'avatarInitials'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Auto-update initials if name changed and initials were not explicitly provided
    if (req.body.name && !req.body.avatarInitials) {
      user.avatarInitials = req.body.name
        .split(' ')
        .filter(Boolean)
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'ST';
    }

    const updatedUser = await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        education: updatedUser.education,
        institution: updatedUser.institution,
        interests: updatedUser.interests,
        linkedin: updatedUser.linkedin,
        github: updatedUser.github,
        portfolioUrl: updatedUser.portfolioUrl,
        avatarUrl: updatedUser.avatarUrl,
        avatarInitials: updatedUser.avatarInitials,
        publicId: updatedUser.publicId,
        isDemo: updatedUser.isDemo
      }
    });
  } catch (error) {
    next(error);
  }
}

