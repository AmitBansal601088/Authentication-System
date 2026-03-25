import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import db from "./util/db.js"

//import all routes
import userRoutes from './Router/user.route.js'
dotenv.config()   // agar alag folder mein hai env file toh uska path dena pdega,agar root folder mein hai toh no need


const app = express()
app.use(cors({
    origin:process.env.BASE_URL,
    credentials:true,
    methods:['GET','POST','DELETE','OPTIONS'],
    allowedHeaders:['Content-Type','Authorization']
}))
app.use(express.json())  // such that express server start accepting json format data from client
app.use(express.urlencoded({extended:true}))
const port = process.env.PORT || 3000 

app.get('/', (req, res) => {    //    request / pe jaa rhi
  res.send('Cohort!')
})
app.get('/amit', (req, res) => {    //    request /amit pe jaa rhi
  res.send('Amit is a boy!')
})
app.get('/sebi',(req,res)=>{     //    request /sebi pe jaa rhi
    res.send('RBI officer one day')
})


//connecting to DB
db()

app.use('/api/v1/users/',userRoutes)
// console.log(process.env.PORT)
app.listen(port, () => {   // app is express server, app ek server hai jo requests sunta hai aur response deta hai
  console.log(`Example app listening on port ${port}`)
})
 