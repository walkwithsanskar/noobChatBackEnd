const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({

    sender : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    } , 
    receiver : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    } ,
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }]
} , {timestamps:true});

module.exports = mongoose.model("Chat" , chatSchema);