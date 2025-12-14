const mongoose = require("mongoose")
const validator = require("validator")

const otpSchema = new mongoose.Schema({
    otp : {
        required : true,
        minlength : 6,
        type : String,
        maxlength : 6
    },
    mail : {
        type : String,
        required : true,
        validate : (val) => {
            const isEmail = validator.isEmail(val)
            if(!isEmail)
            {
                throw new Error("Invalid mail")
            }
        }
    },
    createdAt : {
        type : Date,
        default : Date.now,
        expires : 120
    }
})


const OTP = mongoose.model("OTP", otpSchema)

module.exports = {
    OTP
}