const Course = require("../models/Course");
const Section = require("../models/Section");


exports.createSection = async  (req,res) =>{
    try {
        //data fetch 
        const {sectionName,courseId} = req.body;
        //data validate
        if(!sectionName || !courseId){
            return res.status(500).json({
                success:false,
                message:'All fields are required',
                
            })
        }
        //create section
        const newSection = await Section.create({sectionName});
        //insert section id in course schema
       const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id
                }
            },
            {new:true}

        )
        //return res
        return res.status(200).json({
            success:true,
            message:"Section Created Successfully",
            updatedCourseDetails,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Section can not be created',
            error: error.message,
        })
    }
}


exports.updateSection = async (req,res) => {
    try {
        //data fetch 
        const {sectionName,sectionId}= req.body;
        //validate
        if(!sectionName || !sectionId){
            return res.status(500).json({
                success:false,
                message:'All fields are required',
                
            })
        }
        //update
        const updatedsectiondetails = await Section.findByIdAndUpdate(
            sectionId,
            {sectionName},
            {new:true},
        )
        //return res
        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully",
            updatedsectiondetails,
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Section can not be updated',
            error: error.message,
        })
    }
}
exports.deleteSection = async (req,res) => {
   try {
    //get id
    const {sectionId,courseId} = req.body;
    //delete section
   await Section.findByIdAndDelete(sectionId)
   
    //return res
    return res.status(200).json({
        success:true,
        message:"Section Deleted Successfully",
        
    });
   } catch (error) {
    return res.status(500).json({
        success:false,
        message:'Section can not be updated',
        error: error.message,
    })
   }
}
