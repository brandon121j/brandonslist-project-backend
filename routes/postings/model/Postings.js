const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        match: [/^[a-z]+$/i, 'Cannot have special characters or numbers'],
    },
    location: {
        type: String,
        required: [true, 'location is required'],
    },
    listing: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: [true, 'price is required'],
        min: 0,
        max: 999999
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: 'users'
    }
}, {timestamps: true})

module.exports = mongoose.model('postings', postsSchema)
