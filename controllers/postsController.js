const Post=require('/Users/abhinavkrishna/Skroll-Backend/models/Post')
const User=require('/Users/abhinavkrishna/Skroll-Backend/models/User')
const path=require('path');

exports.createPost=async (req, res)=>{
    try{
        if(!req.file) return res.status(400).json({message:"No media Uploaded <3"});
        const mediaUrl=path.join(req.file.destination, req.file.filename);
        const post=await Post.create({
            author:req.user._id,
            caption:req.body.caption ||'',
            mediaUrl,
            mediaType:req.body.mediaType ||'image'
        });
        res.json(post);
    }
    catch (err){
        console.error(err);
        res.status(500).json({message:"Server error Uh Oh!!"});
    }
};

exports.getPost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate('author', 'username displayName avatarUrl');
      if (!post) return res.status(404).json({ message: 'Not found' });
      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

exports.getFeed= async(req,res)=>{
    try{
        const page= Math.max(1, parseInt(req.query.page || '1'));
        const limit=Math.min(50, parseInt(req.query.limit||'10'));
        const skip = (page-1)*limit;

        const user=await User.findById(req.user._id).select('following');
        const followIds= user.following ||[];
        followIds.push(req.user._id);

        const posts=await Post.find({author:{$in:followIds}})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .populate('author', 'username displayName avatarUrl')
        .lean();

        const total=await Post.countDocuments({author:{$in:followIds}});
        res.json({page, limit, total, posts});
    }
    catch (err){
        console.error(err);
        res.status(500).json({message:"Server error I guess OOpss!!!"});
    }
};

exports.toggleLike=async(req,res) =>{
    try{
        const post=await Post.findById(req.params.id);
        if(!post) return res.status(404).json({message:"Not Found"});
        const userId=req.user._id;
        const idx=post.likes.findIndex(id=>id.equals(userId));
        if (idx===-1){
            post.likes.push(userId);
        }
        else{
            post.likes.splice(idx,1);
        }
        await post.save();
        res.json({likesCount:post.likes.length, liked:idx===-1});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
};

exports.addComment=async (req,res)=>{
    try{
        const{text}=req.body;
        if(!text) return res.status(400).json({message:"Empty Comment"});
        const post=await Post.findById(req.params.id);
        if(!post) return res.status(404).json({message:"Not Found"});
        post.comments.push({user:req.user._id, text});
        await post.save();
        res.json({commentsCount:post.comments.length, comment:post.comments[post.comments.length-1]});
    }
    catch (err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
};
