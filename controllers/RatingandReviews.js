const User = require("../models/User");
const RatingAndReview = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

exports.createRating = async (req, res) => {
  try {
    //data fetch
    const { rating, review, courseId } = req.body;
    const userId = req.user.id;
    //validate
    if (!rating || !review) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const course = await Course.findById(courseId);
    //check user is enrolled in course or not
    if (!course.studentsEnrolled.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Student not enrolled in course",
      });
    }
    /// check if user already has given review
    const alreadyReview = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReview) {
      return res.status(400).json({
        success: false,
        message: "user alredy reviewed the course",
      });
    }

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const ratingAndReviews = await RatingAndReview.create({
      rating,
      review,
      user: userId,
      course: courseId,
    });
    
    //add this id in course modal
    const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
      {
          $push: {
              ratingAndReviews: ratingAndReviews._id,
          }
      },
      {new: true});
console.log(updatedCourseDetails);
    
    return res.status(200).json({
      success: true,
      message: "Rating and Review created Successfully",
      ratingAndReviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Rating and Review can not created",
      error: error.message,
    });
  }
};

//get avg rating and review
exports.getAveragerating = async (req, res) => {
  try {
    //get courseID
    const { courseId } = req.body;
    //calculate avg rating
    const result = await RatingAndReview.aggregate([
      {
          $match:{
              course: new mongoose.Types.ObjectId(courseId),
          },
      },
      {
          $group:{
              _id:null,
              averageRating: { $avg: "$rating"},
          }
      }
  ])
    //return rating
    
    if (result.length > 0) {
      return res.status(200).json({
        success: true,

        averageRating: result[0].averageRating,
      });
    }else{
      return res.status(200).json({
        success: true,
        message: "Rating and Review not found",
      });
    }
    //if no rating and review exist
   
  } catch (error) {
    return res.status(500).json({
      success: false,

      error: error.message,
    });
  }
};

exports.getAllRating = async (req, res) => {
  try {
    const allReview = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();
    return res.status(200).json({
      success: true,
      allReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      error: error.message,
    });
  }
};
