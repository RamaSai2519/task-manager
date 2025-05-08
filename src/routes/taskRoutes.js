const express = require('express');
const { createTask, getTasks, updateTask, deleteTask, getDashboardData } = require('../controllers/taskController');
const router = express.Router();

// Create a new task
router.post('/', createTask);

// Get all tasks
router.get('/', getTasks);

// Update a task
router.put('/:id', updateTask);

// Delete a task
router.delete('/:id', deleteTask);

// Fetch dashboard data
router.get('/dashboard', getDashboardData);

module.exports = router;