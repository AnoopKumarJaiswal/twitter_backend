require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const { otpRouter } = require("./Routes/OtpRouter")
const { authRouter } = require("./Routes/AuthRouter")
const { profileRouter } = require("./Routes/ProfileRouter")
const { postRouter } = require("./Routes/PostRouter")
const cp = require("cookie-parser")
const { commentRouter } = require("./Routes/Comment")
const { replyRouter } = require("./Routes/ReplyRouter")
const cors = require("cors")
const fn = require("socket.io")
const http = require("http")
const { chatRouter } = require("./Routes/Chat")


const Server = http.createServer(app)
const io = fn(Server , {
    cors : {
        origin : "*"
    }
})


io.on("connection", (socket) =>{
    socket.on("join-room" , ({senderId, recieverId}) =>{
      const roomId = [senderId , recieverId].sort().join("")
      socket.join(roomId)
      
      socket.on("send-msg", ({text, fromUserId , toUserId}) =>{
        io.to(roomId).emit("recieve-msg" , {text, fromUserId, toUserId})
      })
    })
    
    
})


mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("DB Connected")

    Server.listen(process.env.PORT, () => {
        console.log("Server running on port " + process.env.PORT)
    })
})
.catch((error) => {
    console.log("DB Connection Failed")
})


app.use(cors({
    credentials : true,
    origin : ["http://localhost:5173", "https://twitter-frontend-ru7a.onrender.com"]
}))
app.use(express.json())
app.use(cp())
app.use("/api", otpRouter)
app.use("/api", authRouter)
app.use("/api", profileRouter)
app.use("/api", postRouter)
app.use("/api", commentRouter)
app.use("/api", replyRouter)
app.use("/api", chatRouter)


