const express = require("express");
const bcrypt = require("bcrypt")
const User = require("../models/userModel");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {

        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            throw new Error("User already exists!");
        }

        const salt = await bcrypt.genSalt(10);
        const hashed_pw = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashed_pw;

        const user = new User(req.body);
        await user.save();
        res.send({
            success: true,
            message: "User has been registered!",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }

});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        throw new Error("User doesn't exist")
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
        throw new Error("Password Not Correct")
    }

    res.send({
        success:true,
        message:"User logged in successfully"
    })
    
  } catch (error) {
    res.send({
        success: false,
        message: error.message
    })
  }
});


module.exports = router;