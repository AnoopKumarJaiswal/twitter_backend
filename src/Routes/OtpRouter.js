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
            html : `
            <div style="font-family: Arial, sans-serif; padding: 40px 0; text-align: center;">
                <div style="font-size: 22px; font-weight: 600; margin-bottom: 20px; color: #0f1419;">
                    Your Verification Code
                </div>

                <div style="font-size: 40px; letter-spacing: 8px; font-weight: bold; color: #1d9bf0; margin: 30px 0;">
                    ${otp}
                </div>

                <div style="font-size: 14px; color: #536471; max-width: 420px; margin: 0 auto; line-height: 22px;">
                    Enter this code in the app to verify your email address.
                    <br /><br />
                    This code will expire in 2 minutes.
                </div>

                <div style="margin-top: 40px; font-size: 12px; color: #a4a4a4;">
                    If you didn’t request this, you can safely ignore this email.
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