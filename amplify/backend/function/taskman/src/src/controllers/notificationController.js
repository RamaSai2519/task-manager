const Notification = require('../models/Notification');
const ResponseFormatter = require('../utils/responseFormatter');

// Get notifications for a user
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(ResponseFormatter.format({ data: notifications }));
    } catch (error) {
        res.status(500).json(ResponseFormatter.format({ msg: 'Server error', success: false }));
    }
};