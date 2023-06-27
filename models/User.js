const mongoose = require("mongoose");

const userSchema =  new mongoose.Schema({

    firstName:{
        type:String,
        required:true
    },
    lastName :{
        type:String,
        required:true
    } ,
    email : {
        type:String,
        required:true
    },
    password : {
        type:String,
        required:true
    } ,
    profilePic : {
        type:String,
        required:true
    }
    , 
    chats : [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    }]

} ,  { timestamps: true }) ; 


module.exports = mongoose.model("User" , userSchema);