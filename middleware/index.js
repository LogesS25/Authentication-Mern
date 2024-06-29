const jwt = require('jsonwebtoken')
const User = require('../model');
require('dotenv').config();


const verifyToken = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        res.status(401).json({message:"missing token"});
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token,process.env.TOKEN, async (err,decode) =>{
        if(err){
            return res.status(403).json({message:"invalid token"});
        }
        const user = await User.findOne({_id:decode.id})

        if(!user){
            return res.status(404),json({message:"user not found"});
        }

        req.user = user;
        next();
    })
};

module.exports = verifyToken