import PortfolioSettings from '../models/PortfolioSettings.js';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Goal from '../models/Goal.js';
import Activity from '../models/Activity.js';

/**
 * @desc    Get portfolio settings for logged-in user
 * @route   GET /api/portfolio/settings
 * @access  Private
 */
export async function getPortfolioSettings(req, res, next) {
  try {
    let settings = await PortfolioSettings.findOne({ user: req.user._id });

    if (!settings) {
      settings = await PortfolioSettings.create({
        user: req.user._id,
        publicId: req.user.publicId || `student-${Math.floor(1000 + Math.random() * 9000)}`,
        isPublic: true,
        showBio: true,
        showEducation: true,
        showSocials: true,
        showGoals: true,
        showStreaks: true,
        selectedSkillIds: []
      });
    }

    return res.json({
      success: true,
      settings
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Update portfolio settings
 * @route   PUT /api/portfolio/settings
 * @access  Private
 */
export async function updatePortfolioSettings(req, res, next) {
  try {
    let settings = await PortfolioSettings.findOne({ user: req.user._id });

    if (!settings) {
      settings = new PortfolioSettings({
        user: req.user._id,
        publicId: req.user.publicId
      });
    }

    const {
      isPublic,
      showBio,
      showEducation,
      showSocials,
      showGoals,
      showStreaks,
      selectedSkillIds
    } = req.body;

    if (isPublic !== undefined) settings.isPublic = Boolean(isPublic);
    if (showBio !== undefined) settings.showBio = Boolean(showBio);
    if (showEducation !== undefined) settings.showEducation = Boolean(showEducation);
    if (showSocials !== undefined) settings.showSocials = Boolean(showSocials);
    if (showGoals !== undefined) settings.showGoals = Boolean(showGoals);
    if (showStreaks !== undefined) settings.showStreaks = Boolean(showStreaks);
    if (selectedSkillIds !== undefined) settings.selectedSkillIds = selectedSkillIds;

    await settings.save();

    return res.json({
      success: true,
      message: 'Portfolio visibility settings saved successfully',
      settings
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Public showcase portfolio by publicId (NO AUTH REQUIRED)
 * @route   GET /api/portfolio/public/:publicId
 * @access  Public
 */
export async function getPublicPortfolio(req, res, next) {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public portfolio ID is required'
      });
    }

    // Find settings or user by publicId (case-insensitive)
    const settings = await PortfolioSettings.findOne({
      publicId: { $regex: new RegExp(`^${publicId.trim()}$`, 'i') }
    });

    if (!settings || !settings.isPublic) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio is either private or does not exist.'
      });
    }

    const user = await User.findById(settings.user).select(
      'name avatarUrl avatarInitials bio education institution interests linkedin github portfolioUrl publicId'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio owner not found.'
      });
    }

    // Retrieve skills
    let skillQuery = { user: user._id };
    if (settings.selectedSkillIds && settings.selectedSkillIds.length > 0) {
      skillQuery._id = { $in: settings.selectedSkillIds };
    }

    const skills = await Skill.find(skillQuery).select(
      'name category description startDate percentage status tasks totalTasks completedTasks'
    );

    // Filter tasks from skills for clean public presentation
    const safeSkills = skills.map((s) => ({
      id: s._id,
      name: s.name,
      category: s.category,
      description: s.description,
      startDate: s.startDate,
      percentage: s.percentage,
      status: s.status,
      totalTasks: s.totalTasks,
      completedTasks: s.completedTasks,
      tasks: s.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        completed: t.completed
      }))
    }));

    // Retrieve goals if allowed
    let goals = [];
    if (settings.showGoals) {
      const dbGoals = await Goal.find({ user: user._id }).select(
        'title description skillName targetDate priority status completedAt'
      );
      goals = dbGoals.map((g) => ({
        id: g._id,
        title: g.title,
        description: g.description,
        skillName: g.skillName,
        targetDate: g.targetDate,
        priority: g.priority,
        status: g.status
      }));
    }

    // Streak stats if allowed
    let streak = { currentStreak: 0, totalActiveDays: 0 };
    if (settings.showStreaks) {
      const activities = await Activity.find({ user: user._id }).select('date');
      const uniqueDates = Array.from(new Set(activities.map((a) => a.date))).sort().reverse();
      streak.totalActiveDays = uniqueDates.length;

      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      let currentStreak = 0;
      let checkDate = uniqueDates.includes(todayStr)
        ? new Date(todayStr)
        : uniqueDates.includes(yesterdayStr)
        ? new Date(yesterdayStr)
        : null;

      if (checkDate) {
        while (true) {
          const dStr = checkDate.toISOString().split('T')[0];
          if (uniqueDates.includes(dStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
      streak.currentStreak = currentStreak;
    }

    // Calculate overall stats
    const totalSkills = safeSkills.length;
    let completedTasks = 0;
    let totalTasks = 0;
    safeSkills.forEach((s) => {
      totalTasks += s.totalTasks;
      completedTasks += s.completedTasks;
    });
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return res.json({
      success: true,
      portfolio: {
        user: {
          name: user.name,
          avatarUrl: user.avatarUrl,
          avatarInitials: user.avatarInitials,
          bio: settings.showBio ? user.bio : '',
          education: settings.showEducation ? user.education : '',
          institution: settings.showEducation ? user.institution : '',
          interests: user.interests,
          linkedin: settings.showSocials ? user.linkedin : '',
          github: settings.showSocials ? user.github : '',
          portfolioUrl: settings.showSocials ? user.portfolioUrl : '',
          publicId: user.publicId
        },
        settings: {
          showBio: settings.showBio,
          showEducation: settings.showEducation,
          showSocials: settings.showSocials,
          showGoals: settings.showGoals,
          showStreaks: settings.showStreaks
        },
        stats: {
          totalSkills,
          completedTasks,
          totalTasks,
          overallProgress,
          streak
        },
        skills: safeSkills,
        goals
      }
    });
  } catch (error) {
    next(error);
  }
}

