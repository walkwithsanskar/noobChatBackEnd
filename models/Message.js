const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

            user:{
                type:mongoose.Schema.Types.ObjectId,
                required:true
            } , 
            message:{
                type:String,
                required:true
            },
            chat:{
                type:mongoose.Schema.Types.ObjectId,
                required:true
            }



} , {timestamps:true}) ;

module.exports = mongoose.model("Message" , messageSchema );