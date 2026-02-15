const express = require("express")
const { VerfiedMail } = require("../Models/VerifiedMails")
const router = express.Router()
const nodemailer = require("nodemailer");
const { otpLimiter } = require("../Middlewares/OtpRateLimiter");
const { OTP } = require("../Models/OTP");


const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : "anoopjaiswal1220@gmail.com",
        pass : process.env.APP_PASSWORD
    }
})



router.post("/otp/send-otp", otpLimiter , async(req, res) => {
    try {
        const{mail} = req.body

        const foundMail = await VerfiedMail.findOne({mail})
        if(foundMail)
        {
            throw new Error("Email already verified")
        }

        let otp = String(Math.floor(Math.random() * 1000000)).padEnd(6, "0")
        await OTP.create({mail, otp})

        await transporter.sendMail({
            from : ' "Anoop" anoopjaiswal1220@gmail.com',
            to : mail,
            subject : "OTP",
           html: `
                <div style="font-family: Arial, sans-serif; background:#f0f8ff; padding:60px 0;">

                <div style="
                    max-width:500px;
                    margin:auto;
                    background:white;
                    border-radius:20px;
                    padding:50px;
                    text-align:center;
                    box-shadow:0 20px 60px rgba(0,0,0,0.1);
                ">

                    <div style="
                    font-size:28px;
                    font-weight:bold;
                    color:#1d9bf0;
                    margin-bottom:20px;
                    ">
                    🚀 Secure Social Verification
                    </div>

                    <div style="
                    font-size:18px;
                    color:#444;
                    margin-bottom:30px;
                    ">
                    Your One-Time Password
                    </div>

                    <!-- SUPER GLOW OTP -->
                    <div style="
                    font-size:48px;
                    letter-spacing:14px;
                    font-weight:bold;
                    padding:25px 30px;
                    border-radius:16px;
                    color:white;
                    display:inline-block;
                    background:linear-gradient(135deg,#1d9bf0,#6dd5fa,#1d9bf0);
                    box-shadow:
                        0 0 15px #1d9bf0,
                        0 0 30px #1d9bf0,
                        0 0 60px #1d9bf0,
                        inset 0 0 10px rgba(255,255,255,0.6);
                    ">
                    ${otp}
                    </div>
            
                    <div style="
                    font-size:15px;
                    color:#555;
                    margin-top:35px;
                    line-height:24px;
                    ">
                    Enter this code in the app to verify your email.
                    <br/><br/>
                    ⏳ Expires in <b>5 minutes</b>.
                    </div>

                    <div style="
                    margin-top:40px;
                    font-size:12px;
                    color:#999;
                    ">
                    If you didn’t request this, ignore safely.
                    </div>

                </div>
                </div>
                `

        })

        res.status(201).json({msg : "done"})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})



router.post("/otp/verify-otp", async(req, res) => {
    try {
        const{ otp, mail } = req.body
        const foundOtpObject = await OTP.findOne({
            $and : [
                { otp }, { mail }
            ]
        })

        if(!foundOtpObject)
        {
            throw new Error("Invalid Email / OTP")
        }

        await VerfiedMail.create({mail})
        res.status(201).json({msg : "User verified"})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})






module.exports= {
    otpRouter : router
}