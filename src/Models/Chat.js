const mongoose = require("mongoose")


const ChatSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    text : {
        type : String,
        required : true ,
        maxlength : 200
    }
},{timestamps : true})


const Chat = mongoose.model("chat", ChatSchema)

module.exports = {
    Chat
}