const express = require("express")
const router = express.Router()
const { isLoggedIn } = require("../Middlewares/isLoggedIn")
const { isAuthor } = require("../Middlewares/isAuthor")
const{Comment} = require("../Models/Comment")
const{Post} = require("../Models/Post")



router.post("/comments/:id", isLoggedIn, async(req, res) => {
    try {
        const{ id } = req.params
        const{ text } = req.body

        const foundPost = await Post.findById(id)
        if(!foundPost)
        {
            throw new Error("Post Not Found / Post Does Not Exist")
        }
        const newComment = await Comment.create({text, author : req.user._id})

        await newComment.populate("author", "username profilePicture");
        
     
        foundPost.comment.push(newComment)
        await foundPost.save()
        res.status(201).json({msg : "done" , data : foundPost})
      
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})


router.delete("/comment/:commentId/:postId", isLoggedIn, async(req, res) => {
    try {
        const { commentId, postId } = req.params
        const foundComment = await Comment.findById(commentId)
        const foundPost = await Post.findById(postId)

        let isEligibleToDelete = foundComment.author.toString() == req.user._id.toString()
        || foundPost.author.toString() == req.user._id.toString()

        if(!isEligibleToDelete)
        {
            throw new Error("Access Denied")
        }

        const filteredComments = foundPost.comment.filter((item) => {
            return item.toString() != commentId
        })

        foundPost.comment = filteredComments
        await foundPost.save()
        await Comment.findByIdAndDelete(commentId)

        res.status(200).json({msg : "done"})

    } catch (error) {
        res.status(400).json({error : error.message})
    }
})



router.patch("/comment/like/:commentId", isLoggedIn, async(req, res) => {
    try {
        const foundComment = await Comment.findById(req.params.commentId)

        if(!foundComment)
        {
            throw new Error("Comment Does not Exist")
        }

        if(foundComment.likes.some(item => item.toString() == req.user._id.toString()))
        {
            throw new Error("Already Liked")
        }

        foundComment.likes.push(req.user._id)
        await foundComment.save()

        res.status(200).json({msg : "done"})

    } catch (error) {
        res.status(400).json({error : error.message})
        
    }
})


router.patch("/comment/unlike/:commentId", isLoggedIn, async(req, res) => {
    try {
        const foundComment = await Comment.findById(req.params.commentId)

        if(!foundComment)
        {
            throw new Error("Comment Does not Exist")
        }

        const filteredLikes = foundComment.likes.filter((item) => {
            return item.toString() != req.user._id.toString()
        })

        foundComment.likes = filteredLikes
        await foundComment.save()

        res.status(200).json({msg : "done"})

    } catch (error) {
        res.status(400).json({error : error.message})
    }
})








module.exports = {
    commentRouter : router
}