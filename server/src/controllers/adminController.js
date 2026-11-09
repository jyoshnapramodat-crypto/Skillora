import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Goal from '../models/Goal.js';
import Activity from '../models/Activity.js';
import { generateToken } from '../utils/jwt.js';

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@skillora.dev';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@Skillora2026!';

/**
 * Ensure default admin account exists in database
 */
export async function ensureDefaultAdmin() {
  try {
    let admin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL.toLowerCase() }).select('+password');
    if (!admin) {
      console.log(`[Admin Seed] Creating default administrator: ${DEFAULT_ADMIN_EMAIL}`);
      admin = await User.create({
        name: process.env.ADMIN_NAME || 'Skillora Administrator',
        email: DEFAULT_ADMIN_EMAIL.toLowerCase(),
        password: DEFAULT_ADMIN_PASSWORD,
        role: 'admin',
        bio: 'Skillora Platform Super Administrator',
        institution: 'Skillora Headquarters',
        education: 'Platform Engineering & Analytics'
      });
    } else if (admin.role !== 'admin') {
      admin.role = 'admin';
      await admin.save();
    }
    return admin;
  } catch (err) {
    console.error('[Admin Seed] Error ensuring admin:', err.message);
  }
}

/**
 * @desc    Admin login
 * @route   POST /api/admin/login
 * @access  Public
 */
export async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide admin email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: User is not authorized as an administrator.'
      });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Admin authentication successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLoginAt: user.lastLoginAt
      }
    });
  } catch (err) {
    console.error('[Admin Login Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during admin login.'
    });
  }
}

/**
 * @desc    Get Admin Metrics (Users count, Profit/Revenue, breakdown, skills, activity)
 * @route   GET /api/admin/metrics
 * @access  Private (Admin)
 */
export async function getAdminMetrics(req, res) {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const allUsers = await User.find({ role: { $ne: 'admin' } })
      .select('name email education institution plan subscriptionAmount createdAt lastLoginAt isDemo')
      .sort({ createdAt: -1 });

    const totalSkills = await Skill.countDocuments();
    const totalGoals = await Goal.countDocuments();
    const totalActivities = await Activity.countDocuments();

    // Calculate revenue & profits
    // Tier pricing: Free ($0), Pro ($12/mo), Enterprise ($49/mo)
    // Server cost fixed estimate: $15/mo base
    let totalRevenue = 0;
    const planCounts = { free: 0, pro: 0, enterprise: 0 };

    allUsers.forEach((u) => {
      const plan = u.plan || (u.isDemo ? 'pro' : 'free');
      planCounts[plan] = (planCounts[plan] || 0) + 1;

      if (u.subscriptionAmount && u.subscriptionAmount > 0) {
        totalRevenue += u.subscriptionAmount;
      } else if (plan === 'pro') {
        totalRevenue += 12;
      } else if (plan === 'enterprise') {
        totalRevenue += 49;
      }
    });

    // Hosting and cloud costs (e.g., Render + Atlas estimate)
    const estimatedExpenses = 15 + Math.floor(totalUsers * 0.25);
    const estimatedProfit = Math.max(0, totalRevenue - estimatedExpenses);
    const profitMargin = totalRevenue > 0 ? ((estimatedProfit / totalRevenue) * 100).toFixed(1) : '0.0';

    // Active users in the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsers7d = allUsers.filter(
      (u) => (u.lastLoginAt && u.lastLoginAt >= sevenDaysAgo) || (u.createdAt && u.createdAt >= sevenDaysAgo)
    ).length;

    // Monthly revenue simulation data for admin chart
    const monthlyFinancials = [
      { month: 'Jun', revenue: Math.max(40, totalRevenue * 0.4), profit: Math.max(25, estimatedProfit * 0.35), users: Math.max(5, Math.floor(totalUsers * 0.4)) },
      { month: 'Jul', revenue: Math.max(70, totalRevenue * 0.55), profit: Math.max(45, estimatedProfit * 0.5), users: Math.max(8, Math.floor(totalUsers * 0.6)) },
      { month: 'Aug', revenue: Math.max(110, totalRevenue * 0.7), profit: Math.max(75, estimatedProfit * 0.65), users: Math.max(12, Math.floor(totalUsers * 0.75)) },
      { month: 'Sep', revenue: Math.max(160, totalRevenue * 0.85), profit: Math.max(115, estimatedProfit * 0.82), users: Math.max(15, Math.floor(totalUsers * 0.9)) },
      { month: 'Oct', revenue: Math.max(210, totalRevenue * 0.95), profit: Math.max(155, estimatedProfit * 0.92), users: Math.max(18, Math.floor(totalUsers * 0.95)) },
      { month: 'Nov', revenue: totalRevenue, profit: estimatedProfit, users: totalUsers }
    ];

    return res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers7d,
        totalRevenue: Math.round(totalRevenue),
        estimatedExpenses,
        estimatedProfit: Math.round(estimatedProfit),
        profitMargin: `${profitMargin}%`,
        planCounts,
        totalSkills,
        totalGoals,
        totalActivities
      },
      monthlyFinancials,
      recentUsers: allUsers.slice(0, 15)
    });
  } catch (err) {
    console.error('[Admin Metrics Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin dashboard metrics.'
    });
  }
}
