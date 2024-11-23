const User = require("../models/User")
const Note = require("../models/Note")
const asyncHanlder = require("express-async-handler");
const bcrypt = require("bcrypt");


const getAllUsers =asyncHanlder(async(req,res) => {
    const users = await User.find().select('-password').lean();
    console.log(users)
    if(!users?.length){
        return res.status(400).json({message:"No users found"})
    }
    res.json(users)  
})

const createNewUser =asyncHanlder(async(req,res) => {
    const { username,password,roles } = req.body
    
    // confirm data
    if(!username || !password ||  !Array.isArray(roles) || !roles.length){
        return res.status(400).json({message:"All fields are required"})
    }

    // check for duplicates
    const duplicate = await User.findOne({username})
    if(duplicate){
        return res.status(409).json({message:"Duplicate username"})
    }

     // Hash the password
    const hashPassword = await bcrypt.hash(password,10);
    
    const userObject = {username,"password":hashPassword,roles};

    // Create and store new user
    const user = await User.create(userObject)
    if(user){
        res.status(201).json({message:`New user ${username} created`})
    }else{
    res.status(400).json({message:'Invalid user data received'})
    }
})


const updateUser =asyncHanlder(async(req,res) => {

    const { id ,username,roles, active, password} = req.body

    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    const user = await User.findById(id)
    if(!user){
        return res.status(400).json({message:"User not found"})
    }
     
    // check for duplicate
    const duplicate = await User.findOne({username}).lean()

    // Allow update to original user
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message:"Duplicate username"})
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if(password){
        // Hash the password
        user.password = await bcrypt.hash(password,10)
    }

    const updatedUser = await user.save();

    res.json({message:`${updatedUser.username} updated`})
})


const deleteUser =asyncHanlder(async(req,res) => {
     const {id} = req.body;

     if(!id) {
         return res.status(400).json({message:"User ID required"})
     }

     const note = await Note.findOne({user:id}).lean()
     if(note){
        return res.status(400).json({message:"User has assigned notes"})
     }

     const user = await User.findById(id)
    if(!user){
        return res.status(400).json({message:"User not found"})
    }

    const result = await user.deleteOne()
    
    const reply = `Username ${result.username} with ID ${result._id} deleted`
    res.json({message: reply})
}) 

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}
