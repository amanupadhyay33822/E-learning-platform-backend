const User = require("../models/User");
const Profile = require("../models/Profile");

exports.updateProfile = async (req, res, next) => {
    try {
        //data fetch
        
        const {dateOfBirth="", about="", profession="", gender} = req.body;
        //id fetch
        const id = req.user.id;
        //validation
        if(!profession || !dateOfBirth || !about || !gender) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        } 
        
        //find profile
        const userDetails = await User.findById(id);
        
        const profile = await Profile.findById(userDetails.additionalDetails);
        console.log(profile);
        //update profile
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.gender = gender;
        profile.profession = profession;
        await profile.save();
        //return response
        return res.status(200).json({
          success: true,
          message: "Profile Updated Successfully",
          profile,
        });
    } catch (error) {
      
        return res.status(500).json({
            success:false,
            message:'profile can not be updated',
            error: error.message,
        })  
    }
}


exports.deleteAccount = async (req,res) => {
    try {
        //fetch id
        const id= req.user.id;
        //validate
        console.log(id);
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:'User id not found',
            });
        }
        //delete profile
        const profileId = userDetails.additionalDetails;
        await Profile.findByIdAndDelete(profileId);

        
        //delete user
        await User.findByIdAndDelete(id);
        //return res
          //return response
          return res.status(200).json({
            success: true,
            message: "Profile deleted Successfully",
            
          });
    } catch (error) {
        
        return res.status(500).json({
            success:false,
            message:'profile can not be deleted',
            error: error.message,
        })  
    }
}



exports.getAllUserDetails = async (req, res) => {
    try {
      //get id
      const id = req.user.id;
  
      //validation and get user details
      const userDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec();
      //return response
      return res.status(200).json({
        success: true,
        message: "User Data Fetched Successfully",
        userDetails
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};