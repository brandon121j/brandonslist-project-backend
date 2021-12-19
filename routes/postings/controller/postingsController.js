const Posts = require('../model/Postings');
const Users = require('../../users/model/Users');
const errorHandler = require('../../util/errorHandler');
const formidable = require('formidable').v2;
const cloudinary = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config();
console.log(cloudinary.config())

const createListing = async (req, res) => {

	

	
}

const getUsersListings = async (req, res) => {
	try {
		const decodedData = res.locals.decodedData;

        let foundUser = await Users.findOne({ email: decodedData.email });

		let usersListings = await Posts.find({});

		let filteredListings = usersListings.filter(posts => { posts.userID.toString()  === foundUser._id.toString()});

		res.json({ MESSAGE: "SUCCESS", usersListings: filteredListings });
	} catch(err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
}

const getAllListings = async (req, res) => {
	try {
		let allListings = await Posts.find({});

		res.json({ message: 'SUCCESS', allPostings: allListings });
	} catch (err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
};

const testUpload = async (req, res) => {
	try {
		console.log(req.file);
		console.log(req.body);
		res.json({
			message: 'SUCCESS',
		});
	} catch (e) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
};

module.exports = {
	createListing,
	getAllListings,
	testUpload,
	getUsersListings
};
