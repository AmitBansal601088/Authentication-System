import User from '../model/User_model.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import cookieParser from 'cookie-parser'
import dotenv from "dotenv"
dotenv.config()
const registeredUser = async (req, res) => {
    try
    {
        console.log(req.body)
        //Get data
        const { name, email, password } = req.body;
        //Validate
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        //Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }
        //Create user
        const user = await User.create({
            name,
            email,
            password
        });
        //Generate token
        const token = crypto.randomBytes(32).toString("hex");
        user.verificationToken = token;
        await user.save();

        // Setup mail transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_TRAP_HOST,
            port: 2525,
            secure: false,
            auth: {
                user: process.env.MAIL_TRAP_USERNAME,
                pass: process.env.MAIL_TRAP_PASSWORD,
            },
        });
        // Email options
        const mailOptions = {
            from: process.env.MAIL_TRAP_SENDEREMAIL,
            to: user.email,
            subject: "Verify Your Email",
            text: `Click to verify:${process.env.BASE_URL}/api/v1/users/verify/${token}`,
        };

        // Send email (safe)
        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.log("Email failed:", emailError.message);
        }

        // Final response
        return res.status(201).json({
            message: "User registered successfully",
            success: true,
        });

    } 
    catch (error)
    {
        console.error("Register error:", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};
const verifyUser=async(req,res)=>{
    //get token from url
    //validate token
    //find user based on token
    // set isVerified to true
    //remove verificatiom token and save it
    // return response

    const {token}=req.params
    const user=await User.findOne ({verificationToken:token})
    if(!user){
        return res.status(400).json({
            message:"Invalid token,User is not Registed!"
        })
    }else{
        user.isVerified=true
        await user.updateOne({
            $unset:{verificationToken:""}
        })
        await user.save()
        return res.status(200).json({
            message:"Verified User",
            Username:user.name
        })
    }    
}

const loginUser= async (req,res)=>{
    const {email, password} = req.body
    if (!email || !password){
        return res.status(400).json({
            message: "All fields are required",
            success: false
        });
    }
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Invalid email or password!"
            })  
        }
        const isMatch=await bcryptjs.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({
                message:"Invalid email or password!"
            })
        }
        if(!user.isVerified){
            return res.status(400).json({
                message:'User is not verified, Please verify your email!'
            })
        }
        const secretkey=process.env.SECRETKEY;
        const token= jwt.sign({id:user._id}, secretkey,{expiresIn:'24h'})
        const options={
            httpOnly:true,
            secure:false
        }
        res.cookie("test",token,options)
        res.status(200).json({
            success:true,
            message:'Login Successful',
            token,
            user:{
                id:user._id,
                name:user.name
            }
        })
    }
    catch(error){
        return res.status(400).json({
                message:"Internal Error!",
                error:error.message
        })
    }

}
const getMe= async (req,res)=>{
    try{
        const user=await User.findById(req.user.id).select('-password')  // token mein user ko rakha tha jimein id:_id tha
        if(!user){
            return res.status(400).json({
                success:false,
                message:'User not Found'
            })
        }
        return res.status(200).json({
            success:true,
            user   // user bhejdiya
        })
    }
    catch(error){
        return res.status(400).json({
                message:"Internal Error!",
                error:error.message
        })
    }
}
const logoutUser= async (req,res)=>{
    try{
        const user= await User.findById(req.user.id)
        res.cookie('test','',{
            expires: new Date(0)
        })
        return res.status(200).json({
            success:true,
            message:'Logged Out Successfully!',
            user:user.name
        })
    }
    catch(error){ 
        return res.status(404).json({
            success:false,
            message:'No User exist,First login!',
            error:error.message
        })
    }
}
const forgotPassword= async (req,res)=>{
    try{
        if(!email){
            return res.status(400).json({
                message:"Email is Required!",
                status:false
            })
        }
        const {email}=req.body
        const user= await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"Invalid Email",
                status:false
            })
        }
        const resetPasswordToken = crypto.randomBytes(16).toString("hex");
        user.resetPasswordToken=resetPasswordToken
        user.resetPasswordExpires=Date.now() + 10*60*1000
        await user.save()

         // Setup mail transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_TRAP_HOST,
            port: 2525,
            secure: false,
            auth: {
                user: process.env.MAIL_TRAP_USERNAME,
                pass: process.env.MAIL_TRAP_PASSWORD,
            },
        });
        // Email options
        const mailOptions = {
            from: process.env.MAIL_TRAP_SENDEREMAIL,
            to: email,
            subject: "Reset Your Password, Link will be Valid for Next 10 minutes",
            text: `Click to verify:${process.env.BASE_URL}/api/v1/users/resetpassword/${resetPasswordToken}`,
        };

        // Send email (safe)
        try{
            await transporter.sendMail(mailOptions);
        } 
        catch(emailError){
            console.log("Email failed:", emailError.message);
        }

        return res.status(200).json({
            message:'Check Your Email To reset Password',
            status :true
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Internal Server Error",
            status:false
        })
    }
}
const resetPassword= async (req,res)=>{
    try{
        const {token}= req.params
        const newPassword=req.body.password
        const user=await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpires:{$gt:Date.now()}
        })
        if(!user){
            return res.status(400).json({
                message:"Invalid Token or TimeOut",
                status:false
            })
        }
        user.password=newPassword
        user.resetPasswordToken=undefined
        user.resetPasswordExpires=undefined

        await user.save()

        return res.status(201).json({
            message:"Password Updated",
            status:true
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Internal Server Error",
            status:false
        })
    }
}
export {registeredUser, verifyUser, loginUser, getMe, logoutUser, forgotPassword, resetPassword}