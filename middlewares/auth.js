const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.auth=async(req,res,next)=>{

    try{
    
        let token = req.body.token || req.header("Authorization");

      
        if(!token){
            return res.status(501).json({
                success:false,
                message:"access denied"
            })
        }
        if(token.startsWith("Bearer ")){
            token = token.slice(7,token.length).trimLeft();
        }
        const verified = jwt.verify(token,process.env.JWT_SECRET);
    
        req.user = verified;
        next();
        



    }catch(error){
        console.log(error)
        res.status(400).json({
            success:false,
            message:"could not verify user"
        })
    }
}