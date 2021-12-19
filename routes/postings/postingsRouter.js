const express = require("express");
const { createListing, getAllListings, testUpload, getUsersListings } = require("./controller/postingsController");
const { jwtMiddleware } = require('../util/jwtMiddleware');

const router = express.Router();

// router.post("/create-listing",  upload.single('picture'), testUpload);

router.get('/get-users-listings', jwtMiddleware, getUsersListings);

router.post("/create-listing", jwtMiddleware, createListing);

router.get('/get-all-listings', getAllListings);


module.exports = router;