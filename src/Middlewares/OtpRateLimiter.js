const { rateLimit } = require("express-rate-limit")


const otpLimiter = rateLimit({
    windowMs : 10 * 1000,
    limit : 1
})


module.exports = {
    otpLimiter
}