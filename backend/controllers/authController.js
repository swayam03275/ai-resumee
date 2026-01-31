const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//genrate jwt token
const genrateToken=(userId) => {
    return jwt.sign({id:userId} , process.env.JWT_SECRET, {expiresIn: "7d"});
}

//@desc resgister a new user
//@route POST /api/auth/register
//@access Public
const registerUser = async (req,res,next) => {
    try {
        const {name,email,password,profileImageUrl}=req.body;

        //check if user alredy exists
        const userExists = await User.findOne({email});
        if (userExists){
            return res.status(400).json({message:"user already exist"});
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //create new user
        const user=await User.create({
            name,
            email,
            password:hashedPassword,
            profileImageUrl,
        });

        if (user){
        const token = genrateToken(user?._id)

        res.cookie("token",token,{
          httpOnly:true,
          maxAge:3 * 24 * 60 * 60 * 1000,
          sameSite: "None",
          secure: true,   
        });
    }

        //return user data with jwt
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            profileImageUrl:user.profileImageUrl,
            token:genrateToken(user._id),
        });
        next()
    } catch (error){
        res.status(500).json({message: "server error",error:error.message})
    }
}

//@desc Login user
//@route POST /api/auth/login
//@access Public
const loginUser = async (req,res) => {
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email});
        if (!user){
            return res.status(500).json({message:"Invalid email or passoword"});
        }

        //compare passoword
        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) {
            return res.status(500).json({message:"Invalid email or password"});
        }

        const token = genrateToken(user?._id);
    res.cookie("token",token,{
      httpOnly:true,
      maxAge:3 * 24 * 60 * 60 * 1000,
        sameSite: "None",
          secure: true,  
    })

        //Return user data with jwt
        res.json({
            _id: user._id,
            name :user.name,
            email: user.email,
            profileImageUrl:user.profileImageUrl,
            token:genrateToken(user._id),
        })
    } catch (error){
        res.status(500).json({message: "server error",error:error.message})
    }
}

//@desc Get user profile
//@route GET /api/auth/profile
// @access Private (Requires Jwt)

const getUserProfile = async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password");
        if (!user){
            return res.status(404).json({message : "user not found"})
        }
        res.json(user);
    } catch (error){
        res.status(500).json({message: "server error",error:error.message})
    }
}

module.exports={registerUser,loginUser,getUserProfile}