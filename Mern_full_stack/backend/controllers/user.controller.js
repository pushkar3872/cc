const User = require('../models/user.model');

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
exports.createUser = async (req, res) => {
    try {
        const { name, email, age } = req.body;
        
        // Simple validation
        if (!name || !email || !age) {
            return res.status(400).json({ message: 'Please provide all required fields (name, email, age)' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = new User({
            name,
            email,
            age
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Public
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, age } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, age },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        // Handle potential duplicate email error during update
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email is already in use by another user' });
        }
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Public
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
