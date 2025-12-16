const express = require("express")
const { isLoggedIn } = require("../Middlewares/isLoggedIn")
const { User } = require("../Models/User")
const { Chat } = require("../Models/Chat")
const router = express.Router()



router.get("/chat/:id" , isLoggedIn , async(req, res) =>{
    try {
         const {id} = req.params
         const foundUser = await User.findById(id).select("firstName lastName username profilePicture ")

         const foundMsgs = await Chat.find({
            $or : [
                {fromUserId : req.user._id , toUserId : id} , {fromUserId : id, toUserId : req.user._id}
            ]
         })
         
         

         res.status(200).json({msg : "done" , data : foundUser, prevMsgs : foundMsgs})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})




module.exports = {
    chatRouter : router
}