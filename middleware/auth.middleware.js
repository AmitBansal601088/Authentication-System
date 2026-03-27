import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const isLoggedIn= async(req,res,next)=>{
    //token leke aao req se
    // check kro token hai ya nhi
    //token mein se data nikal lo
    try{
        let token=req.cookies?.test
        if(!token){
            console.log("No Token")
            return res.status(401).json({
                success:false,
                message:"User is Not Loggedin!"
            })
        }
        const decodedToken=jwt.verify(token,process.env.SECRETKEY)   // data of user
        
        //making new key in req object
        req.user=decodedToken
        next()
    }
    catch(e){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
export {isLoggedIn}