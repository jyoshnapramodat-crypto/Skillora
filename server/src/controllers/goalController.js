import Goal from '../models/Goal.js';
import Activity from '../models/Activity.js';

/**
 * @desc    Get all goals for logged-in user
 * @route   GET /api/goals
 * @access  Private
 */
export async function getGoals(req, res, next) {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({
      status: -1, // In Progress first
      targetDate: 1 // Soonest deadline first
    });

    const todayStr = new Date().toISOString().split('T')[0];

    const enrichedGoals = goals.map((g) => {
      const isOverdue = g.status === 'In Progress' && g.targetDate < todayStr;
      return {
        ...g.toObject(),
        isOverdue
      };
    });

    return res.json({
      success: true,
      count: enrichedGoals.length,
      goals: enrichedGoals
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Create a new goal
 * @route   POST /api/goals
 * @access  Private
 */
export async function createGoal(req, res, next) {
  try {
    const { title, description, skillId, skillName, targetDate, priority } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Goal title is required'
      });
    }

    if (!targetDate) {
      return res.status(400).json({
        success: false,
        message: 'Target date deadline is required'
      });
    }

    const goal = await Goal.create({
      user: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      skillId: skillId || null,
      skillName: skillName ? skillName.trim() : '',
      targetDate,
      priority: priority || 'Medium',
      status: 'In Progress'
    });

    return res.status(201).json({
      success: true,
      message: 'Learning goal created successfully',
      goal
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Update a goal
 * @route   PUT /api/goals/:id
 * @access  Private
 */
export async function updateGoal(req, res, next) {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    const { title, description, skillId, skillName, targetDate, priority, status } = req.body;

    if (title !== undefined) goal.title = title.trim();
    if (description !== undefined) goal.description = description.trim();
    if (skillId !== undefined) goal.skillId = skillId;
    if (skillName !== undefined) goal.skillName = skillName;
    if (targetDate !== undefined) goal.targetDate = targetDate;
    if (priority !== undefined) goal.priority = priority;
    if (status !== undefined) {
      goal.status = status;
      if (status === 'Completed' && !goal.completedAt) {
        goal.completedAt = new Date();
      } else if (status !== 'Completed') {
        goal.completedAt = null;
      }
    }

    await goal.save();

    return res.json({
      success: true,
      message: 'Goal updated successfully',
      goal
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Toggle completion of a goal
 * @route   PATCH /api/goals/:id/toggle
 * @access  Private
 */
export async function toggleGoal(req, res, next) {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    const willBeCompleted = goal.status !== 'Completed';
    goal.status = willBeCompleted ? 'Completed' : 'In Progress';
    goal.completedAt = willBeCompleted ? new Date() : null;

    await goal.save();

    if (willBeCompleted) {
      const today = new Date().toISOString().split('T')[0];
      await Activity.create({
        user: req.user._id,
        type: 'GOAL_COMPLETED',
        description: `Achieved learning goal "${goal.title}"`,
        skillId: goal.skillId,
        skillName: goal.skillName,
        date: today,
        timestamp: new Date()
      });
    }

    return res.json({
      success: true,
      message: `Goal marked as ${goal.status.toLowerCase()}`,
      goal
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Delete a goal
 * @route   DELETE /api/goals/:id
 * @access  Private
 */
export async function deleteGoal(req, res, next) {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    return res.json({
      success: true,
      message: `Goal "${goal.title}" was deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
}

