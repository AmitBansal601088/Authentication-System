import User from '../model/User_model.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
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
            host: "sandbox.smtp.mailtrap.io",
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
            message:"Invalid token"
        })
    }else{
        user.isVerified=true
        return res.status(200).json({
            message:"Verified User",
            Username:user.name
        })
    }    

}
  
export {registeredUser,verifyUser}