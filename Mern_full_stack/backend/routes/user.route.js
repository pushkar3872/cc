const express = require('express');
const router = express.Router();
const { 
    createUser, 
    getUsers, 
    updateUser, 
    deleteUser 
} = require('../controllers/user.controller');

// Route for creating and fetching users
router.route('/')
    .post(createUser)
    .get(getUsers);

// Route for updating and deleting a specific user
router.route('/:id')
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
