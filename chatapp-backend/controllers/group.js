const groupModel = require("../models/group");
const userGroupModel = require("../models/userGroup");
const userModel = require("../models/user");
const messageModel = require("../models/message");

exports.addGroupName = async (req, res, next) => {
    try {
        const grpName = req.body.name;
        const group = await groupModel.create({
            name: grpName,
        })
        const groupid = await groupModel.findOne({ where: { name: grpName } });
        await userGroupModel.create({
            userId: req.user.id,
            groupId: groupid.id
        })

        await messageModel.create({
            message: 'joined',
            userId: req.user.id,
            groupId: groupid.id
        })

        res.status(201).json({ Message: group });
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'An error occurred' });
    }
}

exports.getGroup = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findByPk(userId);

        const groups = await user.getGroups();

        const groupNames = groups.map((group) => ({
            name: group.name
        }));

        res.status(201).json({ Message: groupNames });
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'An error occurred' });
    }
}

exports.inviteUser = async (req, res, next) => {
    try {
        const groupName = req.body.groupName;
        const userToInvite = req.body.userToInvite;

        const group = await groupModel.findOne({ where: { name: groupName } });

        const inviteUser = await userModel.findOne({ where: { email: userToInvite } });
        if (!inviteUser) {
            return res.status(400).json({ Error: 'Email not found' });

        }
        const checkUser = await group.hasUser(inviteUser)
        if (checkUser) {
            res.status(400).json({ Error: "User is already a member of the group" })
        }
        else {
            await group.addUser(inviteUser);

            await messageModel.create({
                message: 'joined',
                userId: inviteUser.id,
                groupId: group.id
            })
            res.status(201).json({ Message: 'succesfully added' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'An error occurred' });
    }

}