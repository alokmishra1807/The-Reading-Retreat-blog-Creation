import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './utils/db.js';
import userRoutes from './routes/user.js'
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';

dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.cloudinary_name, 
  api_key: process.env.cloud_Api_key, 
  api_secret: process.env.cloud_Api_Sec 
});

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/v1",userRoutes);

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})