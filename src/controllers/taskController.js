const Task = require('../models/Task');
const ResponseFormatter = require('../utils/responseFormatter');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Create a new task
exports.createTask = async (req, res) => {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    try {
        // Validate assigned user
        if (assignedTo) {
            const userExists = await User.findById(assignedTo);
            if (!userExists) {
                return res.status(400).json(ResponseFormatter.format({ msg: 'Assigned user does not exist', success: false }));
            }
        }

        const newTask = new Task({
            title,
            description,
            dueDate,
            priority,
            createdBy: req.user.id,
            assignedTo,
        });
        await newTask.save();

        // Create notification for the assigned user
        if (assignedTo) {
            const notification = new Notification({
                user: assignedTo,
                message: `You have been assigned a new task: ${title}`,
            });
            await notification.save();
        }

        res.status(201).json(ResponseFormatter.format({ data: newTask, msg: 'Task created successfully' }));
    } catch (error) {
        res.status(500).json(ResponseFormatter.format({ msg: 'Server error', success: false }));
    }
};

// Get all tasks
exports.getTasks = async (req, res) => {
    try {
        const { search, status, priority, dueDate } = req.query;
        const query = {};

        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Filter by status
        if (status) {
            query.status = status;
        }

        // Filter by priority
        if (priority) {
            query.priority = priority;
        }

        // Filter by due date
        if (dueDate) {
            query.dueDate = { $lte: new Date(dueDate) };
        }

        const tasks = await Task.find(query).populate('createdBy assignedTo', 'name email');
        res.json(ResponseFormatter.format({ data: tasks }));
    } catch (error) {
        res.status(500).json(ResponseFormatter.format({ msg: 'Server error', success: false }));
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedTask) return res.status(404).json(ResponseFormatter.format({ msg: 'Task not found', success: false }));
        res.json(ResponseFormatter.format({ data: updatedTask, msg: 'Task updated successfully' }));
    } catch (error) {
        res.status(500).json(ResponseFormatter.format({ msg: 'Server error', success: false }));
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) return res.status(404).json(ResponseFormatter.format({ msg: 'Task not found', success: false }));
        res.json(ResponseFormatter.format({ msg: 'Task deleted successfully' }));
    } catch (error) {
        res.status(500).json(ResponseFormatter.format({ msg: 'Server error', success: false }));
    }
};

// Fetch dashboard data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;

        // Tasks assigned to the user
        const assignedTasks = await Task.find({ assignedTo: userId }).sort({ dueDate: 1 });

        // Tasks created by the user
        const createdTasks = await Task.find({ createdBy: userId }).sort({ dueDate: 1 });

        // Overdue tasks
        const currentDate = new Date();
        const overdueTasks = await Task.find({
            assignedTo: userId,
            dueDate: { $lt: currentDate },
            status: { $ne: 'Completed' },
        }).sort({ dueDate: 1 });

        res.json(ResponseFormatter.format({
            data: {
                assignedTasks,
                createdTasks,
                overdueTasks,
            },
        }));
    } catch (error) {
        res.status(500).json(ResponseFormatter.format({ msg: 'Server error', success: false }));
    }
};