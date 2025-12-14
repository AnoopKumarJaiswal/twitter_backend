const express = require("express")
const router = express.Router()
const{ isLoggedIn } = require("../Middlewares/isLoggedIn")
const{ Comment } = require("../Models/Comment")
const { Reply } = require("../Models/Replies")
const { Post } = require("../Models/Post")

router.post("/reply/:commentId", isLoggedIn, async(req, res) => {
    try {
        const foundComment = await Comment.findById(req.params.commentId)
        const{ text } = req.body

        if(!foundComment)
        {
            throw new Error("Comment Not Found")
        }

        const newReply = await Reply.create({text, author : req.user._id})

        foundComment.replies.push(newReply)
        await foundComment.save()

        res.status(200).json({msg : "done"})


    } catch (error) {
        res.status(400).json({error  : error.message})
        
    }
})


router.delete("/reply/:replyId/:commentId/:postId", isLoggedIn, async(req, res) => {
    try {
        const foundPost = await Post.findById(req.params.postId)
        const foundComment = await Comment.findById(req.params.commentId)
        const foundReply = await Reply.findById(req.params.replyId)

        const isCommentInPost = foundPost.comment.some(item => item.toString() == req.params.commentId)
        const isReplyInComment = foundComment.replies.some(item => item.toString() == req.params.replyId)

        if(isCommentInPost && isReplyInComment)
        {

        }
        else
        {
            throw new Error("Invalid Operation")
        }

        const flag = foundPost.author.toString() == req.user._id.toString() || foundComment.author.toString() == req.user._id.toString() || foundReply.author.toString() == req.user._id.toString()
        if(!flag)
        {
            throw new Error("Access Denied / Invalid Operation")
        }

        await Reply.findByIdAndDelete(req.params.replyId)
        const filteredReplies = foundComment.replies.filter((item) => {
            return item.toString() != req.params.replyId
        })
        foundComment.replies = filteredReplies
        await foundComment.save()

        res.status(200).json({msg : "done"})

    } catch (error) {
        res.status(400).json({error : error.message})
        
    }
})




module.exports = {
    replyRouter : router
}