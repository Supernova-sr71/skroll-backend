const mongoose=require('mongoose');

async function connectDB(mongo_url) {
    try{
        await mongoose.connect(mongo_url,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log("database connected successfully");
    }
    catch (err){
        console.log("Mongodb db failed to connect",err);
        process.exit(1);
    }
}

module.exports=connectDB;