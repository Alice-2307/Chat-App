const messageModel = require("../models/message");
const userModel = require("../models/user");
const groupModel = require("../models/group");
const Sequelize = require("sequelize");


exports.userMessage = async (req, res, next) => {
    try {
        const msg = req.body.message;
        const groupId = req.body.groupid;
        const group = await groupModel.findByPk(groupId);
        const data = await messageModel.create({
            message: msg,
            userId: req.user.id,
            groupId: group.id
        })
        res.status(201).json({ Message: data });
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'An error occurred' });
    }
}

exports.getUserMessage = async (req, res, next) => {
    try {
        const lastMessage = +req.query.lastmessageid;
        const groupId = req.query.groupid;
        console.log(groupId);
        const group = await groupModel.findByPk(groupId);
        let allMessage;
        if (lastMessage === 0) {
            allMessage = await messageModel.findAll({
                where: {
                    groupId: group.id
                },
                include: [{ model: userModel, attributes: ['name', 'email'] }]
            });
        }
        else {
            allMessage = await messageModel.findAll({
                where: {
                        groupId: group.id,
                    id: {
                        [Sequelize.Op.gt]: lastMessage
                    }
                },
                include: [{ model: userModel, attributes: ['name', 'email'] }]
            });
        }
        const userMessages = allMessage.map((message) => ({
            username: message.user.email,
            sender: message.user.name,
            message: message.message,
            id: message.id
        }));
        res.status(200).json({ Message: userMessages });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'An error occurred' });
    }
}