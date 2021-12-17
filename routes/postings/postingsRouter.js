const express = require("express");
const { createListing, getAllListings, testUpload } = require("./controller/postingsController");
const { jwtMiddleware } = require('../util/jwtMiddleware');
const multer  = require('multer');
const upload = multer({ dest: './public/data/uploads/' });

const router = express.Router();

router.post("/create-listing",  upload.single('picture'), testUpload);

router.post("/create-listing", jwtMiddleware, upload.single('picture'), createListing);

router.get('/get-all-listings', getAllListings);


module.exports = router;