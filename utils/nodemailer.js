const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (email,subject , body)=>{

    try{

        const transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            secure:true,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })

        let sentEmailInfo = await transporter.sendMail({
            from:"Noob Chat ",
            to:`${email}`,
            subject:`${subject}`,
            html:`${body}`
        })

        console.log(sentEmailInfo);
        return sentEmailInfo;


    }catch(error){
        console.log("couldnt send mail")
    }

}




module.exports = sendMail;