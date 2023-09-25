const jwt = require("jsonwebtoken");

const userModel = require("../models/user")

exports.authentication = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        const user = jwt.verify(token, process.env.SECRET_KEY);
        const userId = await userModel.findByPk(user.userId);
        req.user = userId;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ Error: "An error occurred" })
    }
}