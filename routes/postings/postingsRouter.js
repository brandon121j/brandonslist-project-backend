const express = require('express');
const {
	createListing,
	getAllListings,
	getUsersListings,
	deletePost,
	addToFavorites,
	singleListing,
	getUsersFavorites,
    removeFromFavorites,
    updateListing
} = require('./controller/postingsController');
const { jwtMiddleware } = require('../util/jwtMiddleware');

const router = express.Router();

router.get('/get-users-listings', jwtMiddleware, getUsersListings);

router.post('/create-listing', jwtMiddleware, createListing);

router.get('/get-all-listings', getAllListings);

router.delete('/delete-post/:id', jwtMiddleware, deletePost);

router.post('/add-favorite/:id', jwtMiddleware, addToFavorites);

router.get('/single-listing/:id', singleListing);

router.get('/users-favorites', jwtMiddleware, getUsersFavorites);

router.delete('/remove-favorite/:id', jwtMiddleware, removeFromFavorites);

router.put('/update-post/:id', jwtMiddleware, updateListing);

module.exports = router;
