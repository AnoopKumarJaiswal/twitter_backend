const express = require("express")
const { isLoggedIn } = require("../Middlewares/isLoggedIn")
const { User } = require("../Models/User")
const router = express.Router()



router.get("/chat/:id" , isLoggedIn , async(req, res) =>{
    try {
         const {id} = req.params
         const foundUser = await User.findById(id).select("firstName lastName username profilePicture ")

         res.status(200).json({msg : "done" , data : foundUser})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})




module.exports = {
    chatRouter : router
}