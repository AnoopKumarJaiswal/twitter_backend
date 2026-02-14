const express = require("express")
const router = express.Router()
const { isLoggedIn } = require("../Middlewares/isLoggedIn")
const { isAuthor } = require("../Middlewares/isAuthor")
const { Post } = require("../Models/Post")
const { User } = require("../Models/User")
const { Comment } = require("../Models/Comment")
const { Reply } = require("../Models/Replies")


router.post("/posts", isLoggedIn, async(req, res) => {
    try {
        const{caption, img} = req.body

        if(!caption && !img)
        {
            throw new Error("Please provide either caption or image")
        }

        const createdPost = await Post.create({caption, img, author : req.user._id})
        req.user.post.push(createdPost)
        await req.user.save()
        res.status(201).json({msg : "done", data : createdPost})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})

router.get("/posts", isLoggedIn, async(req, res) => {
    try {
        const loggedInUserId = req.user._id

        const foundPosts = await Post.find({author : loggedInUserId}).populate(
        [
            {
                path : "comment",
                populate : {
                    path : "author",
                    select : "firstName lastName username profilePicture text"
                }
            },
            {
                path : "likes",
                select : "firstName lastName username profilePicture"
                // populate : {
                //     path : "author",
                //     select : "firstName lastName username profilePicture"
                // }
            },
        ]
    )

        
        res.status(200).json({msg : "done", data : foundPosts})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})

router.get("/posts/:id", isLoggedIn, isAuthor, async(req, res) => {
    try {
        const foundPost = await Post.findById(req.params.id)
        res.status(200).json({msg : "done", data : foundPost})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})

router.delete("/posts/:id", isLoggedIn, isAuthor, async(req, res) => {
    try {
        const{ id } = req.params
        const foundPost = await Post.findById(id)
        if(!foundPost)
        {
            throw new Error("Post Not Found")
        }

        for(let item of foundPost.comment)
        {
            const foundComment = await Comment.findById(item)

            for(let i of foundComment.replies)
            {
                await Reply.findByIdAndDelete(i)
            }

            await Comment.findByIdAndDelete(item)

        }
        await Post.findByIdAndDelete(id)

        res.status(200).json({msg : "done"})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})


router.patch("/posts/:id", isLoggedIn, isAuthor, async(req, res) => {
    try {
        const{ caption } = req.body
        const{ id } = req.params
        const updatedPost = await Post.findByIdAndUpdate(id, {caption}, {new : true})
        res.status(200).json({msg : "done", data : updatedPost})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})


router.patch("/posts/like/:id", isLoggedIn, async(req, res) => {
    try {
        const{ id } = req.params
        // console.log(id)
        const UserData = await User.findById(req.user._id)
        const postToBeLiked = await Post.findById(id)
        // console.log(postToBeLiked)

        if(!postToBeLiked)
        {
            throw new Error("Post does not exist / not found")
        }

        const flag = postToBeLiked.likes.some((item) => {
            return item.toString() == req.user._id.toString()
        })

        if(flag)
        {
            throw new Error("Already Liked")
        }

        postToBeLiked.likes.push(UserData._id)
        await postToBeLiked.save()
        res.status(200).json({msg : "done", data : postToBeLiked})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})
 


router.patch("/posts/unlike/:id", isLoggedIn, async(req, res) => {
    try {
        const { id } = req.params
        const foundPost = await Post.findById(id)
        if(!foundPost)
        {
            throw new Error("Post Not Found / Post Does Not Exist")
        }

        const filteredArray = foundPost.likes.filter((item) => {
            return item._id.toString() != req.user._id.toString()
        })  

        foundPost.likes = filteredArray
        await foundPost.save()

        res.status(200).json({msg : "done", data : foundPost})
        
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})













module.exports = {
    postRouter : router
}