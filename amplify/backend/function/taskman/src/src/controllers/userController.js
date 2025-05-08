const User = require('../models/User');

/**
 * Fetch users with optional filtering on name and email.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getUsers = async (req, res) => {
    try {
        const { search } = req.query; // Get the search parameter from query string
        const filter = {};

        if (search) {
            const regex = new RegExp(search, 'i'); // Case-insensitive regex for filtering
            filter.$or = [
                { name: regex },
                { email: regex }
            ];
        }

        const users = await User.find(filter, '_id name email') // Select only _id, name, and email
            .limit(10); // Limit results to 10

        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getUsers };