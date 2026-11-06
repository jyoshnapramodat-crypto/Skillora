import Skill from '../models/Skill.js';
import Goal from '../models/Goal.js';
import Activity from '../models/Activity.js';
import Reminder from '../models/Reminder.js';
import User from '../models/User.js';

/**
 * @desc    Safely migrate client localStorage state into user's MongoDB records
 * @route   POST /api/migration/import
 * @access  Private
 */
export async function importLocalStorageData(req, res, next) {
  try {
    const userId = req.user._id;
    const { profile, skills, goals, reminderSettings, activityDates } = req.body;

    let importedSkillsCount = 0;
    let importedGoalsCount = 0;

    // 1. Migrate Profile details if provided
    if (profile && typeof profile === 'object') {
      const user = await User.findById(userId);
      if (user) {
        if (profile.bio) user.bio = profile.bio;
        if (profile.education) user.education = profile.education;
        if (profile.institution) user.institution = profile.institution;
        if (Array.isArray(profile.interests) && profile.interests.length > 0) {
          user.interests = profile.interests;
        }
        if (profile.linkedin) user.linkedin = profile.linkedin;
        if (profile.github) user.github = profile.github;
        if (profile.portfolioUrl) user.portfolioUrl = profile.portfolioUrl;
        await user.save();
      }
    }

    // 2. Migrate Skills
    if (Array.isArray(skills) && skills.length > 0) {
      for (const item of skills) {
        if (!item.name) continue;

        // Check if skill with same name already exists for this user
        const existing = await Skill.findOne({ user: userId, name: item.name.trim() });
        const formattedTasks = Array.isArray(item.tasks)
          ? item.tasks.map((t, idx) => ({
              id: t.id || `task-${Date.now()}-${idx}`,
              title: t.title || 'Task',
              completed: Boolean(t.completed),
              completedAt: t.completed ? t.completedAt || new Date() : undefined
            }))
          : [];

        if (existing) {
          existing.category = item.category || existing.category;
          existing.description = item.description || existing.description;
          existing.tasks = formattedTasks;
          await existing.save();
        } else {
          const newSkill = new Skill({
            user: userId,
            name: item.name.trim(),
            category: item.category || 'General',
            description: item.description || '',
            startDate: item.startDate || new Date().toISOString().split('T')[0],
            tasks: formattedTasks
          });
          await newSkill.save();
        }
        importedSkillsCount++;
      }
    }

    // 3. Migrate Goals
    if (Array.isArray(goals) && goals.length > 0) {
      for (const g of goals) {
        if (!g.title) continue;

        const existingGoal = await Goal.findOne({ user: userId, title: g.title.trim() });
        if (existingGoal) {
          existingGoal.description = g.description || existingGoal.description;
          existingGoal.targetDate = g.targetDate || existingGoal.targetDate;
          existingGoal.priority = g.priority || existingGoal.priority;
          existingGoal.status = g.status || existingGoal.status;
          await existingGoal.save();
        } else {
          await Goal.create({
            user: userId,
            title: g.title.trim(),
            description: g.description || '',
            skillId: g.skillId || null,
            skillName: g.skillName || '',
            targetDate: g.targetDate || new Date().toISOString().split('T')[0],
            priority: g.priority || 'Medium',
            status: g.status || 'In Progress'
          });
        }
        importedGoalsCount++;
      }
    }

    // 4. Migrate Reminder Settings
    if (reminderSettings && typeof reminderSettings === 'object') {
      let rem = await Reminder.findOne({ user: userId });
      if (!rem) {
        rem = new Reminder({ user: userId });
      }
      if (reminderSettings.enabled !== undefined) rem.enabled = Boolean(reminderSettings.enabled);
      if (reminderSettings.daysBeforeDeadline !== undefined) {
        rem.daysBeforeDeadline = Number(reminderSettings.daysBeforeDeadline);
      }
      if (reminderSettings.showDashboardBanner !== undefined) {
        rem.showDashboardBanner = Boolean(reminderSettings.showDashboardBanner);
      }
      await rem.save();
    }

    // 5. Migrate Activity Dates
    if (Array.isArray(activityDates) && activityDates.length > 0) {
      for (const d of activityDates) {
        const existingAct = await Activity.findOne({ user: userId, date: d });
        if (!existingAct) {
          await Activity.create({
            user: userId,
            type: 'TASK_COMPLETED',
            description: `Imported learning activity on ${d}`,
            date: d,
            timestamp: new Date(`${d}T12:00:00Z`)
          });
        }
      }
    }

    // Record migration activity
    const today = new Date().toISOString().split('T')[0];
    await Activity.create({
      user: userId,
      type: 'DATA_MIGRATED',
      description: `Successfully synchronized offline workspace with MongoDB (${importedSkillsCount} skills, ${importedGoalsCount} goals).`,
      date: today,
      timestamp: new Date()
    });

    return res.json({
      success: true,
      message: 'Workspace data synchronized to MongoDB successfully!',
      stats: {
        skillsProcessed: importedSkillsCount,
        goalsProcessed: importedGoalsCount
      }
    });
  } catch (error) {
    next(error);
  }
}

