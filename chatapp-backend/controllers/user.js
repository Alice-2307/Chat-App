const userModel = require("../models/user")
const messageModel = require("../models/message");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.signUpUser = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const phonenumber = req.body.phonenumber;
        const password = req.body.password;

        let hashPassword = await bcrypt.hash(password, 10)
        await userModel.create({
            name: name,
            email: email,
            phonenumber: phonenumber,
            password: hashPassword
        })
        console.log("User Added");
        res.status(201).json({ Message: 'User signup successfully' });

    } catch (err) {
        console.log(err);
        if (err.name === "SequelizeUniqueConstraintError") {
            return res.status(403).json({ Error: `User already exist, Please Login` })
        }
        res.status(500).json({ Error: 'An error occurred' });
    }
}

exports.loginUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const checkUser = await userModel.findOne({ where: { email: email } });

        if (checkUser) {
            const verifyPassword = await bcrypt.compare(password, checkUser.password);
            if (verifyPassword === true) {
                const jwtToken = jwt.sign({userId: checkUser.id}, process.env.SECRET_KEY)
                await messageModel.create({
                    message: 'joined',
                    userId: checkUser.id
                })
                return res.status(200).json({Message: "User login successfully", token: jwtToken})
            }
            else {
                return res.status(401).json({ Error: "User not authorized" })
            }
        }
        return res.status(404).json({ Error: "User not found" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'An error occurred' });
    }
}