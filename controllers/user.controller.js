const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model.js');
const asyncHandler = require("../middlewares/asyncHandler.middleware.js");
const status = require('../utils/httpStatusText.js');
const appError = require('../utils/appError.js');
const sendEmail = require('../utils/sendEmail.js');

const userCtrl = {
    //! Register User With Activate Email
    signup: asyncHandler(
        async(req, res, next) => {
            //! Check Fields
            const {fname, lname, email, password} = req.body;
            if(!email || !lname || !password) {
                const error = appError.create('Pleasse all fields are required', 400, status.FAIL);
                return next(error);
            }

            //! User Exist ?
            const userExist = await User.findOne({email});
            if(userExist) {
                const error = appError.create('User already existed', 400, status.FAIL);
                console.log(error);
                return next(error);
            }
            
            //! Hashed password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            // console.log(hashedPassword);
            
            //! Save User in database
            const newUser = await User.create({
                fname: fname || '',
                lname,
                email,
                password: hashedPassword,
            });

            //! Activate User
            const token = jwt.sign({
                email: email, 
                id: req.body._id
            }, 
            process.env.SECRET_KEY, 
            {expiresIn: "30min"});

            const PORT = process.env.PORT;
            const activationLink = `http://localhost:${PORT}/activate/${token}`;
            const messageSent = await sendEmail({
                to: email,
                subject: 'Account Activation',
                html: `<a href="${activationLink}">Click here to activate your account</a>`,
            });
            if (!messageSent) {
                const error = appError.create(
                    'Email is invalid', 400, status.FAIL
                )
                return next(error);
            } 

            //! Send Response
            res.status(200).json({
                status: status.SUCCESS,
                data: {
                    email: newUser.email,
                    fname: newUser.fname,
                    lname: newUser.lname,
                    _id: newUser._id,
                },
                message: `Account Created Succefully ... Please Check Your Email To Activate Acoount`,
            });
        }
    ),

    //! Activate The Account
    activate: asyncHandler(
        async(req, res, next) => {
            //! Recieve token and Decode it
            const {token} = req.params;
            const payLoad = jwt.verify(token, process.env.SECRET_KEY);
    
            //! User exist ?
            const user = await User.findOneAndUpdate(
                {email: payLoad.email}, 
                {confirmEmail: true}, 
                {new: true}
            );
            if (!user) {
                const error = appError.create(
                    'User not found', 404, status.ERROR
                );
                return next(error);
            }
    
            //! Send response
            res.status(200).json({
                status: status.SUCCESS, 
                data: {user},
                message: 'Account Activated, Try to login'
            });
        }
    ),
    
    //! Login User With JWT For Authentication
    login : asyncHandler(
        async(req, res, next) => {
            //! Check fields
            const {email, password} = req.body;
            if(!email || !password) {
                const error = appError.create('Pleasse all fields are required', 400, status.FAIL);
                return next(error);
            }

            //! User Exist And Activate ?
            const user = await User.findOne({email});
            if(!user) {
                const error = appError.create('Invalid email or password', 400, status.FAIL);
                return next(error);
            }

            if(!user.confirmEmail) {
                const error = appError.create(
                    'Please confirmed your email', 400, status.FAIL
                );
                return next(error);
            }

            //! Validate password
            const userPassword = user.password;
            const isMatch = await bcrypt.compare(password, userPassword);
            if(!isMatch) {
                const error = appError.create('Invalid email or password', 400, status.FAIL);
                return next(error);
            }

            //! Create Token
            const key = process.env.SECRET_KEY;
            const token = jwt.sign(
                {
                    user: user._id,
                }, key,
                {
                    expiresIn: "30d",
                }
            );

            //! Send Response
            res.status(200).json({
                status: status.SUCCESS,
                data: {
                    email: user.email,
                    fname: user.fname,
                    lname: user.lname,
                    token: token,
                },
                message: `Welcome here ${user.fname ? user.fname + ' ':''}${user.lname}`,
            });
        }
    ),

    //! Retreive Favourite List Likes By User
    favList: asyncHandler(
        async(req, res, next) => {
            //! User exist ? 
            const userId = req.user;
            const user = await User.findById(userId).populate({
                path: "favList",
                model: "Course",
                select: "title description"
            });
            
            if(!user) {
                const error = appError.create(
                    'USer not found', 404, status.ERROR
                );
                return next(error);
            }

            //! Send response
            res.status(200).json({
                status: status.SUCCESS,
                data: user.favList,
                message: 'The liked list of cources',
            })
        }
    ) 
};

module.exports = userCtrl;

