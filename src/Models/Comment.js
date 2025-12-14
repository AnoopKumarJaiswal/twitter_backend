const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    author : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "user"
    },
    text : {
        type : String,
        trim : true,
        maxlength : 200,
        required : true
    },
    likes : [{type : mongoose.Schema.Types.ObjectId, ref : "user"}],
    replies : [{type : mongoose.Schema.Types.ObjectId, ref : "reply"}]
})


const Comment = mongoose.model("comment", commentSchema)

module.exports = {
    Comment
}