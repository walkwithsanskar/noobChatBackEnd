const Message = require("../models/Message");
const Chat = require("../models/Chat")


exports.createMessage = async(req,res)=>{



    try{

        const {chatId , message} = req.body;
        
        const user = req.user;
       
        const createdText = await Message.create({user:user.id , message:message , chat:chatId});
        
        const updatedChat = await Chat.findOneAndUpdate({_id:chatId},{$push:{messages:createdText._id}},{new:true}).populate('messages').exec();

        res.status(200).json({
            success:true,
            message:"message created",
            createdText,
            updatedChat
        })



    }catch(error){
        console.log(error);
        res.status(400).json({
            success:false,
            message:"could not send message"
        })
    }
}