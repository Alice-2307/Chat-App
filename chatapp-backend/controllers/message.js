const messageModel = require("../models/message");

exports.userMessage = async (req, res, next) => {
    try {
        const msg = req.body.message;
        console.log(req.user);
        const data = await messageModel.create({
            message: msg,
            userId: req.user.id
        })
        res.status(201).json({ Message: data });
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'An error occurred' });
    }
}