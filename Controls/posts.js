import PostModel from "../models/Posts.js";
import User from "../models/User.js";

//   CREATE a post

export const createPost=async(req,res)=>{
    try {
        const {userId , description, picturePath }=req.body;
        const user= await User.findById(userId);
        const newPost=new PostModel({
            userId,
            firstName:user.firstName,
            lastName:user.lastName,
            location:user.location,
            description,
            userPicturePath:user.picturePath,
            likes:{},
            comments:[],
            picturePath
        });
        await newPost.save();

        //fetching all the posts not single post
        const post=await PostModel.find();

        res.status(201).json(post)

    } catch (error) {
        res.status(409).json({message:error.message})
    }
}

//    GETTING ALL POTS OF ALL USERS

export const getFeeds=async(req,res)=>{
  try {
    
    const post=await PostModel.find();
     res.status(201).json(post);

  } catch (error) {
    res.status(409).json({message:error.message})
    
  }
}

export const getuserFeeds=async(req,res)=>{

    try {

        const {userId}=req.params;
        const post=await PostModel.find({userId});
        res.status(201).json(post);


    } catch (error) {

       res.status(409).json({message:error.message})
        
    }
}
export const likedFeeds=async(req,res)=>{
    
    try {
        
       const { id }=req.params;
       const {userId}=req.body;
       const post=await PostModel.findById(id);
       const isLiked= post.likes.get(userId);
       if(isLiked){
        post.likes.delete(userId)
       }
       else{
        post.likes.set(userId,true)
       }
       const updatedPost=await PostModel.findByIdAndUpdate(
        id,
        {likes:post.likes},
        {new:true}
       );
       res.status(200).json(updatedPost)

    } catch (error) {
        console.log(error);
    res.status(409).json({message:error.message})
        
    }
}