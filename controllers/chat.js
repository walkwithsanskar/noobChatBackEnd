const User=require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

exports.createChat = async(req,res)=>{

        try{

            //fetch request from body
            //check if chat already exists
            //create chat 
            //append chat id in both sender and receiver
            const {sender , receiver} = req.body;
           
           
            const senderInfo = await User.findOne({email:sender});
          
            const receiverInfo = await User.findOne({email:receiver});
            
            const existing = await Chat.findOne({sender:senderInfo._id,receiver:receiverInfo._id}) 
            const existing2 = await Chat.findOne({sender:receiverInfo._id,receiver:senderInfo._id}) 
            
            if(existing || existing2){
                return res.status(400).json({
                    success:false,
                    message:"chat already exists"
                })
            }


            const chat = await Chat.create({sender:senderInfo._id,receiver:receiverInfo._id});
            const newChat = await Chat.findById({_id:chat._id}).populate("sender").populate("receiver").exec()
           
            const senderUpdate = await User.findOneAndUpdate({email:sender},{$push:{chats : chat._id}});
            const receiverUpdate = await User.findOneAndUpdate({email:receiver},{$push:{chats:chat._id}});

         

            res.status(200).json({
                success:true,
                message:"chat created successfully",
                newChat
            })



        }catch(error){
            console.log(error);
            res.status(400).json({
                success:false,
                message:"not able to create chat at them moment"
            })
        }


}

exports.getChat = async(req,res)=>{

    
    try{
        
        // const user = req.user;
        const {id}=req.params;

        const chats = await Chat.findById({_id:id}).populate({
            

                path:"messages",
                populate:
                    [
                        {path:"user"}
                    ]
            

            
        }).populate("sender").populate("receiver").exec();




        res.status(200).json({
            success:true,
            message:"fetched all chats for user",
            chats
        })

    }catch(error){
        console.log(error);
        res.status(400).json({
            success:false,
            message:"could not get chats"
        })
    }



}


exports.deleteChat = async(req,res)=>{

                try{

                    const {chatId} = req.params;
                    

                    const chat = await Chat.findById({_id:chatId});
                    const sender = await User.findOneAndUpdate({_id:chat.sender}, {$pull:{chats:chatId}},{new:true})
                    const receiver = await User.findOneAndUpdate({_id:chat.receiver}, {$pull:{chats:chatId}})
                    const deletedChats = await Chat.findByIdAndDelete({_id:chatId});
                    const deletedMessages = await Message.deleteMany({chat:chatId});

                    res.status(200).json({
                        success:true,
                        message:"chat deleted successfully",
                        
                    })




                }catch(error){
                    console.log(error);
                    res.status(400).json({
                        success:false,
                        message:"could not delete the chat"
                    })
                }
}


exports.getUsersByEmail = async(req,res)=>{

    try{

        const {email} = req.params;
     
        const users =  await User.find({email:{$regex:`^${email}`,$options:'i'}});
        return res.status(200).json({
            success:true,
            message:"users fetched by input search on email basis",
            users:users
            })


    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"couldn't find user "
        })


    }
}