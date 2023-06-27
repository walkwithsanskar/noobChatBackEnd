const express = require("express");
const router = express.Router();


const {logIn, sendOtp , signUp} = require("../controllers/auth")


router.post("/signUp",signUp);
router.post("/logIn",logIn);
router.post("/sendOtp",sendOtp);




module.exports = router 
