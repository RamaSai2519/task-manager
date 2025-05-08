const Task = require('../models/Task');
const ResponseFormatter = require('../utils/responseFormatter');

// Fetch dashboard data
exports.getDashboardData = async (req, res) => {
    console.log("🚀 ~ exports.getDashboardData= ~ req:", req);
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
        console.log("🚀 ~ exports.getDashboardData= ~ error:", error);
        res.status(500).json(ResponseFormatter.format({ msg: 'Server error', success: false }));
    }
};