const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please input your first name'],
        match: [/^[a-z]+$/i, 'Cannot have special characters or numbers'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please input your last name'],
        match: [/^[a-z]+$/i, 'Cannot have special characters or numbers'],
        trim: true
    },
    email: {
        type: String,
		required: [true, 'Please provide your email'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email'],
		trim: true
    },
    username: {
        type: String,
        unqiue: true,
        required: [true, 'Please input a username'],
		match: [/^[a-zA-Z0-9]*$/g, 'Cannot have special characters'],
		trim: true
    },
    password: {
        type: String,
        required: [true, 'Please input a password'],
        validate: [validator.isStrongPassword, "Please provide a string password"],
		minlength: 4,
		trim: true,
    },
    usersFavorites: [{ type: mongoose.Schema.ObjectId, ref: 'movie'}]
}, {timestamps: true})

module.exports = mongoose.model('user', userSchema);