import mongoose from "mongoose";
import bcryptjs from "bcryptjs"
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationToken:{
        type:String
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpires:{
        type:Date
    } 
},{
    timestamps:true
})

//Adding Hooks
//Pre Hook
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password= await bcryptjs.hash(this.password,10) 
    }
})


const user= mongoose.model('User',userSchema);
export default user