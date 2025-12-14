const isAuthor = (req, res, next) => {
    try {
        const{id} = req.params
        const flag = req.user.post.some((item) => {
            return item._id.toString() == id
        })
        if(flag)
        {
            next()
        }
        else
        {
            throw new Error("Access Denied / Invalid Operation")
        }
    } catch (error) {
        res.status(400).json({error : error.message})
    }
}


module.exports = {
    isAuthor
}