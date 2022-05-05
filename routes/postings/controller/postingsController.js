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

			cloudinary.uploader.upload(files.picture.filepath, {folder: 'brandonsList'}, async(error, result) => {
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
						picture_id: result.public_id
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

const deletePost = async(req, res) => {
	try {

		let picture = await Posts.findById(req.params.id);

		cloudinary.uploader.destroy(picture.picture_id, function(result) { console.log(result) });

		const decodedData = res.locals.decodedData;

		let deletedPost = await Posts.findByIdAndDelete(req.params.id);

		let foundUser = await Users.findOne({ email: decodedData.email });

		let filteredPosts = foundUser.usersPostings.filter((item) => {
			return item !== picture._id;
		});

		foundUser.usersPostings = filteredPosts;

		await foundUser.save();

		res.json({
			message: "SUCCESS",
			deleted: deletedPost,
		});
	} catch(err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
};

const addToFavorites = async(req, res) => {
	try {

		const decodedData = res.locals.decodedData;

		let foundUser = await Users.findOne({ email: decodedData.email });

		let alreadyAdded = foundUser.usersFavorites.indexOf(req.params.id) > -1 

		if (alreadyAdded) {
			res.json({ message: 'Listing already in favorites'})
		} else {

		foundUser.usersFavorites.push(req.params.id)

		await foundUser.save()

		res.json({
			message: "Listing added to favorites!",
		});
	}
	} catch(err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
};

const removeFromFavorites = async(req, res) => {
	try {
		let favorite = await Posts.findById(req.params.id)

		const decodedData = res.locals.decodedData;

		let foundUser = await Users.findOne({ email: decodedData.email });

		let filteredFavorites = foundUser.usersFavorites.filter((item) => {
			return item.toString() !== favorite._id.toString();
		});
		
		foundUser.usersFavorites = filteredFavorites;

		await foundUser.save();

		res.json({
			message: "SUCCESS",
			deleted: foundUser,
		});
	} catch(err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
};

const getUsersFavorites = async(req, res) => {
	try {
		let decodedData = res.locals.decodedData;

		let foundUser = await Users.findOne({ email: decodedData.email }).populate('usersFavorites');

		res.json({ payload: foundUser })
	} catch(err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
};

const singleListing = async(req, res) => {
	try {
		let singleListing = await Posts.findById(req.params.id);

		res.json({ MESSAGE: "SUCCESS", payload: singleListing})
	} catch(err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
};

const updateListing = async(req, res) => {
	try {
		const form = formidable({ multiples: true });

		let foundPost = await Posts.findById(req.params.id);

		form.parse(req, (err, fields, files) => {
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

			cloudinary.uploader.destroy(foundPost.picture_id, function(result) { console.log(result) });

			cloudinary.uploader.upload(files.picture.filepath, async(error, result) => {
				if (error) {
					return res.status(500).json({ ERROR: error });
				} else {

					let decodedData = res.locals.decodedData;
					
					let updatedListing = await Posts.findByIdAndUpdate(req.params.id, {
						category,
						city,
						state,
						zip,
						picture: result.secure_url,
						listing,
						price,
						description,
						userID,
						picture_id: result.public_id
					}, { new: true });

					res.json({
						MESSAGE: 'SUCCESS',
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

module.exports = {
	createListing,
	getAllListings,
	testUpload,
	getUsersListings,
	deletePost,
	addToFavorites,
	singleListing,
	getUsersFavorites,
	removeFromFavorites,
	updateListing
};
