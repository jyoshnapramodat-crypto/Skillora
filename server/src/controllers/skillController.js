import Skill from '../models/Skill.js';
import Activity from '../models/Activity.js';

/**
 * @desc    Get all skills for logged-in user with search, filter, and sort
 * @route   GET /api/skills
 * @access  Private
 */
export async function getSkills(req, res, next) {
  try {
    const { search, category, status, sortBy, order } = req.query;

    const query = { user: req.user._id };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ];
    }

    let sortOptions = { updatedAt: -1 }; // default: recently updated

    if (sortBy === 'name') {
      sortOptions = { name: order === 'desc' ? -1 : 1 };
    } else if (sortBy === 'progress') {
      sortOptions = { percentage: order === 'asc' ? 1 : -1 };
    } else if (sortBy === 'createdAt') {
      sortOptions = { createdAt: order === 'asc' ? 1 : -1 };
    } else if (sortBy === 'recentlyUpdated') {
      sortOptions = { updatedAt: order === 'asc' ? 1 : -1 };
    }

    const skills = await Skill.find(query).sort(sortOptions);

    return res.json({
      success: true,
      count: skills.length,
      skills
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get single skill by ID
 * @route   GET /api/skills/:id
 * @access  Private
 */
export async function getSkillById(req, res, next) {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    return res.json({
      success: true,
      skill
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Create a new skill
 * @route   POST /api/skills
 * @access  Private
 */
export async function createSkill(req, res, next) {
  try {
    const { name, category, description, startDate, tasks } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required'
      });
    }

    const formattedTasks = Array.isArray(tasks)
      ? tasks.map((t, idx) => ({
          id: t.id || `task-${Date.now()}-${idx}`,
          title: t.title || 'Untitled task',
          completed: Boolean(t.completed),
          completedAt: t.completed ? t.completedAt || new Date() : undefined
        }))
      : [];

    const skill = new Skill({
      user: req.user._id,
      name: name.trim(),
      category: category ? category.trim() : 'General',
      description: description ? description.trim() : '',
      startDate: startDate || new Date().toISOString().split('T')[0],
      tasks: formattedTasks
    });

    // Save triggers pre-save hook to calculate progress, percentage, status
    await skill.save();

    // Log Activity
    const today = new Date().toISOString().split('T')[0];
    await Activity.create({
      user: req.user._id,
      type: 'SKILL_CREATED',
      description: `Created new skill "${skill.name}" in ${skill.category}`,
      skillId: skill._id.toString(),
      skillName: skill.name,
      date: today,
      timestamp: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      skill
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Update an existing skill
 * @route   PUT /api/skills/:id
 * @access  Private
 */
export async function updateSkill(req, res, next) {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    const { name, category, description, startDate, tasks } = req.body;

    if (name !== undefined) skill.name = name.trim();
    if (category !== undefined) skill.category = category.trim();
    if (description !== undefined) skill.description = description.trim();
    if (startDate !== undefined) skill.startDate = startDate;
    if (tasks !== undefined && Array.isArray(tasks)) {
      skill.tasks = tasks.map((t, idx) => ({
        id: t.id || `task-${Date.now()}-${idx}`,
        title: t.title || 'Untitled task',
        completed: Boolean(t.completed),
        completedAt: t.completed ? (t.completedAt || new Date()) : undefined
      }));
    }

    await skill.save();

    return res.json({
      success: true,
      message: 'Skill updated successfully',
      skill
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Delete a skill
 * @route   DELETE /api/skills/:id
 * @access  Private
 */
export async function deleteSkill(req, res, next) {
  try {
    const skill = await Skill.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    return res.json({
      success: true,
      message: `Skill "${skill.name}" was deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Add a task to a skill
 * @route   POST /api/skills/:id/tasks
 * @access  Private
 */
export async function addTask(req, res, next) {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title cannot be empty'
      });
    }

    const newTask = {
      id: `task-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      completed: false
    };

    skill.tasks.push(newTask);
    await skill.save();

    return res.status(201).json({
      success: true,
      message: 'Task added successfully',
      skill,
      task: newTask
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Toggle or update a task within a skill
 * @route   PATCH /api/skills/:id/tasks/:taskId
 * @access  Private
 */
export async function updateTask(req, res, next) {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    const taskIndex = skill.tasks.findIndex((t) => t.id === req.params.taskId);
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found in this skill'
      });
    }

    const currentTask = skill.tasks[taskIndex];
    const { completed, title } = req.body;

    if (title !== undefined && title.trim()) {
      currentTask.title = title.trim();
    }

    if (completed !== undefined) {
      const wasCompleted = currentTask.completed;
      currentTask.completed = Boolean(completed);

      const today = new Date().toISOString().split('T')[0];

      if (currentTask.completed && !wasCompleted) {
        currentTask.completedAt = new Date();
        // Record Activity
        await Activity.create({
          user: req.user._id,
          type: 'TASK_COMPLETED',
          description: `Completed task "${currentTask.title}" in ${skill.name}`,
          taskTitle: currentTask.title,
          skillId: skill._id.toString(),
          skillName: skill.name,
          date: today,
          timestamp: new Date()
        });
      } else if (!currentTask.completed && wasCompleted) {
        currentTask.completedAt = undefined;
        // Record Activity
        await Activity.create({
          user: req.user._id,
          type: 'TASK_UNCHECKED',
          description: `Unmarked task "${currentTask.title}" in ${skill.name}`,
          taskTitle: currentTask.title,
          skillId: skill._id.toString(),
          skillName: skill.name,
          date: today,
          timestamp: new Date()
        });
      }
    }

    // Force Mongoose to recognize array modification
    skill.markModified('tasks');
    await skill.save();

    return res.json({
      success: true,
      message: 'Task updated successfully',
      skill,
      task: skill.tasks[taskIndex]
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Delete a task from a skill
 * @route   DELETE /api/skills/:id/tasks/:taskId
 * @access  Private
 */
export async function deleteTask(req, res, next) {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    const initialLength = skill.tasks.length;
    skill.tasks = skill.tasks.filter((t) => t.id !== req.params.taskId);

    if (skill.tasks.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Task not found in this skill'
      });
    }

    skill.markModified('tasks');
    await skill.save();

    return res.json({
      success: true,
      message: 'Task deleted successfully',
      skill
    });
  } catch (error) {
    next(error);
  }
}

