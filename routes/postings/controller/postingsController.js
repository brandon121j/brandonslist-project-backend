const Posts = require('../model/Postings');
const Users = require('../../users/model/Users');


const createListing = async (req, res) => {
    let {
        category,
        city,
        state,
        zip,
        listing,
        picture,
        price,
        description,
        userID
    } = req.body;

    try {
        let decodedData = res.locals.decodedData;

        let foundUser = await Users.findOne({ email: decodedData.email });

        const createdListing = new Posts({
            category,
            city,
            state,
            zip,
            picture,
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

const getAllListings = async(req, res) => {
    
}

module.exports = {
    createListing,
};