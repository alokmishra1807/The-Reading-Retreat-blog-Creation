

import mongoose from "mongoose";

export const connectDB = async() =>{
    try {
        mongoose.connect(process.env.MONGO_URI as string,{
            dbName:"Blogs"
        });

        console.log("connected to mongodb");
    } catch (error) {
        console.log(error);
    }
}