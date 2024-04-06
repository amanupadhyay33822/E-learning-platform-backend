const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();


//auth
exports.auth = async (req, res, next) => {
    try {
       
        const {token} = req.cookies 
        || req.body 
        || req.header("Authorization").replace("Bearer ", "");
        
        if(!token ){
            return res.status(401).json({
                sucess: false,
                message:"token not found",
            })
        }

        //verify token 
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user=decode;
            
        } catch (error) {
            return res.status(401).json({
                sucess: false,
                message:"token invalid",
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            sucess: false,
            message:error.message, 
        })
    }
}
//isStudent
exports.isStudents = async (req, res,next) => {
   try {
      if(req.user.role !== "Student"){
        return res.status(401).json({
            sucess: false,
            message:"this is protected route for students",
        })
      }
      next();
   } catch (error) {
    return res.status(401).json({
        sucess: false,
        message:error.message,
    })
   }
}

//isInstructor
exports.isInstructor = async (req, res,next) => {
    try {
       if(req.user.role !== "Instructor"){
         return res.status(401).json({
             sucess: false,
             message:"this is protected route for instructor",
         })
       }
       next();
    } catch (error) {
     return res.status(401).json({
         sucess: false,
         message:error.message,
     })
    }
 }
 

//isAdmin
exports.isAdmin = async (req, res,next) => {
    try {
       if(req.user.role !== "Admin"){
         return res.status(401).json({
             sucess: false,
             message:"this is protected route for admin",
         })
       }
       next();
    } catch (error) {
     return res.status(401).json({
         sucess: false,
         message:error.message,
     })
    }
 }
 