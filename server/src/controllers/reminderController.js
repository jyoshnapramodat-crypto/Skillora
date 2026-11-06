import Reminder from '../models/Reminder.js';
import Goal from '../models/Goal.js';

/**
 * @desc    Get reminder settings and upcoming alert items
 * @route   GET /api/reminders
 * @access  Private
 */
export async function getReminders(req, res, next) {
  try {
    let settings = await Reminder.findOne({ user: req.user._id });

    if (!settings) {
      settings = await Reminder.create({
        user: req.user._id,
        enabled: true,
        daysBeforeDeadline: 5,
        showDashboardBanner: true
      });
    }

    // Find goals due within threshold days
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const thresholdDate = new Date(today);
    thresholdDate.setDate(thresholdDate.getDate() + (settings.daysBeforeDeadline || 5));
    const thresholdStr = thresholdDate.toISOString().split('T')[0];

    const dueGoals = await Goal.find({
      user: req.user._id,
      status: 'In Progress',
      targetDate: { $gte: todayStr, $lte: thresholdStr }
    }).sort({ targetDate: 1 });

    const overdueGoals = await Goal.find({
      user: req.user._id,
      status: 'In Progress',
      targetDate: { $lt: todayStr }
    }).sort({ targetDate: 1 });

    return res.json({
      success: true,
      settings,
      alerts: {
        dueSoonCount: dueGoals.length,
        dueGoals,
        overdueCount: overdueGoals.length,
        overdueGoals
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Update reminder settings
 * @route   PUT /api/reminders
 * @access  Private
 */
export async function updateReminders(req, res, next) {
  try {
    let settings = await Reminder.findOne({ user: req.user._id });

    if (!settings) {
      settings = new Reminder({ user: req.user._id });
    }

    const { enabled, daysBeforeDeadline, showDashboardBanner } = req.body;

    if (enabled !== undefined) settings.enabled = Boolean(enabled);
    if (daysBeforeDeadline !== undefined) settings.daysBeforeDeadline = Number(daysBeforeDeadline);
    if (showDashboardBanner !== undefined) settings.showDashboardBanner = Boolean(showDashboardBanner);

    await settings.save();

    return res.json({
      success: true,
      message: 'Reminder settings updated successfully',
      settings
    });
  } catch (error) {
    next(error);
  }
}

