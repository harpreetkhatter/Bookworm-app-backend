import express from "express";
import "dotenv/config";
import authRoutes from "./authRoutes.js";
import Book from "../models/Book.js";
import cloudinary from "../lib/cloudinary.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/",protectRoute, async (req, res) => {
  try {
    
    const {title,caption,rating,image}=req.body;

    if(!title || !caption || !rating || !image){
      return res.status(400).json({message:"All fields are required"})
    }
    //upload the image
    //save to db
    const uploadResponse=await cloudinary.uploader.upload(image)
    const imageUrl=uploadResponse.secure_url;

    const newBook=new Book({
      title,caption,rating,image:imageUrl,user:req.user._id
    })
    await newBook.save();
    res.status(201).json(newBook)

  } catch (error) {
    console.log("Error in creating book", error)
    res.status(500).json({message:"Internal server error"})
  }
});

export default router;
