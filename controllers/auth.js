const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Otp = require("../models/otp");
const bcrypt= require("bcrypt");
const otpGenerator = require("otp-generator");
require("dotenv").config();
exports.signUp = async (req,res) =>{

    try{

        const {
            firstName,
            lastName,
            email,
            password,
            otp
        } = req.body;
    
    
        const existing = await User.find({email:email})
        
        if(existing.length!==0){
    
            return res.status(401).json({
                success:false,
                message:"user already exists"
            })
    
        }
        
        const response = await Otp.find({email:email}).sort({expiresAt:-1}).limit(1);
        
    
        if(response.length ==0){
            res.status(400).json({
                success:false,
                message:"The otp is invalid"
            })
        }else if (otp !== response[0].otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }
    
        const hashedPassword = await bcrypt.hash(password,10);
    
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profilePic: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });
    
    
        return res.status(200).json({
            success:true,
            user,
            message:"user created successfully"
        })
    
    




    }catch(error){
        
        res.status(400).json({
            success:false,
            message:"couldnot signup"
        })
    }



}

exports.logIn = async(req,res) =>{



    try{



        const {email,password} = req.body;

    const existing = await User.find({email:email});

    if(!existing){
        return res.status(400).json({
            success:false,
            message:"user doesnot exist"
        })
    }

    const user = await User.findOne({email:email}).populate({
        path:"chats",
        populate:[{
            path:"sender"
        },
        {
            path:"receiver"
        } ,{
            path : "messages",
            
        }           
    ]
    }).exec() ;

    let token;
    if(await bcrypt.compare(password,user.password)){

        const payload = {
            email:user.email,
            firstName:user.firstName,
            id:user._id
        }

         token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"24h"
        })





        const options = {
            expires : new Date(Date.now() + 2*60*60*1000),
            httpOnly:true
        }
    
        return  res.cookie("token",token,options).status(200).json({
            success:true,
            message:"login successful",
            user,
            token
        })
        
    }else{

        return res.status(400).json({
            success:false,
            message:"check your password"
        })
    }
    



    }catch(error){

        res.status(400).json({
            success:false,
            message:"login failed"
        })

    }

    

}

exports.sendOtp = async(req,res) =>{

   try{

    const {email} = req.body;
   
    const existingUser = await User.findOne({email:email});

    
    if(existingUser){

        return res.status(401).json({
                success:false,
                message:"User already exists"
        })
    }

    var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    const result = await Otp.findOne({ otp: otp });
		
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
			result = await Otp.findOne({ otp: otp });
		}
        
        
        console.log(Date.now());
        const createdOtp = await Otp.create({otp:otp,email:email});
   

        res.status(200).json({
            success:true,
            message:"Otp sent successfully",
            createdOtp
        })



   }catch(error){

    console.log(error);
    res.status(400).json({
        success:false,
        message:"couldnot send otp"
    })

   }



}