const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minlength : 2,
        maxlength : 15,
        trim : true,
    },
    lastName : {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 15,
        trim : true
    },
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        maxlength : 20,
        immutable : true
    },
    mail : {
        type : String,
        validate : (val) => {
            const isEmail = validator.isEmail(val)
            if(!isEmail)
            {
                throw new Error("Invalid Email")
            }
        },
        required : true,
        unique : true,
        trim : true,
        immutable : true

    },
    password : {
        type : String,
        required : true
    },
    dateOfBirth : {
        type : String,
        required: true,
        trim : true,
        validate : (val) => {
            const isDateValid = validator.isDate(val)
            if(!isDateValid)
            {
                throw new Error("Invalid Date, use YYYY/MM/DD or YYYY-MM-DD")
            }
        },
        immutable : true
        
    },
    post : [{type : mongoose.Schema.Types.ObjectId, ref : "post"}],
    followers : [{type : mongoose.Schema.Types.ObjectId, ref : "user"}],
    following : [{type : mongoose.Schema.Types.ObjectId, ref : "user"}],
    bio : {
        type : String,
        maxlength : 100,
        trim : true
    },
    profilePicture : {
        type : String
    }
}, { timestamps : true} )



const User = mongoose.model("user", userSchema)

module.exports = {
    User
}