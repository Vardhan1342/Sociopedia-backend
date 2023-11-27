import bcrypt  from "bcrypt";
import  jwt  from "jsonwebtoken";
import User from "../models/User.js"



// Register 


export const register=async (req,res)=>{
    try{
   
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        }=req.body;


        const salt=await bcrypt.genSalt();
        const hashPass=await bcrypt.hash(password,salt);
        const newUser=new User({
            firstName,
            lastName,
            email,
            password:hashPass,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile:Math.floor(Math.random()*10000),
            impressions:Math.floor(Math.random()*10000)
        });
        const savedUser=await newUser.save();
        console.log(savedUser)
        res.status(201).json(savedUser)


    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}



/////// LOGIN    
  

export const login=async(req,res)=>{
    try {
        
       const {email,password}=req.body;

       const user=await User.findOne({email});
       if(!user){
        return res.status(400).json({msg:"invalid Credintials"})
       }

       const pass=await bcrypt.compare(password,user.password);

       if(!pass){
        return res.status(400).json({msg:"invalid Credintials"})
       }

       const token=jwt.sign({id:user._id},process.env.SECRET)
       delete user.password;
       res.status(200).json({token,user})

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}