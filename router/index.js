const express = require('express')
const User = require("../model")
const bcrypt = require('bcryptjs');
const { EventEmitterAsyncResource } = require('nodemailer/lib/xoauth2');
const generateToken = require('../utils');


const router = express.Router();


router.get('/test', (req, res) => res.json({ message: 'LogesS Api Testing successful' }));

router.post("/user", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });

        await newUser.save();
        return res.status(201).json({ message: "User created" });
    }
    res.status(404).json({ message: 'User Already Exists' });
})

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'user not found' });
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(401).json({ message: 'Incorrect Password' }); 
    }

    //generating token using JWT
    const token= generateToken(user);
    res.json({token});
});

module.exports = router;

