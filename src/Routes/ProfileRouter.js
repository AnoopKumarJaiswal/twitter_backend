const express = require("express")
const { isLoggedIn } = require("../Middlewares/isLoggedIn")
const { User } = require("../Models/User")
const { Post } = require("../Models/Post")
const router = express.Router()


router.patch("/profile/edit", isLoggedIn, async(req, res) => {
    try {
        const userId = req.user._id
        const{firstName, lastName, bio, profilePicture} = req.body
        const updatedProfile = await User.findByIdAndUpdate(userId, {firstName, lastName, bio, profilePicture}, {new : true}).select("firstName lastName bio profilePicture dateOfBirth username post followers following")
        res.status(200).json({msg : "done", data : updatedProfile})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})


router.patch("/profile/follow/:id", isLoggedIn, async(req, res) => {
    try {
        const userToBeFollowed = await User.findById(req.params.id)

        if(!userToBeFollowed)
        {
            throw new Error("User Not Found")
        }

        req.user.following.push(userToBeFollowed)
        await req.user.save()

        userToBeFollowed.followers.push(req.user)
        await userToBeFollowed.save()

        res.status(200).json({msg : "done"})
    } catch (error) {
        res.status(400).json({error : error.message})
        
    }
})



router.patch("/profile/unfollow/:id", isLoggedIn, async (req, res) => {
    try {
        const userToBeUnFollowed = await User.findById(req.params.id)

        if(!userToBeUnFollowed)
        {
            throw new Error("User not found")
        }

        const filteredFollowers = userToBeUnFollowed.followers.filter((item) => {
            return item.toString() != req.user._id.toString()
        })

        userToBeUnFollowed.followers = filteredFollowers
        await userToBeUnFollowed.save()

        const filteredFollowing = req.user.following.filter((item) => {
            return item.toString() != req.params.id
        })

        req.user.following = filteredFollowing
        await req.user.save()

        res.status(200).json({msg : "done"})
    } catch (error) {
        res.status(400).json({error : error.message})
        
    }
})

router.get("/profile/search", isLoggedIn, async(req, res) => {
    try {
        const{q} = req.query
        const data = await User.find({
            $and : [
                {username : {$regex : q}},
                {username : {$ne : req.user.username}}
            ]
        })
        .select("firstName lastName username profilePicture _id")
        res.status(200).json({data : data})

    } catch (error) {
        res.status(400).json({error : error.message})
    }
})

router.get("/profile/feed", isLoggedIn, async(req, res) => {
    try {
        let followingUsers = req.user.following
        const{pageNum, postCount} = req.query
        

        const foundPosts = await Post.find({author : {
            $in : followingUsers
        }}).populate("author").sort({createdAt : -1}).limit(postCount).skip(pageNum * postCount - postCount)

        res.status(200).json({count : foundPosts.length, data : foundPosts })
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})



router.get("/profile/:id", isLoggedIn, async(req, res) => {
    try {
        const{id} = req.params
        const foundUser = await User.findById(id).select("firstName lastName bio profilePicture followers following pos username").populate("post")

        if(!foundUser)
        {
            throw new Error("User does not exist")
        }

        res.status(200).json({data : foundUser})

    } catch (error) {
        res.status(404).json({error : error.message})
    }
})




module.exports = {
    profileRouter : router
}