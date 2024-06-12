const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');
const status = require('../utils/httpStatusText');

module.exports = async(req, res, next) => {
    //! Get token from header
    const headerObj = req.headers;
    const token = headerObj?.authorization?.split(" ")[1];
    // console.log(token);

    //! Verfiy the token
    const key = process.env.SECRET_KEY;
    const verifyToken = jwt.verify(
        token,
        key,
        (err, decoded) => {
            if(err) return false;
            else return decoded;
        }
    );
     
    //! Find the user
    // console.log(verifyToken);
    if(!verifyToken) {
        const error = appError.create(
            'Token expired please login again', 401, status.FAIL
        );
        next(error);
    }
    req.user = verifyToken.user;
    next();
}