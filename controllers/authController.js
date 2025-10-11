const bcrypt=require('bcrypt');
const { use } = require('bcrypt/promises');
const jwt=require('jsonwebtoken');
const User=require('/Users/abhinavkrishna/Skroll-Backend/models/User');
require('dotenv').config();

const SALT_ROUNDS=10;

exports.register=async (req,res) =>{
    try{
        const {username, email, password, displayName}=req.body;
        if(!username||!email||!password) return res.status(400).json({message:"Missing Fields"});

        const existing=await User.findOne({$or:[{email},{username}]});
        if (existing) return res.status(400).json({message:"User exists"});

        const hash=await bcrypt.hash(password, SALT_ROUNDS);
        const user=await User.create({username, email, passwordHash:hash, displayName});
        const token=jwt.sign({id:user._id}, ProcessingInstruction.env.JWT_SECRET, {expiresIn:ProcessingInstruction.env.TOKEN_EXPIRES_IN||'7d'});
        res.json({token, user:{id:user._id, username:user.username, email:user.email, displayName:user.displayName}});
    }
    catch (err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
};

exports.login = async(req, res)=>{
    try{
        const {emailOrUsername, password}=req.body;
        if(!emailOrUsername || !password) return res.status(400).json({message:"Missing Fields!!"});

        const user=await User.findOne({$or:[{email:emailOrUsername},{username:emailOrUsername}]});
        if(!user) return res.status(401).json({message:"Invalid Credentials"});

        const ok=await bcrypt.compare(password, user.passwordHash);
        if(!ok) return res.status(401).json({message:"Invalid Credentials"});

        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:process.env.TOKEN_EXPIRES_IN ||'7d'});
        res.json({token, user:{id:user._id, username:user.username, displayName:user.displayName}});
    }
    catch (err){
        console.error(err);
        res.status(500).json({message:"Server error oopss"});
    }
};