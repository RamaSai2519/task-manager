const Task = require('../models/Task');
const ResponseFormatter = require('../utils/responseFormatter');

// Create a new task
exports.createTask = async (req, res) => {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    try {
        const newTask = new Task({
            title,
            description,
            dueDate,
            priority,
            createdBy: req.user.id,
            assignedTo,
        });
        await newTask.save();
        res.status(201).json(ResponseFormatter.format({ data: newTask, msg: 'Task created successfully' }));
    } catch (error) {
        res.status(500).json(ResponseFormatter.format({ msg: 'Server error', success: false }));
    }
};

// Get all tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('createdBy assignedTo', 'name email');
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