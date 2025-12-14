const mongoose = require("mongoose")


const postSchema = new mongoose.Schema({
    author : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "user"
    },
    caption : {
        type : String,
        trim : true,
        maxlength : 200
    },
    img : {
        type : String,
        trim : true
    },
    likes : [{type : mongoose.Schema.Types.ObjectId, ref : "user"}],
    // likes : [],
    comment : [{type : mongoose.Schema.Types.ObjectId, ref : "comment"}]
}, { timestamps : true })


const Post = mongoose.model("post", postSchema)
module.exports = {
    Post
}