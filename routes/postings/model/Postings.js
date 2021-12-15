const mongoose = require('mongoose');
const validator = require('validator');

const postsSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        match: [/^[a-z]+$/i, 'Cannot have special characters or numbers'],
    },
    city: {
        type: String,
        required: [true, 'city is required'],
        match: [/^[a-z]+$/i, 'Cannot have special characters or numbers'],
    },
    state: {
        type: String,
        required: [true, 'state is required'],
        match: [/^[a-z]+$/i, 'Cannot have special characters or numbers'],
    },
    zip: {
        type: String,
        required: [true, 'zip code is required'],
    },
    listing: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        default: "https://www.freeiconspng.com/uploads/no-image-icon-6.png"
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
