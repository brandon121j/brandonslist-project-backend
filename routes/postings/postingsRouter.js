const express = require("express");
const { createListing, getAllListings, testUpload, getUsersListings, deletePost, addFavorite } = require("./controller/postingsController");
const { jwtMiddleware } = require('../util/jwtMiddleware');

const router = express.Router();

// router.post("/create-listing",  upload.single('picture'), testUpload);

router.get('/get-users-listings', jwtMiddleware, getUsersListings);

router.post("/create-listing", jwtMiddleware, createListing);

router.get('/get-all-listings', getAllListings);

router.delete('/delete-post/:id', jwtMiddleware, deletePost);

router.post('add-favorite/:id', jwtMiddleware, addFavorite);


module.exports = router;