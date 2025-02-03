import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./user/user.routes.js"

const app = express()
// sirf kon kon se path ko access kar ske
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
// json file kitne size ki hum le ske
app.use(express.json({
    limit:"16kb"
}))
// url m jo space ke ley % aata hai uhsko smjne ke ley
app.use(express.urlencoded())
// images public folder m save karwane ke ley
app.use(express.static("public"))
// user ke browser se cookies access kar ske 
app.use(cookieParser());

//routes
//app.get hum tab krte hai jab humne jab route and controller sath m likhte hai
// jab hum alg alg define krte hai to middleware use krna pdta hai 
app.use("/api/v1/users", userRouter)
//http://localhost:5001/api/v1/users/register

export {app}