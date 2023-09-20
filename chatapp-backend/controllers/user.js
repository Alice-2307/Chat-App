const userModel = require("../models/user")
const bcrypt = require("bcrypt");

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
            return res.status(403).json({ Error: `User already exist, Please Login`})
        }
        res.status(500).json({ Error: 'An error occurred' });
    }
}