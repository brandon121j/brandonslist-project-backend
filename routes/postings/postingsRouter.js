const express = require("express");
const { createListing, getAllListings } = require("./controller/postingsController");
const { jwtMiddleware } = require('../util/jwtMiddleware');

const router = express.Router();

router.post("/create-listing", jwtMiddleware, createListing);

router.get('/get-all-listings', getAllListings);

module.exports = router;