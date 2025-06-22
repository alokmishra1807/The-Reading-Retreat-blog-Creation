
import User from "../model/user.js";
import jwt from 'jsonwebtoken'
import { TryCatch } from "../utils/TryCatch.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import getBuffer from "../utils/dataUri.js";

import { v2 as cloudinary } from 'cloudinary';
import { oauth2client } from "../utils/googleconfig.js";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";


export const loginUser =TryCatch(async(req,res)=>{
try {
const {code} = req.body;

if(!code){
  res.status(400).json({
    message:"authentication code is required"
  });
  return;
}

const googleRes = await oauth2client.getToken(code)

oauth2client.setCredentials(googleRes.tokens)

const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)

    const {email,name,picture} = userRes.data;

    let user = await User.findOne({email});

    if(!user){
        user  = await User.create({
            name,
            email,
            image:picture,
        })
    }

    const token = jwt.sign({user},process.env.JWT_SEC as string,{
        expiresIn:"5d"
    });
        res.status(200).json({
            message:"Login Successful",
            token,
            user
        });
    
} catch (error:any) {
    res.status(500).json({
        message:error.message,
    })
    
}
})

    



export const myProfile = TryCatch(async(req:AuthenticatedRequest,res)=>{
const user = req.user;
res.json(user);
})


export const getUserProfile = TryCatch(async(req,res)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        res.status(404).json({
            message:"No user with this id"
        })
    }
    res.json(user);
})

export const updateUser = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const {name,instagram,linkedin,bio} = req.body;

    const user = await User.findByIdAndUpdate(req.user?._id,{
        name,instagram,linkedin,bio
    },{
        new:true
    })

      const token = jwt.sign({user},process.env.JWT_SEC as string,{
        expiresIn:"5d"
    });
        res.status(200).json({
            message:"Profile Updated Successfully",
            token,
            user
        });
})



export const updateProfilePic = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const file = req.file;

    if (!file) {
      res.status(400).json({
        message: "No file to upload 1",
      });
      return;
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      res.status(400).json({
        message: "Failed to generate buffer",
      });
      return;
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
      folder: "blogs",
    });

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        image: cloud.secure_url,
      },
      { new: true }
    );

    const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
      expiresIn: "5d",
    });

    res.json({
      message: "User Profile pic updated",
      token,
      user,
    });
  }
);

// export const updateProfilePic = TryCatch(async (req, res) => {
//   console.log("Got file:", req.file);
//   res.json({
//     message: "Received file",
//     fileInfo: req.file,
//   });
// });

