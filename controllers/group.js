const groupModel = require("../models/group");
const userGroupModel = require("../models/userGroup");
const userModel = require("../models/user");
const messageModel = require("../models/message");
const S3Service = require("../services/s3service");

exports.addGroupName = async (req, res, next) => {
    try {
        const grpName = req.body.name;
        const group = await groupModel.create({
            name: grpName,
        })
        const userGroup = await userGroupModel.create({
            userId: req.user.id,
            groupId: group.id,
            admin: true
        })

        await messageModel.create({
            message: 'joined',
            userId: req.user.id,
            groupId: group.id
        })

        res.status(201).json({ Group: group, isAdmin: userGroup.admin });
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

        const groupNames = groups.map(async (group) => {
            const checkAdmin = await userGroupModel.findOne({ where: { userId: userId, groupId: group.id } })
            return {
                id: group.id,
                name: group.name,
                isAdmin: checkAdmin.admin
            }
        });
        const result = await Promise.all(groupNames);

        res.status(201).json({ Message: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'An error occurred' });
    }
}

exports.inviteUser = async (req, res, next) => {
    try {
        const groupId = req.body.groupId;
        const userToInvite = req.body.userToInvite;

        const group = await groupModel.findByPk(groupId);

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

exports.groupMembers = async (req, res, next) => {
    try {
        const groupId = req.query.groupid;
        const group = await groupModel.findByPk(groupId)
        if (group) {
            const groupUser = await group.getUsers()
            const checkAdmin = await userGroupModel.findOne({ where: { userId: req.user.id, groupId: group.id } })
            const userGroupNames = groupUser.map(async (user) => {
                const checkAdmin = await userGroupModel.findOne({ where: { userId: user.id, groupId: group.id } })
                return {
                    id: user.id,
                    name: user.name,
                    isAdmin: checkAdmin.admin,
                }
            })
            const members = await Promise.all(userGroupNames);
            if (checkAdmin.admin === true) {
                res.status(200).json({ Members: members, Result: true });
            }
            else {
                console.log('else');
                res.status(200).json({ Members: members });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'An error occurred' });
    }
}

exports.makeAdmin = async (req, res, next) => {
    try {
        const userId = req.query.userid;
        const groupId = req.query.groupid;
        const user = await userModel.findByPk(userId);
        const group = await groupModel.findByPk(groupId);
        await userGroupModel.update(
            { admin: true },
            {
                where: {
                    userId: user.id,
                    groupId: group.id
                }
            }
        )

        res.status(200).json({ Message: "Done" })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'An error occurred' });
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.query.userid;
        const groupId = req.query.groupid;
        const user = await userModel.findByPk(userId)
        const group = await groupModel.findByPk(groupId)
        const deleteVal = await userGroupModel.findOne({ where: { userId: user.id, groupId: group.id } })
        const deleteDone = await deleteVal.destroy()
        if (deleteDone) {
            await messageModel.create({
                message: 'removed',
                userId: user.id,
                groupId: group.id
            })
        }

        res.status(200).json({ Message: 'Done' })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'An error occurred' });
    }

}

exports.uploadFile = async (req, res) => {
    try{
        const file = req.file;
        const date = new Date().getTime();
        const groupId = req.body.groupId;
        const fileName = `groups/${groupId}/${file.originalname}/${date}`
        const fileUrl = await S3Service.uploadtoS3(file, fileName);
        const split = fileUrl.split('/')
        const message = await messageModel.create({
            message: `<a href=${fileUrl}>Download-${split[5]}</a>`,
            userId: req.user.id,
            groupId: groupId
        })
        res.status(200).json({Message: message.message});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'An error occurred' });
    }
};
