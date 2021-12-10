const bcrypt = require('bcryptjs');
const User = require('../model/Users');
const jwt = require('jsonwebtoken');

const errorHandler = require('../../util/errorHandler');


async function createUser(req, res, next) {
	const { firstName, lastName, email, password } = req.body;
	try {
		let salt = await bcrypt.genSalt(12);

		let hashedPassword = await bcrypt.hash(password, salt);

		const createdUser = new User({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: hashedPassword,
		});

		let savedUser = await createdUser.save();

		res.json({
			message: 'success! user created please login',
			savedUser: savedUser,
		});
	} catch (err) {
		res.status(500).json({
            message : "failed",
            error : errorHandler(err)
        })
		// res.status(500).json({ message: 'error', err });
		// return next(ErrorClass(err));
	}
}

async function login(req, res, next){
    const {email, password } = req.body

    try{
        let foundUser = await User.findOne({email: email})

        if(!foundUser){
            res.status(500).json({
                message : "error",
                error: "User not found. Please sign up!"
            })

        }else{

            let comparedPassword = await bcrypt.compare(password, foundUser.password)

            if(!comparedPassword){
                res.status(500).json({
                    message : 'error',
                    error: "Incorrect login information. Please try again"
                })
            }else{
                let jwtToken = jwt.sign (
                    {
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName,
                        email : foundUser.email,
                        id : foundUser._id
                    },
                    process.env.JWT_SECRET,
                    {expiresIn : "24h"}
                )

                res.json({
                    message : 'successfully logged in',
                    token : jwtToken
                })
            }
        }
    }catch(e){
        res.status(500).json({
            message: 'error',
            error : errorHandler(e)})
    }
}

module.exports = {
	createUser,
	login
};
