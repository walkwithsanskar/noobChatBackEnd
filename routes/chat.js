const express = require("express");
const router = express.Router();

const {auth} = require("../middlewares/auth");
const {createChat , getChat , deleteChat , getUsersByEmail} = require("../controllers/chat");
const {createMessage} = require("../controllers/message");


router.post("/createChat",auth,createChat);
router.post("/getChat/:id",auth,getChat);
router.delete("/deleteChat/:chatId",auth,deleteChat);
router.post("/createMessage",auth,createMessage);
router.post("/getUsersByEmail/:email", auth,getUsersByEmail )



module.exports=router;