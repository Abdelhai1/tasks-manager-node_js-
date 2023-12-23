const express = require('express')
const cors = require('cors')

const app = express()

// middleware

app.use(express.json())

app.use(express.urlencoded({ extended: true }))


// routers
const authRouter = require("./routes/authRouter.js")
const taskRouter = require("./routes/taskRouter.js")
const router = require('./routes/userRouter.js')
app.use('/api/users', router)
app.use('/api/auth',authRouter)
app.use('/api/tasks',taskRouter)



//port

const PORT = process.env.PORT || 8080

//server

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})