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
		unique: true,
        dropDups: true,
		required: [true, 'Please provide your email'],
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email'],
		trim: true
    },
    password: {
        type: String,
        required: [true, 'Please input a password'],
		minlength: 4,
		trim: true,
    },
    usersPostings: [{ type: mongoose.Schema.ObjectId, ref: 'postings'}]
}, {timestamps: true})

module.exports = mongoose.model('user', userSchema);