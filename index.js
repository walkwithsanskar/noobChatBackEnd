const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const chatRoutes=require("./routes/chat");
const dbConnect = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
//establishing connections

dbConnect();
// middlewares

app.use(express.json());
app.use(cookieParser())

app.use(
	cors({
		origin:["https://noobchatfrontend.onrender.com"],
		credentials:true,
	})
);
//mounting routes

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/chat", chatRoutes);





//running the server
const server = app.listen(process.env.PORT , ()=>{
    console.log("app is up and running ")
})

const io = require('socket.io')(server,{
  
    cors:{
        origin:["https://noobchatfrontend.onrender.com"],
	     methods: ["GET", "POST"]
    }
});

io.on("connection",(socket)=>{

        
        
        let Id;
        socket.on("join-chat" , (chatId)=>{
            Id=chatId
            socket.join(chatId);
         
        })


        socket.on("send-message" , (message , chatId)=>{
            
            // socket.in(chatId).emit('receive-message', message);
            socket.broadcast.to(chatId).emit('receive-message', message)

        })

        socket.on("disconnect", ()=>{
            console.log("user disconnected")
        })

})

