const mailSender = require("../utils/mailSender");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
	try {
		const email = req.body.email;
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.json({
				success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
			});
		}
		const token = crypto.randomBytes(20).toString("hex");

		const updatedDetails = await User.findOneAndUpdate(
			{ email: email },
			{
				token: token,
				resetPasswordExpires: Date.now() + 3600000,
			},
			{ new: true }
		);
		// console.log("DETAILS", updatedDetails);

		const url = `http://localhost:3000/update-password/${token}`;

		await mailSender(
			email,
			"Password Reset",
			`Your Link for email verification is ${url}. Please click this url to reset your password.`
		);

		res.json({
			success: true,
			message:
				"Email Sent Successfully, Please Check Your Email to Continue Further",
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
	}
};

//resetPassword
// exports.resetPasword = async (req,res) => {
//     try {
//         //data fetch
//         const {email, password,confirmPassword,token} = req.body; 
//         //validation
//         if(password !== confirmPassword){
//            return res.status(400).json({
//                 sucess: false,
//                 message:"incorrect password",
                
//                })
//         }
//         //get userdetails from db using token
//         console.log(token)
//         const user = await User.findOne({token:token});
//         //if no entry - invalid token
//         if(!user){
//             return res.status(400).json({
//                 sucess: false,
//                 message:"invalid token",
                
//                })
//         }
//         //token time check
//         if(user.resetPasswordExpires < Date.now()){
//             return res.status(400).json({
//                 sucess: false,
//                 message:"token expires",
                
//                })
//         }
//         //hash pwd
//         const hashedPassword = await bcrypt.hash(password, 10);
//         //password update
//         await User.findOneAndUpdate({token:token},
//             {password:hashedPassword},
//             {new:true})
//         //return res
//         return  res.status(400).json({
//             sucess: true,
//             message:"reset password done",
            
//            })
//     } catch (error) {
//         res.status(400).json({
//             sucess: false,
//             message:error.message,
            
//            })
//     }
// }

exports.resetPassword = async (req, res) => {
	try {
		const { password, confirmPassword, token } = req.body;

		if (confirmPassword !== password) {
			return res.json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
		}
		const userDetails = await User.findOne({ token: token });
		if (!userDetails) {
			return res.json({
				success: false,
				message: "Token is Invalid",
			});
		}
		if (!(userDetails.resetPasswordExpires > Date.now())) {
			return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
			});
		}
		const encryptedPassword = await bcrypt.hash(password, 10);
		await User.findOneAndUpdate(
			{ token: token },
			{ password: encryptedPassword },
			{ new: true }
		);
		res.json({
			success: true,
			message: `Password Reset Successful`,
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
	}
};