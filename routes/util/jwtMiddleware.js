const jwt = require('jsonwebtoken');

function jwtMiddleware(req, res, next) {
    try {

        if (req.headers && req.headers.authorization) {
            
            let notDecodedToken = req.headers.authorization;

            let slicedToken = notDecodedToken.slice(7);

            let decodedToken = jwt.verify(slicedToken, process.env.JWT_SECRET);

            res.locals.decodedData = decodedToken;
            
            next();
        } else {
            throw ({ message: "You don't have permission"})
        }
    } catch(e) {
        res
            .status(500)
            .json({ message: "ERROR", error: e.message })
    }
}

module.exports = { jwtMiddleware }