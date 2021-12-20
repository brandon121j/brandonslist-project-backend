const Posts = require('../model/Postings');
const Users = require('../../users/model/Users');
const errorHandler = require('../../util/errorHandler');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();
cloudinary.config({
	cloud_name: process.env.cloud_name,
	api_key: process.env.api_key,
	api_secret: process.env.api_secret,
});

const createListing = async(req, res) => {

	try {
		const form = formidable({ multiples: true });

		form.parse(req, (err, fields, files) => {
			// console.log("WORKGIN!!!!!!")
			if (err) {
				res.status(500).json({
					message: 'ERROR',
					error: errorHandler(err),
				});
			}

			let {
				category,
				city,
				state,
				zip,
				listing,
				picture,
				price,
				description,
				userID,
			} = fields;

			cloudinary.uploader.upload(files.picture.filepath, async(error, result) => {
				if (error) {
					return res.status(500).json({ ERROR: error });
				} else {
					let decodedData = res.locals.decodedData;

					let foundUser = await Users.findOne({ email: decodedData.email });

					const createdListing = new Posts({
						category,
						city,
						state,
						zip,
						picture: result.secure_url,
						listing,
						price,
						description,
						userID,
					});

					let savedListing = await createdListing.save();

					foundUser.usersPostings.push(savedListing._id);

					await foundUser.save();

					res.json({
						MESSAGE: 'SUCCESS',
						RESULT: savedListing
					});
				}
			});
		});
	} catch (err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
};

const getUsersListings = async (req, res) => {
	try {
		let decodedData = res.locals.decodedData;

		let foundUser = await Users.findOne({ email: decodedData.email }).populate('usersPostings');

		let postings = await Posts.find({})

		let filteredPostings = postings.map((item) => item._id);

		let usersPosts = postings.filter((item) => item);

		res.json({ payload: foundUser });
	} catch (err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
};

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
	getUsersListings,
};
