const jwt=require('jsonwebtoken');
const User=require('/Users/abhinavkrishna/Skroll-Backend/models/User');
require('dotenv').config();

module.exports=async function(req, res, next){
    const authHeader=req.headers.authorization||'';
    const token=authHeader.startsWith('Bearer ') ? authHeader.slice(7):null;
    if(!token) return res.status(401).json({message:"No token"});
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.id).select('-passwordHash');
        if (!user) return res.status(401).json({ message: 'Invalid token user' });
        req.user = user;
        next();
    }
    catch (err){
        console.error(err);
    res.status(401).json({ message: 'Token invalid or expired' });
    }
};