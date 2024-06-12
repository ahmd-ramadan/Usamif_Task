const mongoose = require('mongoose');

const Course = require('../models/course.model.js');
const Review = require('../models/review.model.js');
const User = require('../models/user.model.js');
const asyncHandler = require("../middlewares/asyncHandler.middleware.js");
const status = require('../utils/httpStatusText.js');
const appError = require('../utils/appError.js');

const courseCtrl = {
    //! Create A New Course
    createCourse: asyncHandler(
        async(req, res, next) => {
            const {title, description} = req.body;
            //! Find user
            const userFound = await User.findById(req.user);
            if(!userFound) {
                const error = appError.create(
                    'User not found', 404, status.ERROR
                );
                return next(error);
            }

            //! Validate user input
            if(!title || !description) {
                const error = appError.create(
                    'please provide all fields', 404, status.ERROR
                );
                return next(error);
            }

            //! Course exist ?
            const courseFound = await Course.findOne({title});
            if(courseFound)  {
                const error = appError.create(
                    'Course Already exist', 401, status.FAIL
                );
                return next(error);
            }

            //! Save course in database
            const courseCreated = await Course.create({
                title,
                description,
                user: req.user,
            });

            //! Push the course to user and save 
            userFound.coursesCreated.push(courseCreated._id);
            await userFound.save();

            //! Send response
            res.status(200).json({
                status: status.SUCCESS,
                data: {courseCreated},
                message: 'Course Created Successfully',
            });
        }
    ),
    
    //! Retrieve All Cources 
    list: asyncHandler(
        async(req, res, next) => {
            //! Find all courses With Details
            const courses = await Course.find().populate({
                path: "user",
                model: "User",
                select: "fname lname email"
            }).populate({
                path: "reviews",
                model: "Review",
                select: "createdBy comment rate"
            });

            //! Send response
            res.status(200).json({
                status: status.SUCCESS,
                data: {courses},
                message: 'All Coutses On Plaatform',
            });
        }
    ), 
    
    //! Retrieve A Specific Course
    getCourseById: asyncHandler(
        async(req, res, next) => {
            //! Course Exist ?
            const {courseId} = req.params;
            const course = await Course.findById(courseId).populate({
                path: "user",
                model: "User",
                select: "fname lname email"
            });
            if(!course) {
                const error = appError.create(
                    'Course not found', 404, status.ERROR
                );
                return next(error);
            }

            //! Send Response
            res.status(200).json({
                status: status.SUCCESS, 
                data: {course},
                message: '',
            });
        }
    ),
    
    //! Allowe To Users To Review
    review: asyncHandler(
        async(req, res, next) => {
            //! Recieve info
            const {courseId} = req.params;
            const {comment, rate} = req.body;
            
            //! Course exist ?
            const course = await Course.findById(courseId);
            if(!course) {
                const error = appError.create(
                    'Course not found', 404, status.ERROR
                );
                return next(error);
            }

            // if(!rate) {
            //     const error = appError.create(
            //         'Rate field is required', 401, status.FAIL
            //     );
            //     return next(error);
            // }
            
            //! Save review in database
            const review = await Review.create({
                comment: comment || '',
                rate,
                createdBy: req.user,
                courseId,
            });

            //! Add the review to course
            course.reviews.push(review._id);
            await course.save();

            //! Send response
            res.status(200).json({
                status: status.success,
                data: {
                    course,
                    review,
                },
                message: 'Review Added Successfully',
            });
        }
    ),
    
    //! Allow To User to like / Add to Favorite List
    like: asyncHandler(
        async(req, res, next) => {
            //! Course exist ?
            const {courseId} = req.params;
            const course = await Course.findById(courseId);
            if(!course) {
                const error = appError.create(
                    'Course not found', 404, status.ERROR
                );
                return next(error);
            }
            
            //! User exist ?
            const userId = req.user;
            const user = await User.findById(userId);
            if(!user) {
                const error = appError.create(
                    'User not found', 404, status.ERROR
                );
                return next(error);
            }

            // console.log(user, course);
            
            //! Check the course if alredy in favourite list
            if(course.likes.includes(user._id)) {
                const error = appError.create(
                    'User already liked this before', 401, status.ERROR
                );
                return next(error);
            }
            
            //! Add Like to Course / Course To user favorite list and Save
            user.favList.push(course._id);
            await user.save();

            course.likes.push(user._id);
            await course.save();
            
            //! Send Response
            res.status(200).json({
                status: status.SUCCESS,
                data: {
                    course: {
                        title: course.title,
                        likesCnt: course.likes.length,
                        likes: course.likes,
                    },
                    user: {
                        username: `${user.fname} ${user.lname}`,
                        email: user.email,
                        favList: user.favList,
                    },
                },
                message: 'Liked Course',
            });
        }
    ),
    
    //! Retrieve The Recent Cources Created 
    recent: asyncHandler(
        async(req, res, next) => {
            //! Detect the recent courses 
            const limit = parseInt(req.query.limit) || 10; 
            const courses = await Course.find().sort({createdAt: -1}).limit(limit);
            
            //! Send Response
            res.status(200).json({
                status: status.SUCCESS,
                data: courses,
                message: '',
            });
        }
    ), 
    
    //! List For Recommendation Courses Based On User Review Specially Rating
    recommendCources: asyncHandler(
        async(req, res, next) => {
            //! Convert to ObjectId
            const userId = new mongoose.Types.ObjectId(req.user);
            
            //! Fetch all reviews by the user
            const userReviews = await Review.find({createdBy: userId}, {_id: 0, courseId: 1});
            
            //! Fetch All Courses
            const allCourses = await Course.find({}, {reviews: 1}).populate({
                path: 'reviews',
                model: 'Review',
                select: 'rate'
            });

            //! To String
            const reviewedCourseIds = userReviews.map(review => review.courseId.toString());

            //! debug
            // console.log(allCourses[2]);
            // console.log(reviewedCourseIds.includes(allCourses[2]._id));
            // console.log(reviewedCourseIds[0]);
            // console.log(allCourses[2]._id);
            // console.log(typeof reviewedCourseIds);

            //! Filter out courses that the user has already reviewed
            const remainingCourses = allCourses.filter(
                course => !reviewedCourseIds.includes(course._id.toString())
            );

            //! Group reviews by course and calculate average rating
            const courseRatings = {};
            remainingCourses.forEach(course => {
                courseRatings[course._id] = {totalRating: 0, count: 0};
                course.reviews.forEach(review => {
                    courseRatings[course._id].totalRating += review.rate;
                    courseRatings[course._id].count ++;    
                });
            });

            //! Calculate average rating for each course
            const averageRatings = {};
            for (const courseId in courseRatings) {
                averageRatings[courseId] = courseRatings[courseId].totalRating / courseRatings[courseId].count;
            }

            //! Sort courses by average rating Desc
            const sortedCourses = Object.keys(averageRatings).sort((a, b) => averageRatings[b] - averageRatings[a]);

            //! Return top recommended courses according limit
            const {limit} = parseInt(req.query.limit) || 10;
            const recommendedCourses = sortedCourses.slice(0, limit);
            
            //! Get Full structure For Course
            const result = await Course.find({
                _id: {$in: recommendedCourses.map(courseId => new mongoose.Types.ObjectId(courseId)) }
            });
                

            // res.json({
            //     userReviews,
            //     allCourses,
            //     reviewedCourseIds,
            //     remainingCourses,
            //     courseRatings,
            //     averageRatings,
            //     recommendedCourses
            // });

            // //! Send response
            res.status(200).json({
                status: status.SUCCESS,
                data: result,
                message: 'Good Recommended Courses for you',
            });
        }
    ),
};

module.exports = courseCtrl;