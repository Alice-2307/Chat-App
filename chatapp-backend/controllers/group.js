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
        const userGroup = await userGroupModel.create({
            userId: req.user.id,
            groupId: groupid.id,
            admin: true
        })

        await messageModel.create({
            message: 'joined',
            userId: req.user.id,
            groupId: groupid.id
        })

        res.status(201).json({ Message: group, isAdmin: userGroup.admin });
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
            const checkAdmin = await userGroupModel.findOne({ where: { userId: userId } })
            return {
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

exports.groupMembers = async (req, res, next) => {
    try {
        const groupName = req.query.groupname;
        const groupId = await groupModel.findOne({ where: { name: groupName } })
        if (groupId) {
            const groupUser = await groupId.getUsers()
            const checkAdmin = await userGroupModel.findOne({ where: { userId: req.user.id, groupId: groupId.id } })
            console.log(checkAdmin);
            const userGroupNames = groupUser.map(async (group) => {
                const checkAdmin = await userGroupModel.findOne({ where: { userId: group.id, groupId: groupId.id } })
                return {
                    name: group.name,
                    isAdmin: checkAdmin.admin,
                }
            })
            const members = await Promise.all(userGroupNames);
            if(checkAdmin.admin===true){
            res.status(200).json({ Message: members, Result:true });
            }
            else{
                res.status(200).json({ Message: members});
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
        const user = req.query.user;
        const group = req.query.groupname;
        const userId = await userModel.findOne({ where: { name: user } })
        const groupId = await groupModel.findOne({ where: { name: group } })
        await userGroupModel.update(
            { admin: true },
            {
                where: {
                    userId: userId.id,
                    groupId: groupId.id
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
        const user = req.query.user;
        const group = req.query.groupname;
        const userId = await userModel.findOne({ where: { name: user } })
        const groupId = await groupModel.findOne({ where: { name: group } })
        const deleteVal = await userGroupModel.findOne({ where: { userId: userId.id, groupId: groupId.id } })
        const deleteDone = await deleteVal.destroy()
        if(deleteDone){
            await messageModel.create({
                message: 'removed',
                userId: userId.id,
                groupId: groupId.id
            })
        }

        res.status(200).json({ Message: 'succesful' })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'An error occurred' });
    }

}