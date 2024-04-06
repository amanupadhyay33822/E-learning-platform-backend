const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const {uploadImageToCloudinary} = require("../utils/imageUploader");


exports.createSubSection = async (req,res) => {
    try {
           //extract data\
           const {title,timeDuration,description,sectionId}=req.body;
           //extract file/video
             const video = req.files.videoFile;
           //validation 
           if(!title || !timeDuration || !description || !sectionId || !video){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
           }
           // upload video to cloudinary
           const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
           //create a sub section 
           const SubSectiondetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl:uploadDetails.secure_url,
           })
           //update section with this with sub section data 
           const updatedSubSectionDetails = await Section.findByIdAndUpdate(
            sectionId,
            { 
                $push:{
                    subSection:SubSectiondetails._id
                }
            },
            {new:true}

        ).populate("subSection").exec();
           //return res
           return res.status(200).json({
            success:true,
            message:"SubSection Created Successfully",
            updatedSubSectionDetails,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'SubSection can not be created',
            error: error.message,
        })  
    }
}