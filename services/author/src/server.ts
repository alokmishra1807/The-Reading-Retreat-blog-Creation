import express from "express";
import dotenv from 'dotenv';
import { sql } from "./utils/db.js";
dotenv.config();
import blogRoutes from './routes/blog.js'
import { v2 as cloudinary } from 'cloudinary';
import { connectRabbit } from "./utils/rabbitmq.js";

import cors from 'cors'





cloudinary.config({ 
  cloud_name: process.env.cloudinary_name, 
  api_key: process.env.cloud_Api_key, 
  api_secret: process.env.cloud_Api_Sec 
});

const app = express();

connectRabbit();

app.use(express.json());
app.use(cors());
const port = process.env.PORT || 4000;


async function initDB(){
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS blogs(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
             image VARCHAR(255) NOT NULL,
             blogcontent TEXT NOT NULL,
              category VARCHAR(255) NOT NULL,
               author VARCHAR(255) NOT NULL,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
           await sql`
        CREATE TABLE IF NOT EXISTS comments(
            id SERIAL PRIMARY KEY,
           
            comment VARCHAR(255) NOT NULL,
             userid VARCHAR(255) NOT NULL,
            
              username VARCHAR(255) NOT NULL,
              blogid VARCHAR(255) NOT NULL,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
           await sql`
        CREATE TABLE IF NOT EXISTS savedblogs(
            id SERIAL PRIMARY KEY,
           
            
              userid VARCHAR(255) NOT NULL,
               blogid VARCHAR(255) NOT NULL,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
        console.log("database intialized successfully");
    } catch (error) {
        console.log("Error initDB",error);
    }
}

app.use("/api/v1",blogRoutes);

initDB().then(()=>{
app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})

})

