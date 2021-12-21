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
					console.log(result)

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

const deletePost = async(req, res) => {
	try {

		let picture = await Posts.findById(req.params.id);

		console.log(picture)

		cloudinary.uploader.destroy(picture.picture_id, function(result) { console.log(result) });

		const decodedData = res.locals.decodedData;

		let deletedPost = await Posts.findByIdAndDelete(req.params.id);

		let foundUser = await Users.findOne({ email: decodedData.email });

		console.log(foundUser)

		let filteredPosts = foundUser.usersPostings.filter((item) => {
			console.log(item)
			item.toString() !== picture._id.toString();
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
}

const addFavorite = async(req, res) => {
	try {
		let decodedData = res.locals.decodedData;

		let foundUser = await Users.findOne({ email: decodedData.email });

		foundUser.usersFavorites.push(req.params.id);
	} catch(err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
}

module.exports = {
	createListing,
	getAllListings,
	testUpload,
	getUsersListings,
	deletePost,
	addFavorite
};
