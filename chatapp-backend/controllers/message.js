const messageModel = require("../models/message");
const userModel = require("../models/user");

exports.userMessage = async (req, res, next) => {
    try {
        const msg = req.body.message;
        const data = await messageModel.create({
            message: msg,
            userId: req.user.id
        })
        res.status(201).json({ Message: 'Send Successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'An error occurred' });
    }
}

exports.getUserMessage = async (req, res, next) => {
    try {
        const allMessage = await messageModel.findAll({
            include: [{ model: userModel, attributes: ['name', 'email'] }]
        });
        const userMessages = allMessage.map((message) => ({
            username: message.user.email,
            sender: message.user.name,
            message: message.message,
        }));
        res.status(200).json({ Message: userMessages });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'An error occurred' });
    }
}