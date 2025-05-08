const express = require('express');
const { getNotifications } = require('../controllers/notificationController');
const router = express.Router();

// Get notifications for the logged-in user
router.get('/', getNotifications);

module.exports = router;