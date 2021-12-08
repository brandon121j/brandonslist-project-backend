const bcrypt = require('bcryptjs');
const User = require('../model/User');
const ErrorClass = require('../../utils/error/ErrorClass');

async function createUser(req, res, next) {
	try {
		let salt = await bcrypt.genSalt(12);

		const createdUser = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: hashedPassword,
		});

		let hashedPassword = await bcrypt.hash(req.body.password, salt);

		createdUser.password = hashedPassword;

		let savedUser = await createdUser.save();

		res.json({
			message: 'success! user created please login',
			savedUser: savedUser,
		});
	} catch (err) {
		// res.status(500).json({ message: 'error', err });
		return next(ErrorClass(err));
	}
}

module.exports = {
	createUser,
};
