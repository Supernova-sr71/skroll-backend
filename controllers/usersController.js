const User=require('models/User');
const Post=require('models/Post');

exports.getProfile= async (req, res)=>{
    try{
        const user=await User.findById(req.params.id).select('-passwordHash').lean();
        if(!user) return res.status(404).json({message:"Not Found"});
        const posts=await Post.find({author:user._id}).sort({createdAt:-1}).limit(20).lean();
        res.json({user, posts});
    }
    catch (err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
};

exports.followToggle = async (req, res) => {
    try {
      const targetId = req.params.id;
      if (req.user._id.equals(targetId)) return res.status(400).json({ message: 'Cannot follow yourself' });
      const target = await User.findById(targetId);
      if (!target) return res.status(404).json({ message: 'User not found' });
  
      const me = await User.findById(req.user._id);
  
      const already = me.following.findIndex(id => id.equals(target._id));
      if (already === -1) {
        me.following.push(target._id);
        target.followers.push(me._id);
        await me.save();
        await target.save();
        return res.json({ followed: true });
      } else {
        me.following.splice(already, 1);
        const idx2 = target.followers.findIndex(id => id.equals(me._id));
        if (idx2 !== -1) target.followers.splice(idx2, 1);
        await me.save();
        await target.save();
        return res.json({ followed: false });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };