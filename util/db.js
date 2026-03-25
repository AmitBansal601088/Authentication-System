import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()


const db=()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log('Connected to MongodB')
    })
    .catch((err)=>{
        console.log(`Error Connecting to DB ${err}`);
        
    })
}
export default db
