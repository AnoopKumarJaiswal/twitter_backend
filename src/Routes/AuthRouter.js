const express = require("express")
const { User } = require("../Models/User")
const { VerfiedMail } = require("../Models/VerifiedMails")
const router = express.Router()
const bcrypt = require("bcrypt")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const { isLoggedIn } = require("../Middlewares/isLoggedIn")


router.post("/signup", async(req, res) => {
    try {
        const{firstName, lastName, username, mail, password, dateOfBirth} = req.body

        const foundUser = await User.findOne({
            $or : [
                {username},
                {mail}
            ]
        })
        if(foundUser)
        {
            throw new Error("User already exists, please try changing your username and email")
        }

        const isVerifiedMail = await VerfiedMail.findOne({mail})
        if(!isVerifiedMail)
        {
            // throw new Error("Please verify your mail first.")
            res.status(410).json({"error" : "Please verify your mail first."})
            return
        }

        const isPasswordStrong = validator.isStrongPassword(password)
        if(!isPasswordStrong)
        {
            throw new Error("Please enter a strong password")
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const createdUser = await User.create({firstName, lastName, username, mail, password : hashedPassword, dateOfBirth})
        res.status(201).json({msg : "done"})

    } catch (error) {
        res.status(400).json({error : error.message})
    }
})

router.post("/signin", async(req, res) => {
    try {
        const{ username, password } = req.body
        
        const foundUser = await User.findOne({username}).populate("post")
        if(!foundUser)
        {
            throw new Error("User Does Not Exist")
        }

        const flag = await bcrypt.compare(password, foundUser.password)

        if(!flag)
        {
            throw new Error("Incorrect Password")
        }

        const token = jwt.sign({id : foundUser._id}, process.env.JWT_SECRET)
        const{firstName, lastName, username : un, profilePicture, bio, followers, following, post, dateOfBirth} = foundUser
        res.cookie("loginToken", token, {maxAge : 24 * 60 * 60 * 1000}).status(200).json({msg : "done", data : {firstName, lastName, username : un, profilePicture, bio, followers, following, post, dateOfBirth}})

    } catch (error) {
        res.status(400).json({error : error.message})
    }
})

router.post("/signout", (req, res) => {
    res.cookie("loginToken", null).status(200).json({msg : "done"})
})


router.get("/get-user-data", isLoggedIn, async(req, res) => {
    const{firstName, lastName, username : un, profilePicture, bio, followers, following, post, dateOfBirth, _id} = req.user
    res.status(200).json({data : {_id, firstName, lastName, username : un, profilePicture, bio, followers, following, post, dateOfBirth}})
})



module.exports = {
    authRouter : router
}