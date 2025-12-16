const jwt = require("jsonwebtoken")
const{ User } = require("../Models/User")
const { populate } = require("dotenv")

const isLoggedIn = async(req, res, next) => {
    try {
        const{ loginToken } = req.cookies
        if(!loginToken)
        {
            throw new Error("Please Login first!")
        }
        const originalObject = jwt.verify(loginToken, process.env.JWT_SECRET)        
        const foundUser = await User.findOne({_id : originalObject.id}).populate({
            path : "post",
            populate : [
            {
                path : "author",
                select : 'username firstName lastName profilePicture _id'
            },
            {
                path : 'comment',
                select : "_id author text",
                populate : "author"
            }
        ]
        })
        if(!foundUser)
        {
            throw new Error("Please Log In")
        }

        req.user = foundUser
        next()

    } catch (error) {
        res.status(400).json({error : "Please Log In!", data : null})
    }
}

module.exports = {
    isLoggedIn
}