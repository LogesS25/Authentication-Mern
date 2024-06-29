const express = require('express')
const User = require("../model")
const bcrypt = require("bcryptjs");
const generateToken = require('../utils');
const verifyToken = require('../middleware');
const nodemailer = require('nodemailer');
require('dotenv').config();



const router = express.Router();


router.get('/test', (req, res) => res.json({ message: 'LogesS Api Testing successful' }));

router.post("/user", async (req, res) => {
    const { email, password ,dateofbirth,work,age,location} = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({ email, password: hashedPassword,dateofbirth,work,age,location });

        await newUser.save();
        return res.status(201).json({ message: "User created" });
    }
    res.status(404).json({ message: 'User Already Exists' });
})

router.post('/all-users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/update-user/:id', async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;

    // Removing fields that should not be updated
    delete updates.email;
    delete updates.password;

    try {
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});



router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    console.log(password)

    if (!user) {
        return res.status(404).json({ message: 'user not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect Password' });
    }

    //generating token using JWT
    const token = generateToken(user);
    res.json({ token });
});

router.get("/data", verifyToken, (req, res) => {
    res.json({ message: `welcome,${req.user.email}! this is protected data` })
});


router.post("/reset-password", async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const token = Math.random().toString(36).slice(-8);
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 360000; //1hour

    await user.save();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "sivalog25@gmail.com",
            pass: process.env.NODEMAILER_PASSWORD,
        }
    })

    const message = {
        from: 'sivalog25@gmail.com',
        to: user.email,
        subject: "Password reset request",
        text: `You are receiving this email because you have requested to reset password for your account. \n\n please
        use the following token to reset : ${token} `
    }

    transporter.sendMail(message, (err, info) => {
        if (err) {
            res.status(404).json({ message: "something went wrong try again" });
        }
        res.status(200).json({ message: "password reset email sent" + info.response });
    })
})

router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    })
    if (!user) {
        return res.status(404).json({ message: "Invalid Token" });

    }

    console.log(password);

    const hashPassword = await bcrypt.hash(password,10);

    user.password = hashPassword;
    user.resetPasswordToken = null;
    user.resetPasswordToken = null;

    await user.save();
    res.json({ message: "Password reset successfully" });

})

module.exports = router;

