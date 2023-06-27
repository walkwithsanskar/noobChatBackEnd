const mongoose = require("mongoose");
const sendMail = require("../utils/nodemailer")
const otpTemplate = require("../mail/tmeplates/emailverification")
const otpSchema = new mongoose.Schema({

    otp:{
        type:String,
        required:true
    } , 

    email:{
        type:String,
        required:true
    } ,
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 10*60
    }
})

async function sendverificationEmail(email , otp){


try{

    const response = await sendMail(email , "verify Email for Noob Chat " , otpTemplate(otp));
    console.log("email sent successfully" , response)
}catch(error){
    console.log(error);
    console.log("could not send email")
}

}

otpSchema.pre("save" , async function(next){

    if(this.isNew){
        await sendverificationEmail(this.email , this.otp)
    }
    next();
})



module.exports = mongoose.model("Otp", otpSchema) ; 