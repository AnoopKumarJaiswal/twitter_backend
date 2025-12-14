const mongoose = require("mongoose")
const validator = require("validator")

const verifiedMailSchema = new mongoose.Schema({
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
    }
}, { timestamps : true })

const VerfiedMail =  mongoose.model("VerifiedMail", verifiedMailSchema)

module.exports = {
    VerfiedMail
}