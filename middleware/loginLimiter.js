const rateLimit = require("express-rate-limit")
const { logEvents } = require("./logger")

const loginLimiter = rateLimit({
    windowMs:60*1000, // 1 minute
    max:5, // Limit each IP to 5 login requests per 'window' per minute
    message:{
        message:"Too many login attempts from this IP,please try again after a 60 second pause"
    },
    handler:(req,res,next,options) => {
        logEvents(`Too many Requests: ${options.message.message} \t${req.method}\t${req.url}`,'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders:true,
    legacyHeaders:false
})
module.exports = loginLimiter;