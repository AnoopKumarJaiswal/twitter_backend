const mongoose = require("mongoose")


const replySchema = new mongoose.Schema({
    text : {
        type : String,
        trim : true,
        required : true,
        maxlength : 50
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    }
})


const Reply = mongoose.model("reply", replySchema)

module.exports = {
    Reply
}