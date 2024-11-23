const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")


const login = asyncHandler(async(req,res) => {
    const {username,password} = req.body;

    if(!username || !password){
        return res.status(400).json({message:"All fileds are required"})
    }

    const foundUser =await User.findOne({username})


    if(!foundUser || !foundUser.active){
        return res.status(401).json({message:'Unauthorized'})
    }

    const match = await bcrypt.compare(password,foundUser.password)
    
    if(!match){
        return res.status(401).json({message:'Unauthorized'})
    }
    
    const userInfo = {
        "username":foundUser.username,
        "roles":foundUser.roles
    }

    const accessToken = jwt.sign(userInfo,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})

    res.json({accessToken})

})


module.exports = {
    login
}