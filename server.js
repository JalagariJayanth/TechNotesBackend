require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser")
const cors = require("cors");
const corsOptions = require("./config/corsOptions")

const connectDB = require("./config/dbConnection")
const mongoose = require("mongoose")

const PORT = process.env.PORT || 8001;
const rootRouter = require('./routes/root')
const userRouter = require("./routes/userRoutes")
const noteRouter = require("./routes/noteRouter")
const authRouter = require("./routes/authRoutes")

const {logger,logEvents} = require("./middleware/logger")
const errorHandler = require("./middleware/errorHandler")
const verifyJWT = require("./middleware/verifyJWT")

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())

app.use("/",express.static(path.join(__dirname,"/public")))

app.use("/",rootRouter)
app.use("/auth",authRouter)
app.use("/users",verifyJWT,userRouter)
app.use("/notes",verifyJWT,noteRouter)


app.use(errorHandler)



// app.listen(PORT,() =>{
//     console.log(`Server started at ${PORT}`)
// }) 

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
