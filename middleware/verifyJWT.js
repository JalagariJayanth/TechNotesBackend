const jwt = require("jsonwebtoken")



const verifyJWT = (req,res,next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization

    // console.log(req.headers)

    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({message:'Unauthorized'})
    }

    const token = authHeader.split(" ")[1]
    // console.log(token);
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,user) => {
            // console.log(err)
            if(err) return res.status(403).json({message:'Forbidden'})
            //  console.log(decoded)
             req.user = user.username;
             req.roles = user.roles;
             next();
        }
    )

}

module.exports = verifyJWT;