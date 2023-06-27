const mongoose = require("mongoose");
require("dotenv").config();
const dbConnect = () =>{
    try{

        mongoose.connect(process.env.DATABASE_URL , {
            useNewUrlParser:true,
            useUnifiedTopology:true
        }).then(()=>{
            console.log("connection successfull")
        }).catch((error)=>{
            console.log(error);
            console.log("couldnot connect to db")
        })



    }catch(error){
        console.log(error);
        console.log("couldn't connect to database");
    }
}

module.exports = dbConnect;