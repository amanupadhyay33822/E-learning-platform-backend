const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");

exports.capturePayment = async (req, res, next) => {
    try {
        //fetch courseid and userid
        const {courseId}=req.body;
        const userId = req.user.id;
        //validate
        //valid courseid
        if(!courseId){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }
        //valid coursedetail
        let course = await Course.findById(courseId);
        if(!course){
            return res.status(400).json({
                success:false,
                message:'Could not find the course',
            });
        }
        //convert string to user id
        const uid = new mongoose.Types.ObjectId(userId);

        //user already pay for same course or no
        if(course.studentsEnrolled.includes(uid)){
            return res.status(400).json({
                success:false,
                message:'Student is already enrolled',
            });
        }

        //order create
        const amount = course.price;
        const currency = "INR";
    
        const options = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes:{
                courseId: courseId,
                userId,
            }
        };
        //call function 
        try {
            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse);
            return res.status(200).json({
                success:true,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail: course.thumbnail,
                orderId: paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount,
            });
        } catch (error) {
            return res.status(400).json({
                success:false,
                message:'order cannot be created',
                error:error.message,
            });
        }
        //return res                     
    } catch (error) {
        return res.status(400).json({
            success:false,
            
            error:error.message,
        });
    }
}

exports.verifySignature= async (req,res) =>{
    try {
        //backend secret key
        
        const webhookSecret = "12345678";
        //razorpay secret key
        const signature = req.headers["x-razorpay-signature"];
         

        //hash the secret key in backend for comparison
        const shasum = crypto.createHmac("sha256",webhookSecret);
        shasum.update(JSON.stringify(req.body)); 
        const digest = shasum.digest("hex");
       
        if(signature === digest){
            console.log("hello")
            const {courseId,userId}=req.body.payload.payment.entity.notes;
            try {
                //fulfill the action
                //find the course and enroll the student in course
               
                const enrolledCourse = await Course.findByIdAndUpdate(courseId,
                     {
                        $push:{
                            studentsEnrolled:userId
                        }
                       }  ,
                       {new:true}
                    )
                  
                    if(!enrolledCourse){
                        return res.status(400).json({
                            success:false,
                            message:"Course not found",
                            error:error.message,
                        });  
                    }
                    // find student and add id to courses array
                    const updatedUser = await User.findByIdAndUpdate(userId,
                           {
                            $push:{
                                courses:courseId
                            }
                           } ,
                           {new:true}
                        )
                        
                    if(!updatedUser){
                        return res.status(400).json({
                            success:false,
                            message:"User not found",
                            error:error.message,
                        });  
                    }
                    const emailResponse = await mailSender(
                                            updatedUser.email,
                                            "Congratulation from D company",
                                            "welcome to course"
                    )
                    return res.status(200).json({
                        success:true,
                        message:"Course added and payment done",
                        
                    });  
            } catch (error) {
                return res.status(200).json({
                    success:false,
                    
                    error:error.message,
                });   
            }



        }else{
            return res.status(400).json({
                success:false,
                message:"Invalid request",
                error:error.message,
            });  
        }

    } catch (error) {
        return res.status(400).json({
            success:false,
            error:error.message,
        });
    }
}