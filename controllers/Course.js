const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

exports.createCourse = async (req,res) => {
    try {
          //fetch data 
          const {courseName, courseDescription, whatYoutWillLearn, price, category} = req.body;
        //   console.log(req.body);
           //get thumbnail
        const thumbnail = req.files.thumbnail;
        
           
        //validation
        if(!courseName || !courseDescription || !whatYoutWillLearn || !price || !category) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }
        
        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        //TODO: Verify that userId and instructorDetails._id  are same or different ?

        if(!instructorDetails) {
            return res.status(404).json({
                success:false,
                message:'Instructor Details not found',
            });
        }

          //check given category is valid or not
          const categoryDetails = await Category.findById(category);
          if(!categoryDetails) {
            return res.status(404).json({
                success:false,
                message:'category Details not found',
            });
        }
        
        //Upload Image top Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
         
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYoutWillLearn,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })
          //add the new course to the user schema of Instructor
          await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new:true},
        );
         //update the category ka schema 
        //TODO: HW
        await Category.findByIdAndUpdate(
            {_id: category},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new:true},
        );

        //return response
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create Course',
            error: error.message,
        })
    }
}


//getAllCourses handler function

exports.getAllCourses = async (req, res) => {
    try {
            //TODO: change the below statement incrementally
            const allCourses = await Course.find({})
            

            return res.status(200).json({
                success:true,
                message:'Data for all courses fetched successfully',
                data:allCourses,
            })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot Fetch course data',
            error:error.message,
        })
    }
}

exports.getCourseDetails = async (req,res) => {
    try {
        //get id
        const {courseId} = req.body;
        //find course details
        const courseDetails = await Course.find({
            _id:courseId,
        })
        .populate(
            {
                path:"instructor",
                populate:{
                    path:"additionalDetails"
         }
            }
        )
        .populate("ratingAndReviews")
        .populate("category")
        .populate(
            {
                
                path:"courseContent",
                populate:{
                    path:"subSection"
         }
            }
        )
        .exec();
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:'Course Details not found',
            });
        }
        //return res
        return res.status(200).json({
            success:true,
            message:'Data of a courses fetched successfully',
            courseDetails,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot Fetch  a course data',
            error:error.message,
        }) 
    }
}