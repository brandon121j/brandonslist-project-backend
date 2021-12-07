const Posts = require('./model/Users');
const Users = require('../users/model/Users');

const createListing = async (req, res) => {
    let {
        category,
        location,
        listing,
        price,
        description,
        userID
    } = req.body;

    try {
        let decodedData = res.locals.decodedData;

        let foundUser = await Users.findOne({ email: decodedData.email });

        const createdListing = new Posts({
            category,
            location,
            listing,
            price,
            description,
            userID
        });

        let savedListing = await createdListing.save();

        foundUser.usersPostings.push(savedListing._id);

        await foundUser.save();

        res.json({ message: "SUCCESS", createListing })
    } catch(e) {
        res.status(500).json({
            message: "ERROR",
            error: e.message
        });
    }
}