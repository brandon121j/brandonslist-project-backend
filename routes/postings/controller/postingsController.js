const Posts = require('../model/Postings');
const Users = require('../../users/model/Users');
const errorHandler = require('../../util/errorHandler');


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
    } catch(err) {
        res.status(500).json({
            message: "ERROR",
            error: errorHandler(err)
        });
    }
}

const getAllListings = async(req, res) => {
    try {
        let allListings = await Posts.find({});

        res.json({ message: "SUCCESS", allPostings: allListings});
    } catch(err) {
        res.status(500).json({
        message: "ERROR",
        error: errorHandler(err)
        })
    }
}

module.exports = {
    createListing,
    getAllListings
};