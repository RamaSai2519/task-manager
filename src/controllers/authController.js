const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ResponseFormatter = require('../utils/responseFormatter');

// Register a new user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json(ResponseFormatter.format({ msg: 'User already exists', success: false }));

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json(ResponseFormatter.format({ msg: 'User registered successfully' }));
    } catch (error) {
        res.status(500).json(ResponseFormatter.format({ msg: 'Server error', success: false }));
    }
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json(ResponseFormatter.format({ msg: 'Invalid credentials', success: false }));

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json(ResponseFormatter.format({ msg: 'Invalid credentials', success: false }));

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json(ResponseFormatter.format({ data: { token }, msg: 'Login successful' }));
    } catch (error) {
        res.status(500).json(ResponseFormatter.format({ msg: 'Server error', success: false }));
    }
};